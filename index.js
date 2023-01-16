'use strict';
let ev = null;
let player = null;
let duration = -1;

function onPlayerReady(event) {
    duration = player.getDuration();
    console.log('hi ' + event);
}

function createPlayer(id) {
    player = new YT.Player('playerdiv', {
        height: '360',
        width: '640',
        videoId: id,
        events: {
          'onReady': onPlayerReady
        }
    });
}

function startTimer(time) {
    if (player == null || time == -1) alert('no video selected')
    setTimeout(function() {
        player.playVideo();
    }, time - duration);
}