class Player extends Sprite {
  constructor({
    position,
    scale = 0.5,
    collisionBlocks,
    platformCollisionBlocks,
    srcImage,
    frameRate,
    animations,
  }) {
    super({ scale, srcImage, frameRate });
    this.position = position;
    this.velocity = {
      x: 0,
      y: 1,
    };
    this.collisionBlocks = collisionBlocks;
    this.platformCollisionBlocks = platformCollisionBlocks;
    this.hitBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      width: 10,
      height: 10,
    };
    this.animations = animations;
    this.lastDirection = "right";

    for (let key in this.animations) {
      const image = new Image();
      image.src = this.animations[key].srcImage;

      this.animations[key].image = image;
    }

    this.camerabox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      width: 200,
      height: 80,
    };
  }

  switchSprite(key) {
    if (this.image === this.animations[key].image || !this.loaded) {
      return;
    }
    this.currentFrame = 0;
    this.image = this.animations[key].image;
    this.frameBuffer = this.animations[key].frameBuffer;
    this.frameRate = this.animations[key].frameRate;
  }

  updateCameraBox() {
    this.camerabox = {
      position: {
        x: this.position.x - 50,
        y: this.position.y,
      },
      width: 200,
      height: 80,
    };
  }

  checkForHorizontalCanvasCollision() {
    if (this.hitBox.position.x + this.hitBox.width + this.velocity.x >= 576 ||
      this.hitBox.position.x + this.velocity.x <= 0) {
      this.velocity.x = 0;
    }
  }

  shouldPanCameraToTheRight({ camera }) {
    if (this.camerabox.position.x <= 0) {
      return;
    }
    if (this.camerabox.position.x <= Math.abs(camera.position.x)) {
      camera.position.x -= this.velocity.x;
    }
  }

  shouldPanCameraDown({ camera }) {
    if (this.camerabox.position.y + this.velocity.y <= 0) {
      return;
    }
    if (this.camerabox.position.y <= Math.abs(camera.position.y)) {
      camera.position.y -= this.velocity.y;
    }
  }

  shouldPanCameraUp({ camera }) {
    if (this.camerabox.position.y + this.camerabox.height + this.velocity.y <= 0) {
      return;
    }
    const scaleCanvasHeight = canvas.height / 4;

    if (this.camerabox.position.y + this.camerabox.height >= Math.abs(camera.position.y) + scaleCanvasHeight) {
      camera.position.y -= this.velocity.y;
    }
  }

  shouldPanCameraToTheLeft({ canvas, camera }) {
    const cameraboxRightSide = this.camerabox.position.x + this.camerabox.width;
    const scaleDownCanvasWidth = canvas.width / 4;

    if (cameraboxRightSide >= 576) {
      return;
    }

    if (
      cameraboxRightSide >=
      scaleDownCanvasWidth + Math.abs(camera.position.x)
    ) {
      camera.position.x -= this.velocity.x;
    }
  }

  update() {
    this.updateFrames();
    this.updateHitbox();
    this.updateCameraBox();

    //Draw out the image
    // ctx.fillStyle = "rgba(0, 255, 0, 0.2)";
    // ctx.fillRect(this.position.x, this.position.y, this.width, this.height);

    // ctx.fillStyle = "rgba(0, 0, 255, 0.5)";
    // ctx.fillRect(
    //   this.camerabox.position.x,
    //   this.camerabox.position.y,
    //   this.camerabox.width,
    //   this.camerabox.height
    // );

    this.draw();
    this.position.x += this.velocity.x;
    this.updateHitbox();
    this.checkForHorizontalCollision();
    this.applyGravity();
    this.updateHitbox();
    this.checkForVerticalCollision();
  }

  updateHitbox() {
    this.hitBox = {
      position: {
        x: this.position.x + 35,
        y: this.position.y + 26,
      },
      width: 14,
      height: 27,
    };
  }

  applyGravity() {
    this.velocity.y += GRAVITY;
    this.position.y += this.velocity.y;
  }

  checkForHorizontalCollision() {
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i];
      if (
        collision({
          object1: this.hitBox,
          object2: collisionBlock,
        })
      ) {
        if (this.velocity.x > 0) {
          this.velocity.x = 0;

          const offset =
            this.hitBox.position.x - this.position.x + this.hitBox.width;
          this.position.x = collisionBlock.position.x - offset - 0.01;
          break;
        }

        if (this.velocity.x < 0) {
          this.velocity.x = 0;

          const offset = this.hitBox.position.x - this.position.x;

          this.position.x =
            collisionBlock.position.x + collisionBlock.width - offset + 0.01;
          break;
        }
      }
    }
  }

  checkForVerticalCollision() {
    // Collision block
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i];
      if (
        collision({
          object1: this.hitBox,
          object2: collisionBlock,
        })
      ) {
        if (this.velocity.y > 0) {
          this.velocity.y = 0;

          const offset =
            this.hitBox.position.y - this.position.y + this.hitBox.height;
          this.position.y = collisionBlock.position.y - offset - 0.01;
          break;
        }

        if (this.velocity.y < 0) {
          this.velocity.y = 0;
          const offset = this.hitBox.position.y - this.position.y;
          this.position.y =
            collisionBlock.position.y + collisionBlock.height - offset + 0.01;
          break;
        }
      }
    }

    //Platform collision block
    for (let i = 0; i < this.platformCollisionBlocks.length; i++) {
      const platformCollisionBlocks = this.platformCollisionBlocks[i];
      if (
        platform({
          object1: this.hitBox,
          object2: platformCollisionBlocks,
        })
      ) {
        if (this.velocity.y > 0) {
          this.velocity.y = 0;

          const offset =
            this.hitBox.position.y - this.position.y + this.hitBox.height;
          this.position.y = platformCollisionBlocks.position.y - offset - 0.01;
          break;
        }
      }
    }
  }
}
