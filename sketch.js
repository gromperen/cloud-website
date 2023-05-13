class ArrayList extends Array {
    constructor() {
        super(...[]);
    }
    size() {
        return this.length;
    }
    add(x) {
        this.push(x);
    }
    get(i) {
        return this[i];
    }
    remove(i) {
        this.splice(i, 1);
    }
}

// [processing-p5-convert] import java.util.*;
let sz = 1025; // 2^n+1
let roughness = 0.6;
let particles;
let pixmap = [];

function setup() {
    //createCanvas(1025, 1025, P2D);
    createCanvas(windowWidth, windowHeight, P2D);
    background(135, 206, 235);
    colorMode(HSB, 360, 255, 100);
  loadPixels();
    //rectMode(CENTER);
    noStroke();
    particles = new ArrayList();
    //plasma();
    updatePixels();
}

function plasma() {
    for (let i = 0; i <= width; ++i) {
        pixmap[i]= [];
        for (let j = 0; j <= height; ++j) {
            pixmap[i][j] = 0.0;
        }
    }


    let c1, c2, c3, c4;
    c1 = Math.random();
    c2 = Math.random();
    c3 = Math.random();
    c4 = Math.random();
    sqr(0, 0, width, height, c1, c2, c3, c4, 1.0);
    for (let i = 0; i < width; ++i) {
        for (let j = 0; j < height; j++) {
            set(i, j, color(210, 255, 100, pixmap[i][j]));
            //set(i, j, )
        }
    }
}
function sqr(x, y, w, h, c1, c2, c3, c4, std) {
    let p1, p2, p3, p4, mid;
    if (w <= 1 && h <= 1) {
        let p = (c1 + c2 + c3 + c4) / 4;
        for (let i = x; i < x + w; ++i) {
            for (let j = y; j < y + h; ++j) {
              if (pixmap[i] == undefined) pixmap[i] = [];
                //pixmap[i][j] = p * 255;
                pixmap[i][j] = p;
                //console.log(pixmap[i][j]);
            }
        }
        return;
    }
    mid = (c1 + c2 + c3 + c4) / 4 + gaussianRandom(0, std) * roughness;
    p1 = (c1 + c2) / 2;
    p2 = (c2 + c3) / 2;
    p3 = (c3 + c4) / 2;
    p4 = (c4 + c1) / 2;
    p1 = rectify(p1);
    p2 = rectify(p2);
    p3 = rectify(p3);
    p4 = rectify(p4);
    sqr(x, y, w / 2, h / 2, c1, p1, mid, p4, std / 2);
    sqr(x + w / 2, y, w - w / 2, h / 2, p1, c2, p2, mid, std / 2);
    sqr(x + w / 2, y + h / 2, w - w / 2, h - h / 2, mid, p2, c3, p3, std / 2);
    sqr(x, y + h / 2, w / 2, h - h / 2, p4, mid, p3, c4, std / 2);
}

function rectify(x) {
    if (x < 0) x = 0.0;
    if (x > 1) x = 1.0;
    return x;
}

function draw() {
    for (let i = 0; i < particles.size(); ++i) {
        let p = particles.get(i);
        p.drawparticle();
        p.reproduce();
        particles.remove(i);
    }
}
function mousePressed() {
    particles.add(new Particle(mouseX, mouseY, 50, 10));
    console.log("OK1");
}
function keyPressed() {
    //plasma();
}
class Particle {
    x;
    y;
    opacity;
    w;
    alive;
    constructor(_x, _y, _w, o) {
        this.x = _x;
        this.y = _y;
        this.w = _w;
        this.opacity = o;
        this.alive = true;
    }
    reproduce() {
        if (this.w > 1) {
            for (let i = 0; i < 2; i++) {
                let newX = this.x + random(-this.w, this.w);
                let newY = this.y + random(-this.w / 2, this.w / 4);
                let r = random(10);
                let newW = this.w - r;
                if (newW < 1) newW = 1;
                particles.add(
                    new Particle(newX, newY, newW, this.opacity)
                );
                this.alive = false;
            }
        }
    }
    drawparticle() {
        fill(255, 0, 255, 0.1);
        ellipse(this.x, this.y, this.w, this.w);
    }
}

function gaussianRandom(mean=0, stdev=1) {
    let u = 1 - Math.random(); // Converting [0,1) to (0,1]
    let v = Math.random();
    let z = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    // Transform to the desired mean and standard deviation:
    return z * stdev + mean;
}
