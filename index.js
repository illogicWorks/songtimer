'use strict';

function onPlayerReady(event) {
    console.log('hi ' + event);
}

function createPlayer(id) {
    let player = YT.createPlayer('playerdiv', {
        height: '360',
        width: '640',
        videoId: id,
        events: {
          'onReady': onPlayerReady
        }
    });
    


}