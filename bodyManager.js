class BodyManager{
    constructor(c){
        this.c = c
        this.bodies=[];
        //colors for debugging body tracking
        this.colors =  [
            color("#FF0000C2"),
            color("#00FF00C2"),
            color("#0000FFC2"),
            color("#9C27B0C2"),
            color("#FFEB3BC2"),
          ];
        this.colorTicker =  1;
        
    }
    display(){

        for(var i = this.bodies.length-1; i>=0; i--){
            // Body to body sickness spreading
            if(this.bodies[i].sick){
                for(var j = 0; j<this.bodies.length; j++){
                    if(i!=j){
                        this.bodies[j].checkSicknessSpread(this.bodies[i].pose.nose,
                             //400) // for a static sickness radius around sick bodies
                            this.bodies[i].sick/4) //spread range (body.sick increases 1 pixel)
                    }
                }
            // Sickness zone to body spreading
            }else if(this.bodies[i].sickZoneDistance() < sickRadius){
                this.bodies[i].makeSick()
                sickRadius /= 2  //Encourage body-to-body spreading by shrinking the zone
            }
            // remove bodies if they have lost the pose for certain number of frames
            if(this.bodies[i].queueFree){
              this.bodies.splice(i,1);
              i--;
            }else{
              this.bodies[i].display(this.c); // draw the body on the graphic provided
              this.bodies[i].choiceDone = false; //reset pose-body completion
            }
          }
          //reset sickzone
          if(this.bodies.length == 0){
            sickRadius = 0
            sickZoneSound.setVolume(0)
          // otherwise expand sickzone
          }else if(state < 5){
            let soundVol = sickRadius-50
            sickZoneSound.setVolume(constrain(map(soundVol,0,400,0,0.5),0,.50))
            sickRadius+= 0.3 * this.bodies.length
          }
    }
    managePoses(poses){
        //assign poses to bodies
        let poseOwners = []
        for(let x in poses)poseOwners.push(null)
        let placed = 0
        let i = 0
        //loop through each body until they each have their best matching pose
        // or the body hasn't found an acceptable pose 
        while(placed < this.bodies.length){
            if(!this.bodies[i].choiceDone){
                let choice = this.bodies[i].chooseBestPose(poses, poseOwners)
                if(choice > -1){
                if(poseOwners[choice] != null){
                    poseOwners[choice].choiceDone = false
                    poseOwners[choice] = this.bodies[i]
                }else{
                    poseOwners[choice] = this.bodies[i]
                    placed++
                }
                }else{placed++}
                this.bodies[i].choiceDone = true
            }
            i++
            if(i==this.bodies.length)i=0
        }
        // if there are any unassigned poses with high confidence score,
        // create new body at that pose
        for(let i = 0; i<poseOwners.length;i++){
            if(poseOwners[i] != null){
                poseOwners[i].loadPose(poses[i])
            }else if(poses[i].score > 0.7 && this.bodies.length<4){
                if(!this.checkShaddow(i, poses)){
                    let soundName = "creepy"+floor(random(1,4))+".mp3"
                    this.bodies.push(new Body(poses[i],
                                        this.colors[this.colorTicker],soundName))
                    this.colorTicker++
                    if(this.colorTicker >= this.colors.length){
                        this.colorTicker = 0
                    }
                }
            }
        }
        if(this.bodies.length > 0 ){
            // Manage entry scanner states
            if(state < 5){
                if(this.isBodyInEntryZone()){
                    if(state == 0){
                        if(state1Timer > 15){ //delay a bit in case someone is walking by
                            state = 1
                            yOffset = 0
                            sickRadius /= 2 //reduce chance of sickness to give time for observation
                        }else{
                            state1Timer++
                        }
                    }
                // reset scanner state
                }else {
                    state1Timer = 0
                    state = 0
                    yOffset = 0
                }
            }

            // if everyone has been sick for a while, 
            // increase noise level for 5 seconds
            // duriation of state 5 depens on pan position
            if(this.completeSickness()){
                if(state<5){
                    print("state 5")
                    state = 5;
                    sickZoneSound.setVolume(1,5,0)
                    benevolentSound.setVolume(0,5,0)
                }
            }
            if(state == 5){
                // while noise is increasing also move noise to both speakers
                // once noice is at center pan enter state 6 and shut everything off
                if(sickZoneSound.getPan() != 0){
                    sickZoneSound.pan(constrain(sickZoneSound.getPan()-0.02,0,1))
                }else{
                    print("State 6")
                    state = 6
                    sickZoneSound.setVolume(0,1,0)
                    sickZoneSound.pan(1,1)
                    benevolentSound.setVolume(0.3, 15, 1)
                    for(let i = 0; i <this.bodies.length; i++){
                        this.bodies[i].sound.stop()
                    }
                }
            }
        }
        if(state==6){
            for(let i = 0; i <this.bodies.length; i++){
                this.bodies[i].sound.stop()
            }
        }
        //once everyone has left the room, reset to state 0
        if(state == 6 && this.bodies.length == 0){
            state = 0
            sickZoneSound.pan(1)
        }   
    }

    // compares an unclaimed pose to all other poses to see
    // if it is just a shaddow of another pose which happens in Posenet
    checkShaddow(poseIndex,poses){
        for(let i = 0; i<poses.length; i++){
            if(poseIndex != i){
                if(comparePoses(poses[i],poses[poseIndex],500) != -1){
                    return true
                }
            }
        }
        return false
    }

    // used for testing sickness spread
    makeOneSick(){
        this.bodies[Math.floor(Math.random(bodies.length))].makeSick()
    }

    //check if a body is in the entryway frame
    isBodyInEntryZone(){
        let inEntryZone = false;
        for(let i = 0; i <this.bodies.length; i++){
            if(this.bodies[i].pose.nose.x < doorwayWidth && 
                this.bodies[i].pose.nose.x < doorwayHeight){
                    return true
            }
        }
        return false
    }

    //checks if everyone has been sick for a short time
    completeSickness(){
        for(var i = 0; i<this.bodies.length; i++){
            //print(this.bodies[i].sick)
            if(this.bodies[i].sick < 100) return false
        }
        return true
    }
}