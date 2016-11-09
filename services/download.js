const _ = require('underscore');
const path = require('path');
const fs = require('fs');
const ytdl = require('ytdl-core');
const config = require('./../config');
const utils = require('./../utils');
const fetch = require('node-fetch');

const Video = require('./../models/video');

const key = 'AIzaSyDf0dAPd8_dcfj7Ucla3eFPZZ0ytf5t7nc';

module.exports = {
  // get a video from youtube
  getVideo(vidId) {
    // let emptyVideo = {};

    return new Promise((resolve, reject) => {
       Video.findOne({ 'youtubeId' : vidId })
        .then((vid) => {
          
        })

      // get meta data 
      this.getMetadata(vidId)
        .then(data => data.json())
        .then((data) => {
          // console.log('meta ', data.items[0].snippet);
        });
      // download the video
      this.downloadVideo(vidId)
        .then();

      // let counter = 0;
      // const count = () => {
      //   counter ++;
      //   if (counter >= 2) {

      //   }
      // }
    });
  },
  //
  getMetadata(vidId) {
    const url = `https://www.googleapis.com/youtube/v3/videos?id=${vidId}` +
    `&key=${key}` +
    '&fields=items(snippet(title, description, thumbnails))&part=snippet';
    return fetch(url);
  },
  //
  downloadVideo(vidId) {
    return new Promise((resolve, reject) => {
      const youtubeUrl = `http://www.youtube.com/watch?v=${vidId}`;
      const videoFile = `${utils.randomFileName()}+ .mp4`;
      // const audioFile = utils.randomFileName() + '.mp3';
      const videoPath = path.join(config.files, videoFile);
      // const audioPath = path.join(config.files, audioFile);

      // start downloading a video
      const videoStream = ytdl(youtubeUrl, {
        format(f){
          return f.container === 'mp4';
        },
      }).pipe(fs.createWriteStream(videoPath));

      // when video is finished loading
      videoStream.on('finish', () => {
        // console.log('vid is finished');
        resolve();
      });
    });
  },
};
