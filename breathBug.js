class BreathBug {
    constructor(x, y, vx, sick) {
      this.x = x;
      this.y = y;
      this.sick = sick
      this.life = random(0, 100);
      this.vx = random(-8, 8);
      this.vy = random(15, 0);
      this.moving = true;
      if(this.sick){
        this.color = color(random(200,255), random(0,0), random(0,100), 50)
      }else{
        if(random(0,100)<10){
            this.color = color(random(100, 255), random(50, 100), random(50, 100), 150);
        }else{
            this.color = color(random(0, 100), random(150, 255), random(150, 255), 150);
        }
      }
      this.color2 = color(0, 0, 0);
      this.color3 = color(100, 100, 100);
      this.alpha = 255;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= 5;
    }
    finished() {
      return this.life < 0;
    }
  
    display(c) {
      c.noStroke();
      c.fill(this.color);
      if(this.sick){
        for (let i = 0; i < 10; i++) {
            let r = this.life/8
            c.circle(this.x+random(-r/2,r/2),   
                 this.y+random(-r/2,r/2), r);
          }
      }else{
        c.circle(this.x, this.y, this.life/8);
        this.life = this.life - 1;
      }
    }
  }
  