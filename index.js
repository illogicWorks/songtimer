'use strict';
let player = null;
let duration = -1;

const startBT = document.getElementById('start');

const hI = document.getElementById('h');
const mI = document.getElementById('m');
const sI = document.getElementById('s');

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
    if (url){
        console.warn('bad url: ' + url);
        startBT.disabled = true;
    }
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
        player.cueVideoById(id);
    else
        createPlayer(id)
    startBT.disabled = false;
}

document.getElementById('link').onchange = handleVideoChange;
function onYouTubeIframeAPIReady() {
    handleVideoChange({
        target: document.getElementById('link')
    })
}

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

function setPadded(el, val) {
    if (val == 0) {
        el.value = '';
        return;
    }
    if (val < 10)
        val = '0' + val;
    el.value = val;
}

function tickTimer() {
    let {h, m, s} = current;
    s--;
    if (!h && !m && !s) {
        clearInterval(this);
        hI.disabled = true;
        mI.disabled = true;
        sI.disabled = true;
        startBT.disabled = false;
        sI.value = '00';
        current = null;
        return;
    }
    if (s < 0) {
        s = 59;
        m--;
        if (m < 0) {
            m = 59;
            setPadded(hI, --current.h);
        }
        current.m = m;
        setPadded(mI, m);
    }
    current.s = s;
    setPadded(sI, s);
}

startBT.onclick = handleClick;

function makeInputSwitch(elem, prevInput, postInput) {
    const MAX_LEN = 2;
    elem.addEventListener('keydown', function(e) {
        if (e.isComposing || e.keyCode === 229) {
            return;
        }
        if (e.srcElement.value.length >= MAX_LEN) {
            if(postInput != null) postInput.focus();
        }else if (e.keyCode === 8 && e.srcElement.value.length == 0) {
            if(prevInput != null) {
                prevInput.focus();
            }
        }
    }, false)
}

makeInputSwitch(hI, null, mI);
makeInputSwitch(mI, hI, sI);
makeInputSwitch(sI, mI, null);
