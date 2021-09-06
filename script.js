// Be sure to name any p5.js functions we use in the global so Glitch can recognize them.
// Add to this list as you consult the p5.js documentation for other functions.
/* global createCanvas, colorMode, HSB, width, height, random, background, fill, color, random,
          rect, ellipse, stroke, image, loadImage, collidePointRect, collideCircleCircle, collideRectCircle, text, textFont,
          mouseX, mouseY, strokeWeight, line, mouseIsPressed, windowWidth, windowHeight, noStroke, 
          int, pmouseX, pmouseY, createButton, position, keyCode, UP_ARROW, LEFT_ARROW, RIGHT_ARROW, DOWN_ARROW, textSize, keyIsDown, push, pop, collideRectRect, loadSound */

let backgroundColor,
  level,
  levelIsOver,
  knight,
  hit1,
  hit,
  skelImg,
  knightImg,
  backgroundImg,
  skeletons,
  coins,
  score,
  gameIsOver,
  lives,
  sound,
  highScore,
  door;
let isStart, textHeight, isPlay, invincible, randomIndex, powerUpTimer;
let button;

function preload() {
  knightImg = loadImage(
    "https://cdn.glitch.com/3e8256ef-982b-436d-ba89-3dab400c4e64%2Funnamed.png?v=1627928032659"
  );
  skelImg = loadImage(
    "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/f57b5304-de59-49e3-b0f9-cc29a2458425/dcob6js-8436e2ad-9f9b-4f96-ac5e-afd80fac444a.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2Y1N2I1MzA0LWRlNTktNDllMy1iMGY5LWNjMjlhMjQ1ODQyNVwvZGNvYjZqcy04NDM2ZTJhZC05ZjliLTRmOTYtYWM1ZS1hZmQ4MGZhYzQ0NGEucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.IFT_-c5Cc4FzM_cbqowAILZkcsjHQqGKbQ__jAdy_Lg"
  );
  backgroundImg = loadImage(
    "https://cdn.glitch.com/3e8256ef-982b-436d-ba89-3dab400c4e64%2F273e774e5e4ddf1b05377f6329198c67.png?v=1628010911061"
  );
  sound = loadSound(
    "https://cdn.glitch.com/3e8256ef-982b-436d-ba89-3dab400c4e64%2F7205660b-5155-4286-a342-8b6488dcc355.Arcade%20Game%20Music%20Type%20Beat.mp3?v=1628008086463.mp3"
  );
}

// Game song settings
let song;
let slider;
var createSlider;

function setup() {
  // Canvas & color settings
  createCanvas(400, 600);

 // loadGameMusic();
  sound.play();
  sound.loop();
  slider = createSlider(0, 0.5, 0.1, 0.1);

  //Controls how many skeletons will be spawned
  skeletons = [];
  for (let i = 0; i < 2; i++) {
    skeletons.push(new Skeleton());
  }

  coins = [];
  for (let i = 0; i < 9; i++) {
    /*coins.push(new Coins(40 + i*40, height/2 - 120));
    coins.push(new Coins(40 + i*40, height/2 + 80));
    coins.push(new Coins(40 + i*40, height/2 + 40));
    coins.push(new Coins(40 + i*40, height/2));
    coins.push(new Coins(40 + i*40, height/2 - 40));
    coins.push(new Coins(40 + i*40, height/2 - 80));
    coins.push(new Coins(40 + i*40, height/2 - 160));*/
    coins.push(
      new Coins(40 + i * 40, height / 2 - 200)
    ); /*
    coins.push(new Coins(40 + i*40, height/2 + 120));
    coins.push(new Coins(40 + i*40, height/2 + 160));
    coins.push(new Coins(40 + i*40, height/2 + 200));
    coins.push(new Coins(40 + i*40, height/2 + 240));
    */
  }
  score = 0;
  hit = false;
  highScore = 0;
  lives = 3;
  knight = new Knight();
  gameIsOver = false;
  isStart = true;
  isPlay = false;
  invincible = false;
  door = new Door();
  levelIsOver = false;
  level = 1;
  textHeight = height;
  randomIndex = random(0, coins.length);
  powerUpTimer = 0;
}

