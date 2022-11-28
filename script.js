class Spirit {
  constructor(field, width, height, color, ...startingCords) {
    this.field = field;
    this.width = width;
    this.height = height;
    this.color = color;
    this.cords = [...startingCords];
  }

  draw() {
    const context = this.field.getContext("2d");
    context.fillStyle = this.color;
    context.fillRect(this.cords[0], this.cords[1], this.width, this.height);
  }
}

class Snake extends Spirit {
  constructor(field, width, height, color, ...startingCords) {
    super(field, width, height, color, ...startingCords);
    this.tail = [
      {
        x: this.cords[0],
        y: this.cords[1],
      },
    ];
  }

  get head() {
    return this.tail[0];
  }

  get tailLength() {
    return this.tail.length;
  }

  draw() {
    const context = this.field.getContext("2d");
    context.fillStyle = this.color;
    this.tail.map((e) => {
      context.fillRect(e.x, e.y, this.width, this.height);
    });
  }

  grow() {
    this.tail.push({
      x: this.tail[this.tail.length - 1].x,
      y: this.tail[this.tail.length - 1].y,
    });
  }

  move(dirx = 0, diry = 0) {
    if (this.tail.length - 1) {
      for (let i = this.tail.length - 1; i > 0; i--) {
        this.tail[i].x = this.tail[i - 1].x;
        this.tail[i].y = this.tail[i - 1].y;
      }
    }
    this.tail[0].x += this.width * dirx;
    this.tail[0].y += this.height * diry;

    if (this.tail[0].x >= this.field.clientWidth) this.tail[0].x = 0;
    if (this.tail[0].x < 0) this.tail[0].x = this.field.clientWidth;
    if (this.tail[0].y >= this.field.clientHeight) this.tail[0].y = 0;
    if (this.tail[0].y < 0) this.tail[0].y = this.field.clientHeight;
  }

  checkCollision() {
    if (this.tail.length > 3) {
      for (let i = this.tail.length - 1; i > 3; i--) {
        if (
          this.tail[i].x == this.tail[0].x &&
          this.tail[i].y == this.tail[0].y
        ) {
          this.die();
        }
      }
    }
  }

  die() {
    clearInterval(loop);
    alert("Game Over");
    appendScore(points, "user");
    points = 0;
    score.innerHTML = points;
    this.tail = [
      {
        x: this.cords[0],
        y: this.cords[1],
      },
    ];
  }
}

class Apple extends Spirit {
  constructor(field, score, width, height, color, ...startingCords) {
    super(field, width, height, color, ...startingCords);
    this.score = score;
  }

  move() {
    this.cords[0] = Math.floor(Math.random() * 20) * 20;
    this.cords[1] = Math.floor(Math.random() * 20) * 20;
  }
  addPoint() {
    points++;
    eatenApples++;
    this.score.innerHTML = points;
  }
  checkCollision(headCords) {
    const { x, y } = headCords;
    if (x == this.cords[0] && y == this.cords[1]) {
      this.addPoint();
      this.move();
      snake.grow();
    }
  }
}

class GoldApple extends Apple {
  constructor(field, score, width, height, color, ...startingCords) {
    super(field, score, width, height, color, ...startingCords);
  }
  addPoint() {
    points += 5;
    eatenApples++;
    this.score.innerHTML = points;
  }
}

const changeDirection = (event) => {
  const mov = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
  if (
    mov.some((e) => e == event.key) &&
    snake.tailLength > field.clientWidth / 20
  ) {
    points++;
    score.innerHTML = points;
  }
  switch (event.key) {
    case "ArrowUp":
      if (diry == 1) break;
      dirx = 0;
      diry = -1;
      break;
    case "ArrowDown":
      if (diry == -1) break;
      dirx = 0;
      diry = 1;
      break;
    case "ArrowRight":
      if (dirx == -1) break;
      dirx = 1;
      diry = 0;
      break;
    case "ArrowLeft":
      if (dirx == 1) break;
      dirx = -1;
      diry = 0;
      break;
  }
};

const changeDifficulty = () => {
  speed = parseInt(difficulty.value);
  clearInterval(interval);
  if (speed == 2) {
    interval = setInterval(loop, 200);
  } else if (speed == 1) {
    interval = setInterval(loop, 100);
  } else {
    interval = setInterval(loop, 50);
  }
};

const loop = () => {
  context.clearRect(0, 0, field.clientWidth, field.clientHeight);
  snake.move(dirx, diry);
  snake.draw();
  if (eatenApples % 5 == 0 && points) {
    notEaten++;
    goldApple.draw();
    goldApple.checkCollision(snake.head);
  } else {
    notEaten = 0;
    apple.draw();
    apple.checkCollision(snake.head);
  }
  if (notEaten > 20) eatenApples++;
  snake.checkCollision();
};

const getTable = () => {
  const array = [];
  for (let i = 1; i < 6; i++) {
    if (localStorage.getItem("scoretable" + i) == null) continue;
    array.push(parseInt(localStorage.getItem("scoretable" + i)));
  }
  return array;
};

const setTable = () => {
  for (let i = 0; i < scoreTable.length; i++) {
    localStorage.setItem("scoretable" + (i + 1), scoreTable[i]);
  }
};

const appendScore = (score, user) => {
  scoreTable.sort((a, b) => b - a);
  if (scoreTable.length > 4) {
    for (let i = 0; i < scoreTable.length; i++) {
      if (score > scoreTable[i]) {
        scoreTable[i] = score;
        break;
      }
    }
  } else {
    scoreTable.push(score);
  }
  setTable();
  console.log(scoreTable);
  console.log(scoreTable.length);
};

const field = document.querySelector("canvas");
const score = document.querySelector("p");
const context = field.getContext("2d");
const difficulty = document.querySelector("#difficulty");

let interval;
let speed = 1;
let points = 0;
let eatenApples = 0,
  notEaten = 0;
let dirx = 0,
  diry = 0;

let scoreTable = getTable();

document.addEventListener("keyup", changeDirection);
difficulty.addEventListener("change", changeDifficulty);

const snake = new Snake(field, 20, 20, "green", 200, 200);
const apple = new Apple(field, score, 20, 20, "red", 400, 400);
const goldApple = new GoldApple(
  field,
  score,
  20,
  20,
  "yellow",
  Math.floor(Math.random() * 20) * 20,
  Math.floor(Math.random() * 20) * 20
);

changeDifficulty();
console.log(scoreTable);
