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
        height: '100%',
        width: '100%',
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
    console.warn('bad url: ' + url);
}

function handleVideoChange({target}) {
    let val = target.value;
    console.log('Input set to ' + val);
    let {id, service} = getVideoId(val);
    if (service != 'youtube') {
        if (val == '')
            if (player != null) {
                player.destroy()
                player = null;
                duration = -1;
            }
        else
            badUrl(val);
        updateButtonStatus();
        return;
    }
    if (player != null)
        player.cueVideoById(id);
    else
        createPlayer(id);
    updateButtonStatus();
}

document.getElementById('link').onchange = handleVideoChange;
function onYouTubeIframeAPIReady() {
    handleVideoChange({
        target: document.getElementById('link')
    })
}

// record TimeInfo(int h, int m, int s, TimeOut timeout)
let current = null;

HTMLInputElement.prototype.intVal = function() {
    let val = this.value;
    if (val == '') return 0;
    return parseInt(val);
}

function doStart() {
    let h = hI.intVal();
    let m = mI.intVal();
    let s = sI.intVal();

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
    document.getElementById('link').disabled = true;
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
        hI.disabled = false;
        mI.disabled = false;
        sI.disabled = false;
        startBT.disabled = true;
        document.getElementById('link').disabled = false;
        setPadded(sI, 0);
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

startBT.onclick = doStart;

function updateButtonStatus() {
    console.log('Updating button status');
    let enabled = duration != -1 && (sI.intVal() || mI.intVal() || hI.intVal());
    startBT.disabled = !enabled;
}

function makeInputSwitch(elem, prevInput, postInput) {
    const MAX_LEN = 2;
    elem.addEventListener('input', updateButtonStatus);
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
