let gos = [];
let spawned = 0;
let spawnInterval;
let range = 20;
let count = 0;

let then;
let deltaTime;

let mouse;

function spawn() {
    gos.push(new Circle(createVector(width / 2, height + 50)));
    gos[gos.length - 1].addForce(createVector(random(-range, range), random(-range, range)));
    spawned++;
    then = new Date().getTime();
}

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    background(45, 56, 200);
    if ( count > 0 ) spawnInterval = setInterval(spawn, 250);
    mouse = createVector(0,0);
}

function draw() {
    if ( mouseIsPressed ){
        gos.push(new Circle(createVector(mouseX, mouseY)));
        gos[gos.length - 1].addForce(createVector(random(-range, range), random(-range, range)));
        background(45, 56, 200,1);
    }
    // calculate delta time (dt)
    const now = new Date().getTime();
    deltaTime = (now - then) * 0.001;
    then = now;
    mouse.x = mouseX;
    mouse.y = mouseY;
    gos.forEach(go => {
        go.tick();
    })
}

class GameObject {

    constructor(position) {
        this.color = color(random(0, 255), random(0, 255), random(0, 255));
        this.position = position;
        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);
        this.age = 0;
    }
    getAge(){
        return this.age;
    }
    setPosition(pos) {
        this.position = pos;
    }
    addForce(force) {
        this.vel.add(force);
    }
    tick() {
        this.toMouse();
        this.age += deltaTime;
        this.acc.add(this.vel);
        this.vel.mult(0);
        this.position.add(this.acc);
        this.acc.mult(0.95);
    }
    toMouse(){
        let dir = mouse.copy().sub(this.position);
        let dist = dir.mag();
        this.addForce(dir.div(sqrt(dist)).mult(0.005).add(createVector(noise(frameCount),noise(frameCount)).mult(0.1)));
    }
}

class Circle extends GameObject {
    constructor(position, color) {
        super(position, color);
        this.radius = random(10, 150);
    }
    tick() {
        if ( this.radius < 5 ) return;
        this.radius *= 0.99;
        super.tick();
        this.draw();
    }
    draw() {
        fill(this.color)
        //stroke( 255 - this.radius * 20 )
        ellipse(this.position.x, this.position.y, this.radius)
    }
}