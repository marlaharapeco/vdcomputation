let handPose;
let video;
let hands = [];
let canvas;
let previewOverlay;
let previewContainer;
let previewImg;
let closeBtn;
let captureBtn;

let options = {flipped: true};

let pts = []; let heartColor = 255;
let hearts = []; let heartCreated = false;
let colorPalette = ["#b90f0f", "#f21212", "#fffcf5", "#1cbf26", "#13731f"];

function preload() {
  // Load the handPose model
  handPose = ml5.handPose(options);
}

function setup() {
  canvas = createCanvas(1280, 960);
  canvas.parent('canvas-container');

  // Create the webcam video and hide it
  video = createCapture(VIDEO, options);
  video.size(1280, 960);
  video.hide();

  // Overlay
  previewOverlay = createDiv();
  previewOverlay.addClass('preview-overlay');
  previewOverlay.hide();

  previewContainer = createDiv();
  previewContainer.addClass('preview-container');
  previewOverlay.child(previewContainer);

  // Image
  previewImg = createImg('');
  previewImg.addClass('preview-img');
  previewOverlay.child(previewImg);

  // Capture Button
  captureBtn = createButton('~//~📸~//~');
  captureBtn.addClass('capture-btn');
  captureBtn.mousePressed(showPreview);

  // Close Button
  closeBtn = createButton('X');
  closeBtn.addClass('close-btn');
  closeBtn.mousePressed(closePreview);
  previewOverlay.child(closeBtn);


  // start detecting hands from the webcam video
  handPose.detectStart(video, gotHands);

  let refreshBtn = createButton('clear');
  refreshBtn.addClass('reload-btn');
  refreshBtn.mousePressed(() => location.reload());

  let btn = createButton('download');
  btn.addClass('download-btn');
  btn.mousePressed(captureAndDownload);

}

function draw() {
  // Draw the webcam video
  clear();
  image(video, 0, 0, width, height);

  // Draw all the tracked hand points
  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];
    let handedness = hand.handedness;
    let keypoints = hand.keypoints;
    
    if (handedness == "Left") {
      pts[0] = keypoints[4];
      pts[1] = keypoints[3];
      pts[2] = keypoints[2];
      pts[3] = keypoints[5];
      pts[4] = keypoints[6];
      pts[5] = keypoints[7];
      pts[6] = keypoints[8];
    }
    
    if (handedness == "Right") {
      pts[7] = keypoints[8];
      pts[8] = keypoints[7];
      pts[9] = keypoints[6];
      pts[10] = keypoints[5];
      pts[11] = keypoints[2];
      pts[12] = keypoints[3];
      pts[13] = keypoints[4];
    }
  }
  
  fill(heartColor);
  beginShape();
  for (let i=0; i<pts.length; i++) {
    if (pts[i]) {
      vertex(pts[i].x, pts[i].y);
    }
  }
  endShape(CLOSE);
  
  checkForHeart();
  
  for (let i=0; i<hearts.length; i++) {
    hearts[i].display();
  }
  
}

function checkForHeart() {
  let rightThumb = pts[13];
  let leftThumb = pts[0];
  let rightIndex = pts[7];
  let leftIndex = pts[6];
  
  if (rightThumb && leftThumb && rightIndex && leftIndex) {
    let thumbDist = dist(rightThumb.x, rightThumb.y, leftThumb.x, leftThumb.y);
    let indexDist = dist(rightIndex.x, rightIndex.y, leftIndex.x, leftIndex.y);
    
    if(thumbDist < 40 && indexDist < 40 && !heartCreated) {
      hearts.push(new Heart(pts));
      heartCreated = true;
    }  else if(thumbDist > 50 || indexDist > 50) {
       heartCreated = false;
    }           
    
  }
}

function gotHands(results) {
  // save the output to the hands variable
  hands = results;
}

function captureAndDownload() {
  saveCanvas('HandDrawing', 'jpg');
}

function showPreview() {
  const imgData = canvas.elt.toDataURL('image/jpg');
  previewImg.attribute('src', imgData);
  previewOverlay.show();
}

function closePreview() {
  previewOverlay.hide();
}