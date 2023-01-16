'use strict';

let player = null;
let duration = -1;

function onPlayerReady(event) {
    duration = event.player.getDuration();
    console.log('hi ' + event);
}

function createPlayer(id) {
    player = YT.createPlayer('playerdiv', {
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