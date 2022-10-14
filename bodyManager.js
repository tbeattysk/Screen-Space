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
    }
    display(){
        for(var i = 0; i<this.bodies.length; i++){
            if(this.bodies[i].queueFree){
              this.bodies.splice(i,1)
              i--
            }else{
              this.bodies[i].display(this.c);
              this.bodies[i].choiceDone = false;
            }
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

}