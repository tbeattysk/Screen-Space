class BodyBug{
    constructor(keypoint, xOffset, yOffset, keypoints){
        this.keypoint = keypoint
        this.xOffset = xOffset
        this.yOffset = yOffset
        this.x = keypoints[keypoint].position.x
        this.y = keypoints[keypoint].position.y
        this.color = color(random(0,100),random(180,255),random(150,255),180)
    }
    display(keypoints,z){
        noStroke()
        fill(this.color)
        this.x = 0.9*this.x + 0.1* (keypoints[this.keypoint].position.x +this.xOffset)
        this.y = 0.9*this.y + 0.1* (keypoints[this.keypoint].position.y + this.yOffset)
        circle(this.x,this.y, 5+2000/z)
        
    }
}