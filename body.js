class Body{
    constructor(pose, color) {
      this.loadPose(pose)
      this.color = color
      this.threshold = 1500
      this.noBestPose = false
      this.queueFree = false
      this.lostFrames = 0
      this.z = height - pose.leftAnkle.y
      this.bugs = []
      
      this.bugs.push(new BodyBug(0,random(0,30),random(-50,50),this.pose.keypoints))
      this.bugs.push(new BodyBug(0,random(-30,0),random(-50,50),this.pose.keypoints))
      this.bugs.push(new BodyBug(5,random(0,40),random(0,40),this.pose.keypoints))
      this.bugs.push(new BodyBug(6,random(-80,0),random(0,80),this.pose.keypoints))
      this.bugs.push(new BodyBug(11,random(0,80),random(-80,80),this.pose.keypoints))
      this.bugs.push(new BodyBug(12,random(-80,0),random(-80,80),this.pose.keypoints))
      this.bugs.push(new BodyBug(13,random(0,10),random(-80,80),this.pose.keypoints))
      this.bugs.push(new BodyBug(14,random(-10,0),random(-80,80),this.pose.keypoints))
    }

    display(){  
      if(this.pose){
        rectMode(CORNERS)
        let k = this.pose.keypoints
        fill(this.color)
        // rect(
        //   k[8].position.x, k[2].position.y,
        //   k[7].position.x,k[15].position.y
        // )
        //this.drawKeypoints();
        this.z = 1500 - this.pose.leftAnkle.y
        for(var i = 0; i<this.bugs.length; i++){
          this.bugs[i].display(k, this.z)
        }
        
        let depthtext = this.z.toFixed(1) + " height"
         textSize(30)
         fill(255,255,255)
        text(depthtext,this.pose.leftAnkle.x,this.pose.leftAnkle.y)

        if(this.noBestPose){
            this.lostFrames++
        }else{
          this.lostFrames = 0
        }
        if(this.lostFrames > 50){
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
         circle(keypoint.position.x, keypoint.position.y, 20);
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
   }