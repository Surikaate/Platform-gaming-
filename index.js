// Canvas setup
const canvas = document.querySelector("canvas");
canvas.width = 1024;
canvas.height = 576;

// Constants
const GRAVITY = 0.1;
const KEYS = {
  d: {
    pressed: false,
  },
  q: {
    pressed: false,
  },
};
const scaledCanvas = {
  width: canvas.width / 4,
  height: canvas.height / 4,
};

const ctx = canvas.getContext("2d");

// Variables

let background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  srcImage: "./sprites/background.png",
});

const floorCollision2D = [];
for (let i = 0; i < floorCollision.length; i += 36) {
  floorCollision2D.push(floorCollision.slice(i, i + 36));
}

const collisionBlocks = [];
floorCollision2D.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 202) {
      collisionBlocks.push(
        new CollisionBlock({
          position: {
            x: x * 16,
            y: y * 16,
          },
        })
      );
    }
  });
});

const platformCollision2D = [];
for (let i = 0; i < floorCollision.length; i += 36) {
  platformCollision2D.push(platformCollision.slice(i, i + 36));
}

const platformCollisionBlocks = [];
platformCollision2D.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 202) {
      platformCollisionBlocks.push(
        new CollisionBlock({
          position: {
            x: x * 16,
            y: y * 16,
          },
          height: 4,
        })
      );
    }
  });
});

let player = new Player({
  position: {
    x: 100,
    y: 300,
  },
  collisionBlocks,
  platformCollisionBlocks,
  srcImage: "./sprites/warrior/Idle.png",
  frameRate: 8,
  animations: {
    Idle: {
      srcImage: "./sprites/warrior/Idle.png",
      frameRate: 8,
      frameBuffer: 3,
    },
    IdleLeft: {
      srcImage: "./sprites/warrior/IdleLeft.png",
      frameRate: 8,
      frameBuffer: 3,
    },
    Run: {
      srcImage: "./sprites/warrior/Run.png",
      frameRate: 8,
      frameBuffer: 5,
    },
    RunLeft: {
      srcImage: "./sprites/warrior/RunLeft.png",
      frameRate: 8,
      frameBuffer: 5,
    },
    Jump: {
      srcImage: "./sprites/warrior/Jump.png",
      frameRate: 2,
      frameBuffer: 3,
    },
    JumpLeft: {
      srcImage: "./sprites/warrior/JumpLeft.png",
      frameRate: 2,
      frameBuffer: 3,
    },
    Fall: {
      srcImage: "./sprites/warrior/Fall.png",
      frameRate: 2,
      frameBuffer: 3,
    },
    FallLeft: {
      srcImage: "./sprites/warrior/FallLeft.png",
      frameRate: 2,
      frameBuffer: 3,
    },
  },
});

const backgroundImageHeight = 432;

const camera = {
    position: {
        x: 0,
        y: -backgroundImageHeight + scaledCanvas.height
    }
};

function animate() {
  window.requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.scale(4, 4);
  ctx.translate(camera.position.x, camera.position.y);
  background.update();
  collisionBlocks.forEach((block) => {
    block.update();
  });
  platformCollisionBlocks.forEach((block) => {
    block.update();
  });

  player.checkForHorizontalCanvasCollision();
  player.update();
  // Listening for key events
  player.velocity.x = 0;
  if (KEYS.d.pressed) {
    player.switchSprite("Run");
    player.velocity.x = 2;
    player.lastDirection = "right";
    player.shouldPanCameraToTheLeft({ canvas, camera });
  } else if (KEYS.q.pressed) {
    player.switchSprite("RunLeft");
    player.velocity.x = -2;
    player.lastDirection = "left";
    player.shouldPanCameraToTheRight({ canvas, camera });
  } else if (player.velocity.y === 0) {
    if (player.lastDirection === "right") {
      player.switchSprite("Idle");
    } else {
      player.switchSprite("IdleLeft");
    }
  }

  if (player.velocity.y < 0) {
    player.shouldPanCameraDown({ camera, canvas });
    if (player.lastDirection === "right") {
      player.switchSprite("Jump");
    } else {
      player.switchSprite("JumpLeft");
    }
  } else if (player.velocity.y > 0) {
    player.shouldPanCameraUp({ camera, canvas });
    if (player.lastDirection === "right") {
      player.switchSprite("Fall");
    } else {
      player.switchSprite("FallLeft");
    }
  }
  ctx.restore();
}

animate();

// Listening for pressed key
window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "d":
      KEYS.d.pressed = true;
      break;
    case "q":
      KEYS.q.pressed = true;
      break;
    case " ":
      if (player.velocity.y === 0) {
        player.velocity.y = -4;
      }
      break;
  }
});

// Listening for unpressed key
window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "d":
      KEYS.d.pressed = false;
      break;
    case "q":
      KEYS.q.pressed = false;
      break;
  }
});
