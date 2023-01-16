'use strict';
let ev = null;
let player = null;
let duration = -1;

function onPlayerReady(event) {
    duration = player.getDuration();
    console.log('Player is ready');
}

function createPlayer(id) {
    console.debug('Changing player to ' + id)
    duration = -1;
    player = new YT.Player('playerdiv', {
        height: '360',
        width: '640',
        videoId: id,
        playerVars: {
            controls: 0,
            disablekb: 1,
            rel: 0
        },
        events: {
          'onReady': onPlayerReady
        }
    });
}

function badUrl(url) {
    if (url)
        alert('bad url: ' + url)
}

function handleVideoChange({target}) {
    let val = target.value;
    console.log('Input set to ' + val);
    let {id, service} = getVideoId(val);
    if (service != 'youtube') {
        badUrl(val);
        return;
    }
    if (player != null)
        player.destroy();
    createPlayer(id)
}

document.getElementById('link').onchange = handleVideoChange;
function onYouTubeIframeAPIReady() {
    handleVideoChange({
        target: document.getElementById('link')
    })
}

function toInt(id) {
    return parseInt(document.getElementById(id).value);
}

// record TimeInfo(Input hI, Input mI, Input sI, int h, int m, int s)
let current = null;

function handleClick() {
    let timeInfo = {};
    timeInfo.hI = document.getElementById('h');
    timeInfo.mI = document.getElementById('m');
    timeInfo.sI = document.getElementById('s');
    timeInfo.h = parseInt(timeInfo.hI.value);
    timeInfo.m = parseInt(timeInfo.mI.value);
    timeInfo.s = parseInt(timeInfo.sI.value);

    let time = h * 60 * 60 + m * 60 + s;
    console.log('Starting ' + time + ' second timer');
    if (player == null || time == -1) {
        alert('no video selected or not yet loaded');
        return;
    }
    setTimeout(function() {
        player.playVideo();
    }, time * 1000 - duration * 1000);
    hI.disabled = true;
    mI.disabled = true;
    sI.disabled = true;
    this.disabled = true;
    current = timeInfo;
    setInterval(tickTimer, 1000);
}

function tickTimer() {
    let {hI, mI, sI, h, m, s} = current;
    s--;
    if (!h && !m && !s) {
        clearInterval(this);
        hI.disabled = true;
        mI.disabled = true;
        sI.disabled = true;
        document.getElementById('start').disabled = false;
        current = null;
    }
    if (s < 0) {
        s = 59;
        m--;
        if (m < 0) {
            m = 59;
            current.h--;
            hI.value = current.h;
        }
        current.m = m;
        mI.value = m;
    }
    current.s = s;
    sI.value = s;
}

document.getElementById('start').onclick = handleClick;