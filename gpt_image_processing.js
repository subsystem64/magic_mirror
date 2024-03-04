//capture image from iphone front camera 
function captureImage() {
	navigator.camera.getPicture(onSuccess, onFail, {
		quality: 50,
		destinationType: Camera.DestinationType.FILE_URI, //?
		sourceType: Camera.PictureSourceType.CAMERA,
		correctOrientation: true
	});
}
//process image and give compliment through openai api
function processImage(imageURI) {
	var fileURL = imageURI;
	var options = new FileUploadOptions();
	options.fileKey = "file";
	options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
	options.mimeType = "image/jpeg";
	var params = {};
	params["image"] = fileURL;
	options.params = params;
	var ft = new FileTransfer();
	ft.upload(fileURL, encodeURI("https://api.openai.com/v1/engines/davinci/completions"), win, fail, options);
}