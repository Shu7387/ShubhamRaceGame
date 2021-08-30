// #1. These variables represents elements of HTML. Change in Var. will reflect in Ele.
const score = document.querySelector(".score");
const startScreen = document.querySelector(".startScreen");
const gameArea = document.querySelector(".gameArea");

// Audio for Game
let audio = new Audio(
  "http://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/theme_01.mp3"
);

let endSound = new Audio(
  "http://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/explosion%2001.wav"
);

// As long as Player is interested in playing keep game on. Basically for loop ending.
let player = { wantToPlay: null, position: 5, score: 0 };

// #2. We only want Arrow keys.
let keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowRight: false,
  ArrowLeft: false,
};

//  At a time only 1 Arrow key will work
document.addEventListener("keydown", keyDown);
function keyDown(e) {
  e.preventDefault();
  keys[e.key] = true;
}

document.addEventListener("keyup", keyUp);
function keyUp(e) {
  e.preventDefault();
  keys[e.key] = false;
}

// #3. Start Screen
startScreen.addEventListener("click", start);

function start() {
  endSound.pause();
  audio.play();

  // classList Property for adding or removing class of element.
  startScreen.classList.add("hide");
  gameArea.innerHTML = "";
  player.wantToPlay = true;

  // For creating elements in document. Or We can directly write this in HTML.
  let car = document.createElement("div");
  car.setAttribute("class", "car");
  gameArea.appendChild(car);

  // For background Color of Main Car
  let ol = document.createElement("div");
  ol.setAttribute("class", "overLay");
  car.appendChild(ol);

  // 5 div for Road lines
  for (let x = 0; x < 6; x++) {
    let RoadLine = document.createElement("div");
    RoadLine.setAttribute("class", "roadLines");

    // Top Property added in RoadLine.  100 roadLine height and 50 gap
    RoadLine.Top = x * 150;
    RoadLine.style.top = RoadLine.Top + "px";

    gameArea.appendChild(RoadLine);
  }

  // 7 div for Enemy Cars. Logic is same as Road Lines
  for (let x = 0; x < 7; x++) {
    let EnemyCar = document.createElement("div");
    EnemyCar.setAttribute("class", "enemyCar");
    gameArea.appendChild(EnemyCar);

    // 7 Div inside 7 Div  For background Color of Enemy Car
    let lo = document.createElement("div");
    lo.setAttribute("class", "overLay");
    EnemyCar.appendChild(lo);
    lo.style.background = randomColor();

    // Vertical Separation of cars
    EnemyCar.Top = (x + 1) * 650 * -1;
    EnemyCar.style.top = EnemyCar.Top + "px";

    // Car at random position from 0 to 400px of Road Width. Horizontal Separation of cars.
    EnemyCar.style.left = Math.floor(Math.random() * 650) + "px";
  }

  // Movement of car track => offset.  Car's First Position
  player.x = car.offsetLeft;
  player.y = car.offsetTop;

  // requestAnimationFrame() will create loop of animation
  window.requestAnimationFrame(gamePlay);
}

//  A. Random Colors for Enemy Car, using HexaDecimal.
function randomColor() {
  // toString(16) will convert int into hexaDecimal.

  function c() {
    let hex;

    do {
      hex = Math.floor(Math.random() * 256).toString(16);
    } while (hex.length == 1);

    return hex;
  }

  // each c() will return 2 characters. In HexaDecimal there are 6 characters. #e3s78d
  return "#" + c() + c() + c();
}

//  B. We want to move RoadLines when game is On
function moveLines() {
  let RoadLines = document.querySelectorAll(".roadLines");

  RoadLines.forEach(function (RoadLine) {
    // Loop of Lines. Disappear after top = 700px from Top and reappear from top = 0px
    if (RoadLine.Top >= 700) {
      RoadLine.Top -= 750;
    }

    RoadLine.Top += 5;
    RoadLine.style.top = RoadLine.Top + "px";
  });
}

//  C. We want to move Enemy cars when game is On
function moveEnemy(myCar) {
  let EnemyCars = document.querySelectorAll(".enemyCar");

  EnemyCars.forEach(function (EnemyCar) {
    // If car hits then end the Game
    if (isCarCollide(myCar, EnemyCar)) {
      endGame();
    }

    if (EnemyCar.Top >= 650) {
      // Loop of Cars. Disappear after top = 750px from Top and reappear from top = 0px
      EnemyCar.Top = -300;

      EnemyCar.style.left = Math.floor(Math.random() * 650) + "px";
    }

    // Speed of car
    EnemyCar.Top += 5;
    EnemyCar.style.top = EnemyCar.Top + "px";
  });
}

//  D. Car Collision find out
function isCarCollide(myCar, enemyCar) {
  M = myCar.getBoundingClientRect();
  E = enemyCar.getBoundingClientRect();

  booleanResult = !(M.bottom < E.top || M.top > E.bottom || M.right < E.left || M.left > E.right);

  return booleanResult;
}

// #4. Actual Game
function gamePlay() {
  // This method will give all dimensions of Element.
  let roadDimensions = gameArea.getBoundingClientRect();

  if (player.wantToPlay) {
    moveLines();

    let myCar = document.querySelector(".car");
    moveEnemy(myCar);
    // When we press Arrow Key move the car. We only want car inside road.
    if (keys.ArrowUp && player.y > roadDimensions.top + 70) {
      player.y -= player.position;
    }
    if (keys.ArrowDown && player.y < roadDimensions.height - 90) {
      player.y += player.position;
    }
    if (keys.ArrowLeft && player.x > 0) {
      player.x -= player.position;
    }
    if (keys.ArrowRight && player.x < roadDimensions.width - 50) {
      player.x += player.position;
    }

    // Car Position Change
    let car = document.querySelector(".car");
    car.style.top = player.y + "px";
    car.style.left = player.x + "px";

    window.requestAnimationFrame(gamePlay);

    // Score of Game
    player.score++;
    document.getElementById("score").innerText = "Score : " + player.score;
  }
}

// #5. End game
function endGame() {
  audio.pause();
  endSound.play();

  let Score = parseInt(player.score) + 1;

  player.wantToPlay = false;
  startScreen.classList.remove("hide");
  startScreen.innerHTML =
    "Game is Over" + "<br/>" + "Your Score is " + Score + "<br/>" + "Click here To Continue";
}
