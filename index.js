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

function handleClick() {
    let time = document.getElementById('h').value * 60 * 60
             + document.getElementById('m').value * 60
             + document.getElementById('s').value;
    startTimer(time);
}

document.getElementById('start').onclick = handleClick;


// time in seconds
function startTimer(time) {
    if (player == null || time == -1) alert('no video selected')
    console.log('Starting ' + time + ' second timer');
    setTimeout(function() {
        player.playVideo();
    }, time * 1000 - duration * 1000);
}