function draw() {
  // Adjusts sound slider
  let val = slider.value();
  sound.setVolume(val);
  
  // Start up screen before entering game
  startScreen();
  
  // Screen for actual game
  if (isStart == false) {
    background(0, 0, backgroundColor);
    push();
    image(backgroundImg, 0, 0, 400, 600);
    pop();
    //Restart button
    push();
    fill(60);
    noStroke();
    rect(266, 2, 52, 16);
    fill(255);
    text(`Restart?`, 270, 15);
    pop();

    // Creates the skeletons on the map
    for (let skeleton of skeletons) {
      skeleton.show();
      skeleton.move();
      skeleton.countLives();
      skeleton.checkCollisions();
    }
    
    // Creates the door and knight on the map
    door.show();
    knight.show();
    
    // Creates all the coins on the map
    for (let coin of coins) {
      coin.draw();
    }

    //Score Board
    push();
    fill(255);
    text(`Score: ${score}`, 20, 15);
    text(`High Score: ${highScore}`, 82, 15);
    text(`Lives: ${lives}`, 172, 15);
    text(`Level ${level}`, 220, 15);
    if (invincible == true) {
      text(`Power Up Time: ${int(250 - powerUpTimer)}`, 20, 35);
    }
    pop();
    // Invincible Timer
     if (invincible == true) {
      
      powerUpTimer += 1;
      if (powerUpTimer >= 250) {
        invincible = false;
      }
    }
    
    //Runs game, ends game, or adds a level
    gameIsOver = checkGameOver();
    levelIsOver = door.finishLevel();
    if (gameIsOver === true) {
      push();
      textSize(30);
      fill(255);
      text("GAME OVER", width / 2 - 85, height / 2);
      pop();
      gameRestart();
      gameIsOver = false;
    } else if (levelIsOver === true) {
      levelUp();
    } else {
      knight.move();
      gameRestart();
    }
  }
}

// Function to display our initial start up screen
function startScreen() {
  // All the actual text
  background(0, 0, 0);
  push();
  fill("Gold");
  textFont("Old Century");
  textSize(40);
  text("Castle Escape", 100, textHeight);
  textSize(20);
  text("You hear rumors one day of a castle where ", 30, textHeight + 30);
  text("people never return from. As the kingdom's ", 30, textHeight + 60);
  text("most valiant knight, you decide to check", 30, textHeight + 90);
  text("this cursed castle out for yourself and ", 30, textHeight + 120);
  text("rescue these people who have disappeared.", 30, textHeight + 150);
  text("However, upon entering the castle, a trap", 30, textHeight + 180);
  text("door appears from underneath, and you are", 30, textHeight + 210);
  text("stuck on the bottom floor of the castle. To", 30, textHeight + 240);
  text("save yourself and the others from certain", 30, textHeight + 270);
  text("doom, escape from the castle immediately!", 30, textHeight + 300);
  // Allows text to creep up screen
  if (textHeight > 50) {
    textHeight -= 0.5;
  }
  if (textHeight <= 50) {
    text("Click anywhere to begin the game.", 65, 400);
  }
  pop();
  // When you click the screen, the game will start
  if (mouseIsPressed) {
    isStart = false;
  }
}

//Next level and restart board
function levelUp() {
  level++;
  knight.revertPosition();
  for (let i = 0; i < 9; i++) {
    coins.push(new Coins(40 + i * 40, height / 2 - 120));
    coins.push(new Coins(40 + i * 40, height / 2 + 80));
    coins.push(new Coins(40 + i * 40, height / 2 + 40));
    coins.push(new Coins(40 + i * 40, height / 2));
    coins.push(new Coins(40 + i * 40, height / 2 - 40));
    coins.push(new Coins(40 + i * 40, height / 2 - 80));
    coins.push(new Coins(40 + i * 40, height / 2 - 160));
    coins.push(new Coins(40 + i * 40, height / 2 - 200));
    coins.push(new Coins(40 + i * 40, height / 2 + 120));
    coins.push(new Coins(40 + i * 40, height / 2 + 160));
    coins.push(new Coins(40 + i * 40, height / 2 + 200));
    coins.push(new Coins(40 + i * 40, height / 2 + 240));
  }
  randomIndex = Math.round(random(0, coins.length));
  coins[randomIndex].becomePowerUp();
  for (let coin of coins) {
    coin.draw();
  }
  for (let i = skeletons.length; i > 0; i--) {
    skeletons.pop();
  }
  for (let h = 0; h < level + 1; h++) {
    skeletons.push(new Skeleton());
  }
  for (let skeleton of skeletons) {
    skeleton.show();
    skeleton.move();
    skeleton.countLives();
    skeleton.checkCollisions();
  }
  levelIsOver = false;
}

