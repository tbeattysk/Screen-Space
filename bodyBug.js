class BodyBug{
    constructor(keypoint, xOffset, yOffset, keypoints, angry){
        this.keypoint = keypoint
        this.xOffset = xOffset
        this.yOffset = yOffset
        this.x = keypoints[keypoint].position.x
        this.y = keypoints[keypoint].position.y
        this.r = random(5,15)
        this.angry = angry
        this.color = color(random(0,100),random(180,255),random(150,255),100)
    }
    display(keypoints, z, c){
        c.noStroke()
        //Follow the posenet pose slowly
        this.x = 0.6*this.x + 0.4* (keypoints[this.keypoint].position.x +this.xOffset)
        this.y = 0.6*this.y + 0.4* (keypoints[this.keypoint].position.y + this.yOffset)
        if(!this.angry){
            c.fill(this.color)
            c.circle(this.x,this.y, this.r)
        }else{
            c.fill(255,0,0,50)
            for (let i = 0; i < 10; i++) {
                c.circle(this.x+random(-this.r/2,this.r/2),   
                     this.y+random(-this.r/2,this.r/2), this.r);
              }
        }
        
    }
}