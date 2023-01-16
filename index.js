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

// time in seconds
function startTimer(time) {
    if (player == null || time == -1) alert('no video selected')
    setTimeout(function() {
        player.playVideo();
    }, time * 1000 - duration * 1000);
}


function makeInputSwitch(elem, prevInput, postInput) {
    const MAX_LEN = 2;
    elem.addEventListener('keyup', function(e) {
        if (e.srcElement.value.length >= MAX_LEN) {
            if(postInput != null) postInput.select();
        } else if (e.srcElement.value.length == 0) {
            if(prevInput != null) prevInput.select();
        }
    }, false)
}

let hourInput = document.getElementById("h");
let minuteInput = document.getElementById("m");
let secondInput = document.getElementById("s");

makeInputSwitch(hourInput, null, minuteInput);
makeInputSwitch(minuteInput, hourInput, secondInput);
makeInputSwitch(secondInput, minuteInput, null);