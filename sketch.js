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
let desiredWindowWidth = 8200  
let desiredWindowHeight = 2080 
let doorwayWidth = 200
let doorwayHeight = 400
let cutOutWidth = doorwayWidth * desiredWindowHeight/doorwayHeight
let mainScreenWidth = 6000

let sickRadius = 0
let state = 0
let state1Timer = 0
let status = ["Searching... PLEASE WAIT", "       Scanning Microbes...", " Microbes Identified: ENTER","","","",""]
let scanSound
let doneSound
let yOffset = 80

var shockSound
var benevolentSound

function setup() {
  //frameRate(50);
  createCanvas(desiredWindowWidth, desiredWindowHeight);
  shockSound = loadSound("shock.mp3")
  benevolentSound = loadSound("benevolent.mp3", playSong)
  scanSound = loadSound("scanner.mp3")
  doneSound = loadSound("done.mp3")
  sickZoneSound = loadSound("creepy2.mp3", playSick)
  capture = createCapture(VIDEO);
  poseNet = ml5.poseNet(capture, modelReady);
  poseNet.on("pose", gotPoses);
  newGraphic = createGraphics(1920,1080);
  bodies = new BodyManager(newGraphic)
}

function playSong(e){
  e.pan(-1)
  e.setVolume(0.3)
  e.loop()
}
function playSick(e){
  e.pan(1)
  e.setVolume(0)
  e.loop()
}

function draw() {
  background(0)
  newGraphic.clear()
  bodies.display(newGraphic);
  //newGraphic.fill(255,0,0,50)
  //newGraphic.circle(450, 220,sickRadius)

  push()
  scale(-1,1)
  
  // create scanning effect 
  if(state==1){
    let cutOutSmall
    cutOutSmall = capture.get(0, 0, doorwayWidth, doorwayHeight)
    cutOutSmall.loadPixels()
    scannerEffect(cutOutSmall)
    cutOutSmall.updatePixels()
    image(cutOutSmall,-3000,0,1600,desiredWindowHeight)

    if(!scanSound.isPlaying()){
      scanSound.pan(-1)
      scanSound.play()
    }
    if(yOffset > capture.height-100){
      scanSound.pan(-1)
      doneSound.play()
      state = 2
    }
  }else if(state<6){
    image(capture,-3000,0,1600,desiredWindowHeight,
        0, 0, doorwayWidth, doorwayHeight)
  }
  if(state<6){
    let cutOutLarge = capture.get(doorwayWidth,0,
      capture.width-doorwayWidth,capture.height)
    cutOutLarge.filter(GRAY)
    image(cutOutLarge,-8200,0,desiredWindowWidth/2,desiredWindowHeight)
  }
  
  image(newGraphic, -8200,0,desiredWindowWidth/2,desiredWindowHeight,doorwayWidth,0,
    capture.width-doorwayWidth,capture.height)
  
  if(state != 0){
    newGraphic.filter(GRAY)
    image(newGraphic, -3000 ,0,1600,map(yOffset,0,doorwayHeight,0,desiredWindowHeight),
      0, 0, doorwayWidth, yOffset)
  }
  pop()
  if(state<6){
    noStroke()
    fill(0,0,0,180)
    rect(0,height-400,3000,400)
    fill(100,200,100)
    textSize(240)
    text(status[state],600,height-100)
  }
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

function keyPressed() {
  if ( key == "s"){
    bodies.makeOneSick()
  }
  if ( key == "v"){
    print(state)
    print(bodies.bodies.length)
  }
}
function windowResized() {
  //resizeCanvas(windowWidth, windowHeight);
}
function drawKeypoints(pose) {
  for (let i = 0; i < pose.keypoints.length; i++) {
    let keypoint = pose.keypoints[i];
    noStroke();
    fill(255, 255, 255)
    circle(keypoint.position.x, keypoint.position.y, 10);
  }
}
function scannerEffect(img){
  let yWave = 40 //height of scanner
  let xWave = 0 // starting xOffset of scanner
  print(img.width)
  // yOffset defines where scanner starts
  let i = yOffset * img.width * 4
  // yOffset + ywave gives endpoint of scanner
  while(i < (yOffset + yWave) * img.width * 4){
    //swap pixels from left side of screen to left side (non-inverted)
    let j = i + (img.width - xWave) * 4  
    let temp = img.pixels[i]
    img.pixels[i] = img.pixels[j]
    img.pixels[j] = temp
    // add colour to scan area
    if(i%4 == 0){
      img.pixels[i] += 80;
      img.pixels[i+1] -= 80;
      img.pixels[i+2] -= 80;

      }
    if(i%(img.width*8)==0){xWave+=1} //increase xOffset for each line
    i++
  }
    yOffset+=6 //vertical speed of scanner
}
