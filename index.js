'use strict';
let ev = null;
let player = null;
let duration = -1;

function onPlayerReady(event) {
    duration = player.getDuration();
    console.log('Player is ready');
}

function createPlayer(id) {
    console.log('Changing player to ' + id)
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
    alert('bad url')
}

function handleVideoChange() {
    let val = this.value;
    let videoInfo = getVideoId(this.value);
    if (videoInfo.service != 'youtube') {
        badUrl(val);
        return;
    } else {
        val = videoInfo.id;
    }
    if (player != null)
        player.destroy();
    createPlayer(val)
}

document.getElementById('link').onchange = handleVideoChange;

// time in seconds
function startTimer(time) {
    if (player == null || time == -1) alert('no video selected')
    setTimeout(function() {
        player.playVideo();
    }, time * 1000 - duration * 1000);
}