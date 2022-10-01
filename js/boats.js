class Boats {
    constructor(x,y,w,h,pos,boatAnimation){
        var options = {
            restitution:0.8,
            friction:1,
            density:1
        }

        this.animation = boatAnimation;
        this.speed = 0.05;
        this.body = Bodies.rectangle(x,y,w,h,options);
        World.add(world,this.body);
        this.w = w;
        this.h = h;
        this.pos = pos;
        this.image = loadImage("assets/boat.png");
        this.broken = false;
    }

    animate(){
        this.speed +=0.05;
    }


    display(){
        var index = floor(this.speed%this.animation.length);
        push();
        translate(this.body.position.x,this.body.position.y);
        imageMode(CENTER);
        image(this.animation[index],0,this.pos,this.w,this.h);
        pop();
    }

    remove(index){
        this.animation = brokenBoatAnimation;
        this.speed = 0.05;
        this.w = 300;
        this.h = 300;
        this.broken = true;
        setTimeout(()=>{
            World.remove(world,boats[index].body);
            delete boats[index];
        },3000);
    }
}