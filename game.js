var cvs = document.getElementById('mycanvas');
var ctx = cvs.getContext('2d');

var DEGREE = Math.PI / 180
var frames = 0;

var sprite = new Image();
sprite.src = 'imgs/sprite.png';


var SCORE = new Audio();
SCORE.src = 'audio/point.mp3'

var Flap = new Audio();
Flap.src = 'audio/flap.mp3'

var HIT = new Audio();
HIT.src = 'audio/flappy-bird-hit-sound.mp3'

var DIE = new Audio();
DIE.src = 'audio/die.mp3'

var START = new Audio();
START.src = 'audio/swoosh.mp3'

var state = {
  current: 0,
  getReady: 0,
  game: 1,
  over: 2
}

function clickHandler() {
  switch (state.current) {
    case state.getReady:
      START.play();
      state.current = state.game
      break;
    case state.game:
      Flap.play()
      bird.flap()
      break;
    default:
      bird.speed = 0
      bird.rotation = 0
      pipes.position = []
      score.value = 0
      state.current = state.getReady;
      break;
  }
}

document.addEventListener('click', clickHandler)
document.addEventListener("keydown", function (e) {
  if (e.which == 32) {
    clickHandler();
  }
})

var bg = {
  sX: 0,
  sY: 0,
  w: 268,
  h: 480,
  x: 0,
  y: cvs.height - 480,
  draw: function () {
    ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h)
    ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h)
  }
}
var fg = {
  sX: 290,
  sY: 0,
  w: 270,
  h: 110,
  x: 0,
  dx: 2,
  y: cvs.height - 100,
  draw: function () {
    ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h)
    ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + (this.w - 7), this.y, this.w, this.h)
  },
  update: function () {
    if (state.current == state.game) {
      this.x = (this.x - this.dx) % (this.w / 2)
    }
  }
}

var pipes = {
  top: {
    sX: 565,
    sY: -75
  },
  bottom: {
    sX: 617,
    sY: -10
  },
  w: 50,
  h: 330,
  dx: 2,
  gap: 90,
  position: [],
  maxYPos: -120,
  draw: function () {
    for (let i = 0; i < this.position.length; i++) {

      let p = this.position[i]

      let topYPos = p.y;
      let bottomYPos = p.y + this.h + this.gap;

      ctx.drawImage(sprite, this.top.sX, this.top.sY, this.w, this.h, p.x, topYPos, this.w, this.h)
      ctx.drawImage(sprite, this.bottom.sX, this.bottom.sY, this.w, this.h, p.x, bottomYPos, this.w, this.h)
    }
  },
  update: function () {
    if (state.current != state.game) return;
    if (frames % 100 == 0) {
      this.position.push({
        x: cvs.width,
        y: this.maxYPos * (Math.random() + 1)
      })
    }

    for (let i = 0; i < this.position.length; i++) {
      let p = this.position[i]
      p.x -= this.dx

      let bottomPiepesPos = p.y + this.h + this.gap;

      if (bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && bird.y + bird.radius > p.y
        && bird.y - bird.radius < p.y + this.h) {
        HIT.play();
        state.current = state.over;
      }

      if (bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && bird.y + bird.radius > bottomPiepesPos
        && bird.y - bird.radius < bottomPiepesPos + this.h) {
        HIT.play();
        state.current = state.over;
      }


      if (p.x + this.w <= 0) {
        this.position.shift()
        score.value += 1;
        SCORE.play();
        score.best = Math.max(score.value, score.best)
        localStorage.setItem('best', score.best)
      }
    }

  }
}

var Ready = [
  {
    sX: 320,
    sY: 220,
    w: 80,
    h: 100,
    x: cvs.width / 2 - 26,
    y: 160,
    draw: function () {
      if (state.current == state.getReady) {
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h)
      }
    }
  },
  {
    sX: 270,
    sY: 410,
    w: 170,
    h: 45,
    x: cvs.width / 2 - 80,
    y: 60,
    draw: function () {
      if (state.current == state.getReady) {
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h)
      }
    }
  }
]

