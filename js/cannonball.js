class Cannonball{
    constructor(x,y){
        this.r = 15;
        this.body = Matter.Bodies.circle(x,y,this.r,{isStatic:true});
        World.add(world,this.body);
        this.img = loadImage("assets/cannonball.png");
        this.trajectory = [];
        this.isSink = false;
        this.animation = [this.img];
        this.speed = 0.05;
    }

    display(){
        
        var index = floor(this.speed%this.animation.length);
        var pos = this.body.position;
        push();
        imageMode(CENTER);
        image(this.animation[index],pos.x,pos.y,this.r*2,this.r*2);
        pop();

        if(this.body.velocity.x > 0 && pos.x > 10&&!this.isSink){
            var position = [pos.x,pos.y];
            this.trajectory.push(position);
        }

        for(var i = 0;i<this.trajectory.length;i++){
            image(this.img,this.trajectory[i][0],this.trajectory[i][1],5,5);
        }
    }

    shoot(){
        var newAngle = cannon.angle-28;
        newAngle = newAngle*(3.14/180);
        var velocity = p5.Vector.fromAngle(newAngle);
        velocity.mult(0.5);
        Matter.Body.setStatic(this.body,false);
        Matter.Body.setVelocity(this.body,{x:velocity.x*(180/3.14),y:velocity.y*(180/3.14)});
    }

    remove(i){
        this.isSink = true;
        Matter.Body.setVelocity(this.body,{x:0,y:0});
        this.animation = waterAnimation;
        this.speed = 0.05;
        this.r = 80;
        setTimeout(()=>{
            World.remove(world,this.body);
            delete balls[i];
        },1000);
       
    }

    animate(){
        this.speed += 0.05;
    }
}