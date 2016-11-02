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

	getVideo: function(vidId) {

		return new Promise((resolve, reject) => {

			const youtubeUrl = `http://www.youtube.com/watch?v=${vidId}`;
			const videoFile = utils.randomFileName() + '.mp4';
			const audioFile = utils.randomFileName() + '.mp3';

			const videoPath = path.join(config.files, videoFile);
			const audioPath = path.join(config.files, audioFile);

			//start downloading a video
			const videoStream = ytdl(youtubeUrl, {
				format: function (format) {
					return format.container === 'mp4';
				}
			}).pipe(fs.createWriteStream( videoPath ));

			//save some data 
			const vid = new Video();
			vid.youtubeId = vidId;
			vid.dateCreated = Date.now();
			vid.dateEdited = Date.now();
			vid.inProgress = true;
			vid.videoCompleted = false;
		
			vid.save( (err, obj) => {
				if(err)
					console.error(err);
				this.entryId = obj.id;
				console.log('saved id', this.entryId);
			})

			console.log('VIDEO DOWNLOADING');

			fetchTitle()
			.then( res => res.json() )
			.then( data => {
				const payload = data.items[0].snippet;
				//save the payload data
				const vid = Video.findById(this.entryId, (err, vid) => {
					if(err)
						console.error(err);
					
					vid.title = payload.title;
					vid.description = payload.description;	
					vid.thumbnails = payload.thumbnails;

					vid.save( (err, obj) => {
						if(err)
							console.error(err);
						console.log('saved from fetch', this.entryId);
					})

				})

			})

			//start fetching metadata
			function fetchTitle(hook) {
				const path = `https://www.googleapis.com/youtube/v3/videos?id=${vidId}` +
					`&key=${key}` +
					"&fields=items(snippet(title, description, thumbnails))&part=snippet";

				return fetch(path);
			}

			//when video is finished loading
			videoStream.on('finish', () => {
				console.log('finished');
				//update the video from above
				const vid = Video.findById(this.entryId, (err, vid) => {
					if(err)
						console.error(err);
					
					vid.videoPath = videoFile;
					vid.inProgress = false;	
					vid.videoCompleted = true;

					vid.save( (err, obj) => {
						if(err)
							console.error(err);
						
						console.log('saved from download', this.entryId);
					})

				})

				resolve();
			});
		
		});	
	}

};