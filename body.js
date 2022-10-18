class Body{
    constructor(pose, color) {
      this.loadPose(pose)
      this.sick = false
      this.color = color
      this.threshold = 1500
      this.noBestPose = false
      this.queueFree = false
      this.lostFrames = 0
      this.z = height - pose.leftAnkle.y
      this.bugs = []
      this.breath = []
      this.breathTiming = round(random(0,1000))

      this.bugs.push(new BodyBug(0,random(-10,10),random(0,40),this.pose.keypoints, false))
      
      //this.bugs.push(new BodyBug(5,random(0,40),random(0,40),this.pose.keypoints))
      this.bugs.push(new BodyBug(6,random(40,0),random(0,80),this.pose.keypoints, false))
      //this.bugs.push(new BodyBug(11,random(0,80),random(-80,80),this.pose.keypoints))
      this.bugs.push(new BodyBug(12,random(40,0),random(-80,80),this.pose.keypoints, false))
      //this.bugs.push(new BodyBug(13,random(0,10),random(-80,80),this.pose.keypoints))
      //this.bugs.push(new BodyBug(14,random(-10,0),random(-80,80),this.pose.keypoints))
    }

    makeSick(){
      if(!this.sick){
        this.bugs.push(new BodyBug(0,random(-10,10),random(0,50),this.pose.keypoints, true))
        this.bugs.push(new BodyBug(6,random(20,40),random(0,80),this.pose.keypoints, true))
        this.bugs.push(new BodyBug(12,random(20,40),random(-20,20),this.pose.keypoints, true))
        this.sick = 50
      }
    }

    display(c){  
      if(this.pose){
        if(this.sick && this.sick < 800)this.sick += 3
        let k = this.pose.keypoints
        //------ BOX FOR DEBUGGING-----
        // c.rectMode(CORNERS)
        // c.fill(this.color)
        // rect(
        //   k[8].position.x, k[2].position.y,
        //   k[7].position.x,k[15].position.y
        // )
        //this.drawKeypoints();
        
        //------- BODY BUGS --------
        for(var i = 0; i<this.bugs.length; i++){
          this.bugs[i].display(k, this.z, c)
        }
        
        //--------- BREATH BUGS --------
        if (this.breathTiming % 60 > 20) {
            if(this.breathTiming %3 ==0){
              this.breath.push(new BreathBug(k[0].position.x, k[0].position.y+20, 1, this.sick));
            }
            if(this.breathTiming % 60 > 40){
              this.breath.push(new BreathBug(k[0].position.x, k[0].position.y+20, 1, false));
            }
          }
        this.breathTiming++;

        for (let i = 0; i < this.breath.length; i++) {
          this.breath[i].display(c);
          this.breath[i].update();
        }
        for (let i = 0; i < this.breath.length; i++) {
          if (this.breath[i].finished()) {
            this.breath.splice(i, 1);
          }
        }

        //------- POSITION TRACKING -------
        //this.z = 1500 - this.pose.leftAnkle.y
        // let depthtext = this.z.toFixed(1) + " height"
        //  textSize(30)
        //  fill(255,255,255)
        // text(depthtext,this.pose.leftAnkle.x,this.pose.leftAnkle.y)

        if(this.noBestPose){
            this.lostFrames++
        }else{
          this.lostFrames = 0
        }
        if(this.lostFrames > 5){
            this.queueFree = true
        }
      }
    }
     loadPose(pose){
        if(this.pose !== pose){
          this.pose = structuredClone(pose)
        }
     }
    
     drawKeypoints()  {
       for (let i = 0; i < this.pose.keypoints.length; i++) {
         let keypoint = this.pose.keypoints[i];
         noStroke();
         `circle`(keypoint.position.x, keypoint.position.y, 20);
       }
     }
     chooseBestPose(poses, poseOwners){
       let bestTotal = 999999
       let bestPose = -1
       for (var i = 0; i < poses.length; i++) {
        if(poses[i].score >0.05){
         let total = comparePoses(this.pose,poses[i],this.threshold);
         if(total == 0){
            this.noBestPose = false
            this.poseDist = 0
            return i
         }
         if(total != -1 && total < bestTotal &&
            (poseOwners[i] == null || 
             poseOwners[i].poseDist > total)){
               bestTotal = total
               bestPose = i
               this.noBestPose = false
            }
        }
       }
       if(bestPose == -1){
        this.noBestPose = true;
       }
       this.poseDist = bestTotal
       return bestPose
     }
     checkSicknessSpread(sickNose,range){
      if(dist(sickNose.x, sickNose.y, this.pose.nose.x, this.pose.nose.y)<range){
        this.makeSick()
      }
     }
   }