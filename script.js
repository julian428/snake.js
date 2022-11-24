const start = document.querySelector(".start");
const field = document.querySelector("canvas");
const score = document.querySelector("p");
const ctx = field.getContext("2d");

const width = field.clientWidth / 20,
  height = field.clientHeight / 20;
let dirx = 0,
  diry = 0;
var cord = [
  {
    x: field.clientWidth / 2 - width / 2,
    y: field.clientWidth / 2 - width / 2,
  },
];

let apple = {
  is: 0,
  x: Math.round(Math.random() * (field.clientWidth - width)),
  y: Math.round(Math.random() * (field.clientHeight - height)),
};

let points = 0;

const init = () => {
  cord = [
    {
      x: field.clientWidth / 2 - width / 2,
      y: field.clientWidth / 2 - width / 2,
    },
  ];
  const interval = setInterval(draw, 200);
};

const draw = () => {
  ctx.clearRect(0, 0, field.clientWidth, field.clientHeight);
  ctx.fillStyle = "#aaa";
  cord.map((e) => ctx.fillRect(e.x, e.y, width, height));
  cord.map((e) => {
    e.x += width * dirx;
    e.y += height * diry;
  });

  //teleportation
  cord.map((e) => {
    if (e.x > field.clientWidth - width) e.x = 0;
    if (e.y > field.clientHeight - height) e.y = 0;
    if (e.x < 0) e.x = field.clientWidth - width;
    if (e.y < 0) e.y = field.clientHeight - height;
  });

  if (
    cord[0].x >= apple.x - width &&
    cord[0].x <= apple.x + width &&
    cord[0].y >= apple.y - height &&
    cord[0].y <= apple.y + height
  ) {
    apple.x = Math.round(Math.random() * (field.clientWidth - width));
    apple.y = Math.round(Math.random() * (field.clientHeight - height));
    points++;
    score.innerHTML = points;
    addElement();
    console.log(cord);
  }
  if (apple.is) {
    ctx.fillStyle = "rgb(255, 0, 0)";
    ctx.fillRect(apple.x, apple.y, width, height);
  }
  if (!apple.is) {
    ctx.fillStyle = "rgb(255, 0, 0)";
    ctx.fillRect(apple.x, apple.y, width, height);
    apple.is = 1;
  }
};

const addElement = () => {
  cord.push({
    x: cord[cord.length - 1].x + width * dirx,
    y: cord[cord.length - 1].y + height * diry,
  });
};

window.onload = () => {
  start.addEventListener("click", init);
  document.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "ArrowRight":
        if (dirx * -1) break;
        dirx = 1;
        diry = 0;
        break;
      case "ArrowLeft":
        if (dirx) break;
        dirx = -1;
        diry = 0;
        break;
      case "ArrowUp":
        if (diry) break;
        dirx = 0;
        diry = -1;
        break;
      case "ArrowDown":
        if (diry * -1) break;
        dirx = 0;
        diry = 1;
        break;
    }
  });
};
