//capture image from iphone front camera 
(function() {

	var width = 320; // We will scale the photo width to this
	var height = 0; // This will be computed based on the input stream

	var streaming = false;

	var video = null;
	var canvas = null;
	var photo = null;
	var startbutton = null;

	function startup() {
		video = document.getElementById('video');
		canvas = document.getElementById('canvas');
		photo = document.getElementById('photo');

		navigator.mediaDevices.getUserMedia({
				video: true,
				audio: false
			})
			.then(function(stream) {
				video.srcObject = stream;
				video.play();
			})
			.catch(function(err) {
				console.log("An error occurred: " + err);
			});

		video.addEventListener('canplay', function(ev) {
			if (!streaming) {
				height = video.videoHeight / (video.videoWidth / width);

				if (isNaN(height)) {
					height = width / (4 / 3);
				}

				video.setAttribute('width', width);
				video.setAttribute('height', height);
				canvas.setAttribute('width', width);
				canvas.setAttribute('height', height);
				streaming = true;
			}
		}, false);

		window.setInterval(takepicture, 10000);
		clearphoto();
	}


	function clearphoto() {
		var context = canvas.getContext('2d');
		context.fillStyle = "#AAA";
		context.fillRect(0, 0, canvas.width, canvas.height);

		var data = canvas.toDataURL('image/png');
		photo.setAttribute('src', data);
	}

	function takepicture() {
		var context = canvas.getContext('2d');
		if (width && height) {
			canvas.width = width;
			canvas.height = height;
			context.drawImage(video, 0, 0, width, height);

			var data = canvas.toDataURL('image/png');
			photo.setAttribute('src', data);
		} else {
			clearphoto();
		}
	}

	window.addEventListener('load', startup, false);
})();

//process image and give compliment through openai api
function processImage(imageURI) {
	var fileURL = imageURI;
	var options = new FileUploadOptions();
	options.fileKey = "file";
	options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
	options.mimeType = "image/png";
	var params = {};
	params["image"] = fileURL;
	options.params = params;
	var ft = new FileTransfer();
	ft.upload(fileURL, encodeURI("https://api.openai.com/v1/engines/davinci/completions"), win, fail, options);
}