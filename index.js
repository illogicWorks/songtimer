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

let hI = document.getElementById('h');
let mI = document.getElementById('m');
let sI = document.getElementById('s');

// record TimeInfo(int h, int m, int s)
let current = null;

function handleClick() {
    let h = parseInt(hI.value);
    let m = parseInt(mI.value);
    let s = parseInt(sI.value);

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
    current = {h, m, s};
    setInterval(tickTimer, 1000);
}

function valuePadded(val) {
    if (val < 10)
        val = '0' + val;
    this.value = val;
}
HTMLInputElement.prototype.valuePadded = valuePadded;

function tickTimer() {
    let {h, m, s} = current;
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
            hI.valuePadded(--current.h);
        }
        current.m = m;
        mI.valuePadded(m);
    }
    current.s = s;
    sI.valuePadded(s);
}

document.getElementById('start').onclick = handleClick;