class Snake {
  constructor(field, width = 20, height = 20) {
    this.field = field;
    this.width = width;
    this.height = height;
    this.cords = [
      {
        x: 40,
        y: 0,
      },
      {
        x: 20,
        y: 0,
      },
      {
        x: 0,
        y: 0,
      },
    ];
  }

  get headx() {
    return this.cords[0].x;
  }
  get heady() {
    return this.cords[0].y;
  }

  move(dirx, diry) {
    this.dirx = dirx;
    this.diry = diry;
    if (this.cords.length - 1) {
      for (let i = this.cords.length - 1; i > 0; i--) {
        this.cords[i].x = this.cords[i - 1].x;
        this.cords[i].y = this.cords[i - 1].y;
      }
    }
    this.cords[0].x += this.width * dirx;
    this.cords[0].y += this.height * diry;

    //! Zoptymalizuj to!!!!!!!!!
    if (this.cords[0].x >= this.field.clientWidth) this.cords[0].x = 0;
    if (this.cords[0].x < 0) this.cords[0].x = this.field.clientWidth;
    if (this.cords[0].y >= this.field.clientHeight) this.cords[0].y = 0;
    if (this.cords[0].y < 0) this.cords[0].y = this.field.clientHeight;
    //!!!!!!!!!!

    if (this.cords.length > 3) {
      for (let i = 4; i < this.cords.length; i++) {
        if (
          this.cords[i].x == this.cords[0].x &&
          this.cords[i].y == this.cords[0].y
        ) {
          this.draw();
          this.die();
        }
      }
    }
  }
  draw() {
    const context = this.field.getContext("2d");
    context.clearRect(0, 0, this.field.clientWidth, this.field.clientHeight);
    context.fillStyle = "green";
    this.cords.map((e) => context.fillRect(e.x, e.y, this.width, this.height));
  }

  addElement() {
    this.cords.push({
      x: this.cords[this.cords.length - 1].x + this.width * this.dirx,
      y: this.cords[this.cords.length - 1].y + this.height * this.diry,
    });
  }

  die() {
    this.draw();
    window.alert("Game Over");
    this.cords = [
      {
        x: 40,
        y: 0,
      },
      {
        x: 20,
        y: 0,
      },
      {
        x: 0,
        y: 0,
      },
    ];
    this.move(1, 0);
  }
}

class Apple {
  constructor(field, score) {
    this.field = field;
    this.score = score;
    this.cords = {
      x: Math.floor(Math.random() * 21) * 20,
      y: Math.floor(Math.random() * 21) * 20,
    };
  }
  draw() {
    const context = this.field.getContext("2d");
    context.fillStyle = "red";
    context.fillRect(this.cords.x, this.cords.y, 20, 20);
  }
  addPoint() {
    const x = snake.headx;
    const y = snake.heady;
    if (this.cords.x == x && this.cords.y == y) {
      this.cords.x = Math.floor(Math.random() * 21) * 20;
      this.cords.y = Math.floor(Math.random() * 21) * 20;
      points++;
      score.innerHTML = points;
      snake.addElement();
    }
  }
}

const field = document.querySelector("canvas");
const start = document.querySelector(".start");
const score = document.querySelector("p");

const snake = new Snake(field);
const apple = new Apple(field, score);

let dirx = 1,
  diry = 0;
let points = 0;

document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowUp":
      if (diry == 1) break;
      diry = -1;
      dirx = 0;
      break;
    case "ArrowDown":
      if (diry == -1) break;
      diry = 1;
      dirx = 0;
      break;
    case "ArrowRight":
      if (dirx == -1) break;
      diry = 0;
      dirx = 1;
      break;
    case "ArrowLeft":
      if (dirx == 1) break;
      diry = 0;
      dirx = -1;
  }
});

const interval = setInterval(() => {
  snake.draw();
  apple.draw();
  apple.addPoint();
  snake.move(dirx, diry);
}, 100);
