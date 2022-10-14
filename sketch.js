/*
DIGF-6037 Creation & Computation FW2022
Screen Space 3.2 PoseNet Scaffold (webcam)

based on 
https://editor.p5js.org/ml5/sketches/PoseNet_webcam
https://editor.p5js.org/codingtrain/sketches/ULA97pJXR
*/

let capture;
let poseNet;
let poses = [];
let skeleton;
let bodies;


function setup() {
  //frameRate(50);
  createCanvas(800, 600);
  capture = createVideo("ppls2.mp4", onVideoLoad);
  capture.autoplay(false);
  capture.hide();
  capture.speed(1);
  poseNet = ml5.poseNet(capture, modelReady);
  poseNet.on("pose", gotPoses);
  bodies = new BodyManager()
}
function onVideoLoad() {
  // The media will not play until some explicitly triggered.

  capture.volume(0);
}
function draw() {
  scale(0.5);
  // capture.loadPixels();
  
  // capture.updatePixels();
  
  image(capture, 0, 0);
  filter(GRAY)
  // if (poses.length > 0) {
  //   for (let i = 0; i < poses.length; i++) {
  //     drawKeypoints(poses[i]);
  //   }
  // }
  bodies.display();
}
function gotPoses(posesRaw) {
  //Todo: check if poses have changed.
  poses = []
  if (posesRaw.length > 0) {
    for (let i = 0; i < posesRaw.length; i++) {
      poses[i] = posesRaw[i].pose;
      //skeleton = poses[0].skeleton;
    }
  }
  bodies.managePoses(poses);
}

function comparePoses(pose1, pose2, threshold) {
  let total = 0
  let i = 0
  while (total < threshold && i < 17) {
    total += dist(pose1.keypoints[i].position.x,
      pose1.keypoints[i].position.y,
      pose2.keypoints[i].position.x,
      pose2.keypoints[i].position.y)
    i++
  } if (i < 17) {
    return -1
  }
  return total
}

function modelReady() {
  console.log("Model Loaded");
}


function onMousePressed() {
  capture.play();
}
function keyPressed() {
  if (key == "z") {
    capture.play();
  }
  if (key == "a") {
    capture.pause();
    print(poses);
  }
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
function drawKeypoints(pose) {
  for (let i = 0; i < pose.keypoints.length; i++) {
    let keypoint = pose.keypoints[i];
    noStroke();
    fill(255, 255, 255)
    circle(keypoint.position.x, keypoint.position.y, 10);
  }
}
