/*
DIGF-6037 Creation & Computation FW2022
Screen Space 3.2 PoseNet Scaffold (webcam)

based on 
https://editor.p5js.org/ml5/sketches/PoseNet_webcam
https://editor.p5js.org/codingtrain/sketches/ULA97pJXR
*/

let capture;
let cutOutOriginal;
let newGraphic;
let cutOutNew;
let poseNet;
let poses = [];
let skeleton;
let bodies;
let feed = false
let desiredWindowWidth = 1000  //7935
let desiredWindowHeight = 600  //2034
let doorwayWidth = 600
let doorwayHeight = 500
let fadeFrame


function setup() {
  //frameRate(50);
  createCanvas(desiredWindowWidth, desiredWindowHeight);
  capture = createVideo("ppls2.mp4", onVideoLoad);
  capture.autoplay(false);
  capture.hide();
  capture.speed(1);
  poseNet = ml5.poseNet(capture, modelReady);
  poseNet.on("pose", gotPoses);
  newGraphic = createGraphics(1920,1080);
  bodies = new BodyManager(newGraphic)

  
}
function onVideoLoad() {
  // The media will not play until some explicitly triggered.

  capture.volume(0);
}
function draw() {
  background(0)
  //fadeFrame.push(newGraphic.get());
  newGraphic.clear()


  //newGraphic.translate(-newGraphic.width,0)
  let cutOutSmall = capture.get(0, 0, 
    doorwayWidth, doorwayHeight)
  let cutOutLarge = capture.get(doorwayWidth,0,
    capture.width,capture.height)
  cutOutLarge.filter(GRAY)
  bodies.display(newGraphic);
  let cutOutLargeGraphic = newGraphic.get(doorwayWidth,0,
    capture.width,capture.height)
  let cutOutSmallGraphic = newGraphic.get(0, 0, 
    doorwayWidth, doorwayHeight)
  cutOutSmallGraphic.filter(GRAY)
 
  //newGraphic.rect(0,0,200,200)
  //image(newGraphic,0,0,192,108)
  push()
  scale(-1,1)
  if(feed){
    image(cutOutSmall,-width,0,width,height)
    image(cutOutSmallGraphic, -width,0,width,height)
  }else{
    tint(100)
    image(cutOutLarge,-width,0,width,height)
    noTint()
    image(cutOutLargeGraphic, -width,0,width,height)
  }
  pop()
  //image(newGraphic, 0, 0, desiredWindowHeight, cutOutWidth);
  //filter(GRAY)
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
  fill(255)
  text("click to start", 20, height/2)
}


function mousePressed() {
  feed = !feed;
  capture.play();
}
function keyPressed() {
  if (key == "z") {
    capture.play();
    print(capture.height,capture.width)
  }
  if (key == "a") {
    capture.pause();
    print(poses);
  }
  if ( key == "s"){
    bodies.makeOneSick()
    
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
