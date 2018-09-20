// Copyright (c) 2018 ml5
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
Style Transfer Image Example using p5.js
This uses a pre-trained model of The Great Wave off Kanagawa and Udnie (Young American Girl, The Dance)
=== */

let style;
let video;
let resultImg;

function setup() {
  createCanvas(320, 240).parent('canvasContainer');

  video = createCapture(VIDEO);
  video.hide();

  // The results image from the style transfer
  resultImg = createImg('');
  resultImg.hide();

  // Create a new Style Transfer method with a defined style.
  // We give the video as the second argument
  style = ml5.styleTransfer('models/fuchun', video, modelLoaded);
}

function draw(){
  image(resultImg, 0, 0, 320, 240);
}

// A function to call when the model has been loaded.
function modelLoaded() {
  select('#status').html('Model Loaded');
  style.transfer(gotResult);
}

// When we get the results, update the result image src
function gotResult(err, img) {
  resultImg.attribute('src', img.src);
  style.transfer(gotResult);
}