var Menu = [
  {
    sX: 270,
    sY: 105,
    w: 215,
    h: 110,
    x: cvs.width / 2 - 100,
    y: 110,
    draw: function () {
      if (state.current == state.over) {
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h)
      }
    }
  },
  {
    sX: 270,
    sY: 367,
    w: 180,
    h: 45,
    x: cvs.width / 2 - 80,
    y: 60,
    draw: function () {
      if (state.current == state.over) {
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h)
      }
    }
  },
  {
    sX: 450,
    sY: 397,
    w: 80,
    h: 29,
    x: cvs.width / 2 - 40,
    y: 235,
    draw: function () {
      if (state.current == state.over) {
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h)
      }
    }
  }
]

//used for tunning
// var tune={
//   sX:411,
//   sY:224,
//   w:40,
//   h:40,
//   x:20,
//   y:cvs.height-400,  
//   draw:function(){
//     ctx.drawImage(sprite,this.sX,this.sY,this.w,this.h,this.x,this.y,this.w,this.h)
//   }
// }

//cordination for animation
// 488
// 112
// 488
// 161
// 411
// 224



var bird = {
  animation: [
    { sX: 488, sY: 112 },
    { sX: 488, sY: 161 },
    { sX: 411, sY: 224 },
    { sX: 488, sY: 161 }
  ],
  w: 38,
  h: 38,
  x: 35,
  speed: 0,
  gravity: 0.25,
  y: cvs.height - 370,
  animationIndex: 0,
  rotation: 0,
  jump: 4.6,
  radius: 12,
  draw: function () {
    let bird = this.animation[this.animationIndex]
    ctx.save()//ba emal rotation hame maghadir be ham mirize dar natije az 2 methode save va restore estefade mknim ke harchi
    //taghirat beyn 2 method hast aval save sepas dobare emal mishvd ta maghadir dige taghir nakonad va faghat taghirat beyn 2 methd emal shvd
    ctx.translate(this.x, this.y) //ba in noghte shoro aks ro dastkari kardim pas to draImage niaz be in 2 ndrim
    ctx.rotate(this.rotation);
    ctx.drawImage(sprite, bird.sX, bird.sY, this.w, this.h, -this.w / 2, -this.h / 2, this.w, this.h)
    ctx.restore()
  },
  update: function () {
    let period = state.current == state.getReady ? 10 : 5;
    this.animationIndex += frames % period == 0 ? 1 : 0;
    this.animationIndex = this.animationIndex % this.animation.length
    if (state.current == state.getReady) {
      this.y = 150;
    } else {
      this.speed += this.gravity;
      this.y += this.speed;
      if (this.speed < this.jump) {
        this.rotation = -25 * DEGREE
      } else {
        this.rotation = 90 * DEGREE
      }
    }
    while (this.y >= 370 ) {
      DIE.play()
      state.current = state.over
      this.y = 370
      this.animationIndex = 1
      break
    }


  },
  flap: function () {
    this.speed = -this.jump;
  }
}


var score = {
  best: parseInt(localStorage.getItem('best')) || 0,
  value: 0,
  draw: function () {
    ctx.fillStyle = "#fff"
    ctx.strokeStyle = "000"

    if (state.current == state.game) {
      ctx.lineWidth = 2;
      ctx.font = "35px IMPACT";

      ctx.fillText(this.value, cvs.width / 2, 50)
      ctx.strokeText(this.value, cvs.width / 2, 50)

    } else if (state.current == state.over) {
      ctx.lineWidth = 2;
      ctx.font = "25px IMPACT";

      ctx.fillText(this.value, 230, 164)
      ctx.strokeText(this.value, 230, 164)

      ctx.fillText(this.best, 230, 204)
      ctx.strokeText(this.best, 230, 204)
    }
  }
}


function update() {
  bird.update()
  fg.update()
  pipes.update()
}

function draw() {
  ctx.fillStyle = '#70c5ce'
  ctx.fillRect(0, 0, cvs.width, cvs.height)
  bg.draw()
  pipes.draw()
  fg.draw()
  bird.draw()
  Ready[0].draw()
  Ready[1].draw()
  Menu[0].draw()
  Menu[1].draw()
  Menu[2].draw()
  score.draw()
}

function animate() {
  update()
  draw()
  frames++;
  requestAnimationFrame(animate)
}

animate();