//Restart game with Restart button
function gameRestart() {
  if (mouseIsPressed) {
    if (mouseX > 265 && mouseX < 320) {
      if (mouseY > 2 && mouseY < 18) {
        //Revert position
        knight.revertPosition();
        //Re-organize coins
        for (let i = coins.length; i > 0; i--) {
          coins.pop();
        }
        for (let i = 0; i < 9; i++) {
          /*coins.push(new Coins(false, 40 + i*40, height/2 - 120));
      coins.push(new Coins(40 + i*40, height/2 + 80));
      coins.push(new Coins(40 + i*40, height/2 + 40));
      coins.push(new Coins(40 + i*40, height/2));
      coins.push(new Coins(40 + i*40, height/2 - 40));
      coins.push(new Coins(40 + i*40, height/2 - 80));
      coins.push(new Coins(40 + i*40, height/2 - 160));*/
          coins.push(
            new Coins(40 + i * 40, height / 2 - 200)
          ); /*
      coins.push(new Coins(40 + i*40, height/2 + 120));
      coins.push(new Coins(40 + i*40, height/2 + 160));
      coins.push(new Coins(40 + i*40, height/2 + 200));
      coins.push(new Coins(40 + i*40, height/2 + 240));*/
        }
        for (let coin of coins) {
          coin.draw();
        }
        //Re-organize skeletons
        for (let i = skeletons.length; i > 0; i--) {
          skeletons.pop();
        }
        for (let h = skeletons.length; h < 2; h++) {
          skeletons.push(new Skeleton());
        }
        for (let skeleton of skeletons) {
          skeleton.show();
          skeleton.move();
          skeleton.countLives();
          skeleton.checkCollisions();
        }
        //Re-organize information on top line
        score = 0;
        lives = 3;
        level = 1;
        powerUpTimer = 0;
        
      }
    }
  }
}

//Determines if player lost game
function checkGameOver() {
  for (let i = 0; i < skeletons.length; i++) {
    if (skeletons[i].checkGameOver() === true) {
      gameIsOver = true;
    }
  }
  //Stores a high score
  if (gameIsOver) {
    if (score > highScore) {
      highScore = score;
    }
  }
  return gameIsOver;
}

//Creates the door
class Door {
  constructor() {
    this.frameX = width - 60;
    this.frameY = 20;
    this.frameWidth = 40;
    this.frameHeight = 60;
    this.handleX = width - 50;
    this.handleY = 55;
    this.handleSize = 10;
  }
  //draws door
  show() {
    push();
    fill(color(160, 39, 31));
    rect(this.frameX, this.frameY, this.frameWidth, this.frameHeight);
    pop();
    push();
    fill(color("gold"));
    ellipse(this.handleX, this.handleY, this.handleSize);
    pop();
  }
  //Determine if next level is reached
  finishLevel() {
    let hit = collideRectRect(
      this.frameX,
      this.frameY,
      this.frameWidth,
      this.frameHeight,
      knight.hitBoxX,
      knight.hitBoxY,
      knight.hitBoxWidth,
      knight.hitBoxHeight
    );
    if (hit && coins.length === 0) {
      levelIsOver = true;
    }
    return levelIsOver;
  }
}

//Create skeltons
class Skeleton {
  constructor() {
    this.x = random(20, width - 140);
    this.y = random(height / 2 - 200, height - 140);
    this.initialX = this.x;
    this.initialY = this.y;
    this.width = 60;
    this.height = 60;
    this.hitBoxX = this.x + 5;
    this.hitBoxY = this.y;
    this.hitBoxWidth = this.width - 10;
    this.hitBoxHeight = this.height;
    this.xVel = 1 + level;
    this.yVel = 1 + level;
  }
  // Shows a skeleton including its hitbox when called
  show() {
    push();
    fill(20);
    noStroke();
    rect(this.hitBoxX, this.hitBoxY, this.hitBoxWidth, this.hitBoxHeight);
    image(skelImg, this.x, this.y, this.width, this.height);
    pop();
  }
  // Checks collisions with knight
  checkCollisions() {
    let hit1 = collideRectRect(
      this.hitBoxX,
      this.hitBoxY,
      this.hitBoxWidth,
      this.hitBoxHeight,
      knight.hitBoxX,
      knight.hitBoxY,
      knight.hitBoxWidth,
      knight.hitBoxHeight
    );
    return hit1;
  }
  // Reduces lives of knight each time skeleton hits him and reverts knight's position back to spawn point
  countLives() {
    if (this.checkCollisions() === true && invincible == false) {
      lives--;
      knight.revertPosition();
    }
    return lives;
  }
  // Ends game if all coins are collected
  checkGameOver() {
    if (this.countLives() === 0) {
      return true;
    }
  }
  // Moves skeleton in a square-like motion
  move() {
    let maxPositionX = this.initialX + 80;
    let maxPositionY = this.initialY + 80;
    let initialPositionX = this.initialX;
    let initialPositionY = this.initialY;
    if (this.x < maxPositionX && this.y <= initialPositionY) {
      this.xVel = 0;
      this.xVel = 2;
      this.x += this.xVel;
      this.hitBoxX += this.xVel;
    }
    if (this.x >= maxPositionX && this.y < maxPositionY) {
      this.yVel = 0;
      this.yVel = 2;
      this.y += this.yVel;
      this.hitBoxY += this.yVel;
    }
    if (this.y >= maxPositionY && this.x > initialPositionX) {
      this.xVel = 0;
      this.xVel = -2;
      this.x += this.xVel;
      this.hitBoxX += this.xVel;
    }
    if (this.x <= initialPositionX && this.y > initialPositionY) {
      this.yVel = 0;
      this.yVel = -2;
      this.y += this.yVel;
      this.hitBoxY += this.yVel;
    }
  }
}

