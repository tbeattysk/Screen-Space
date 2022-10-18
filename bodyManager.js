class BodyManager{
    constructor(c){
        this.c = c
        this.bodies=[];
        this.colors =  [
            color("#FF0000C2"),
            color("#00FF00C2"),
            color("#0000FFC2"),
            color("#9C27B0C2"),
            color("#FFEB3BC2"),
          ];
        this.colorTicker =  1;
        this.sickRadius = 0
    }
    display(){
        for(var i = 0; i<this.bodies.length; i++){
            if(this.bodies[i].sick){
                for(var j = 0; j<this.bodies.length; j++){
                    if(i!=j){
                        this.bodies[j].checkSicknessSpread(this.bodies[i].pose.nose,
                             //400) 
                            this.bodies[i].sick/4) //spread range (body.sick increases 1 pixel)
                    }
                }
            }else{
                if(this.sickZoneDistance(this.bodies[i]) < this.sickRadius){
                    this.bodies[i].makeSick()
                    this.sickRadius /= 2
                }
            }
            if(this.bodies[i].queueFree){
              this.bodies.splice(i,1);
              i--;
            }else{
              this.bodies[i].display(this.c);
              this.bodies[i].choiceDone = false;
            }
          }
          if(this.bodies.length == 0){
            this.sickRadius = 0
          }{
            this.sickRadius+= 0.3
          }
    }
    managePoses(poses){
        let poseOwners = []
        for(let x in poses)poseOwners.push(null)

        let placed = 0
        let i = 0

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
            for(let i = 0; i<poseOwners.length;i++){
            if(poseOwners[i] != null){
                poseOwners[i].loadPose(poses[i])
            }else if(poses[i].score > 0.7 && this.bodies.length<4){
                if(!this.checkShaddow(i, poses)){
                    this.bodies.push(new Body(poses[i],
                                        this.colors[this.colorTicker]))
                    this.colorTicker++
                    if(this.colorTicker >= this.colors.length){
                        this.colorTicker = 0
                    }
                }
            }
        }
       
        if(this.inEntryZone()){
            if(state == 0){
                if(state1Timer > 30){
                state = 1
                yOffset = 0
                this.sickRadius /=2
                }else{
                state1Timer++
                }
            }
        }else{
          state1Timer = 0
          state = 0
          yOffset = 0
        }
    }
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
    makeOneSick(){
        this.bodies[Math.floor(Math.random(bodies.length))].makeSick()
    }
    inEntryZone(){
        let inEntryZone = false;
        for(let i = 0; i <this.bodies.length; i++){
            if(this.bodies[i].pose.nose.x < doorwayWidth && 
                this.bodies[i].pose.nose.x < doorwayHeight){
                    return true
            }
        }
        return false
    }
    sickZoneDistance(body){
        return dist(body.pose.rightAnkle.x, body.pose.rightAnkle.y, 450, 250)*2
    }
}