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

function handleVideoChange() {
    let val = this.value;
    console.log(val);
    if (val.startsWith('https://youtu.be/')) {
        val = val.substring('https://youtu.be/'.length, val.length);
    } else if (val.startsWith('https://www.youtube.com/watch?v=')) {
        val = val.substring('https://www.youtube.com/watch?v='.length, val.length);
    } else {
        alert('bad url')
    }
    console.log(val);
    createPlayer(this.value.trim())
}

document.getElementById('link').onchange = handleVideoChange;

function startTimer(time) {
    if (player == null || time == -1) alert('no video selected')
    setTimeout(function() {
        player.playVideo();
    }, time - duration);
}