class Coins {
  constructor(x, y) {
    //this.hit = hit;
    this.x = x;
    this.y = y;
    this.r = 5;
    this.color = color("gold");
    this.colorCode = 0;
  }
  //Draw coins
  draw() {
    if (this.checkCollisions() === false) {
      push();
      fill(this.color);
      noStroke();
      ellipse(this.x, this.y, this.r * 2, this.r * 2);
      pop();
    }
  }
  //Set up collisions with coins
  checkCollisions() {
    hit = collideRectCircle(
      knight.hitBoxX,
      knight.hitBoxY,
      knight.hitBoxWidth,
      knight.hitBoxHeight,
      this.x,
      this.y,
      this.r * 2
    );
    // Causes coins to disappear when the knight touches them
    for (let i = 0; i < coins.length; i++) {
      if (hit === true) {
        if (
          coins[i].x === this.x &&
          coins[i].y === this.y &&
          coins[i].r === this.r
        ) {
          // Activates the invincible power up upon collision with it
          if (coins[i].colorCode == 1) {
            invincible = true;
          }
          coins.splice(i, 1);
        }
      }
    }
    if (hit === true) {
      score++;
    }
    
    // Causes the invincible power up to disappear after some time
    return hit;
  }
  // Checks argument of game ending based off coins left
  checkGameOver() {
    if (coins.length === 0) {
      return true;
    }
  }
  // Changes a random coin on the map to become a power up 
  becomePowerUp() {
    this.color = color("red");
    this.colorCode = 1;
  }
  // Returns true if there is a collision with specific coin
  hitWithCoin() {
    this.hit2 = collideRectCircle(
      knight.hitBoxX,
      knight.hitBoxY,
      knight.hitBoxWidth,
      knight.hitBoxHeight,
      this.x,
      this.y,
      this.r * 2
    );
    if (this.hit2) {
      return true;
    }
  }
}

// Class for the knight character
class Knight {
  constructor() {
    this.x = 20;
    this.y = 20;
    this.width = 60;
    this.height = 60;
    this.hitBoxX = this.x + 5;
    this.hitBoxY = this.y;
    this.hitBoxWidth = this.width - 10;
    this.hitBoxHeight = this.height;
    this.xVel = 1;
    this.yVel = 1;
    this.color = color(102, 90, 86);
  }
  // Shows the Knight, its features, and its hitbox amongst being called
  show() {
    if (invincible == true) {
      this.color = color("red");
    } else {
      this.color = color(102, 90, 86);
    }
    push();
    fill(this.color);
    rect(this.hitBoxX, this.hitBoxY, this.hitBoxWidth, this.hitBoxHeight);
    image(knightImg, this.x, this.y, this.width, this.height);
    pop();
  }
  // Player movement for the Knight
  move() {
    if (keyIsDown(87) && this.y > 0) {
      // W
      this.y -= this.yVel;
      this.hitBoxY -= this.yVel;
    }
    if (keyIsDown(65) && this.x > -5) {
      // A
      this.x -= this.xVel;
      this.hitBoxX -= this.xVel;
    }
    if (keyIsDown(83) && this.y < height - this.height) {
      // S
      this.y += this.yVel;
      this.hitBoxY += this.yVel;
    }
    if (keyIsDown(68) && this.x < width - this.width + 5) {
      // D
      this.x += this.xVel;
      this.hitBoxX += this.xVel;
    }
  }
  //Speeds knight up
  speedUp() {
    this.xVel = 2;
    this.yVel = 2;
  }
  // Brings knight back to his spawn point
  revertPosition() {
    this.x = 20;
    this.y = 20;
    this.hitBoxX = this.x + 5;
    this.hitBoxY = this.y;
  }
}

// Tomorrow's Focus: ply the game and brush and polish any last lines of code
