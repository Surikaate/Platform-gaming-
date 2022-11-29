class Sprite {
  constructor({ position, scale = 1, srcImage, frameRate = 1, frameBuffer = 3 }) {
    this.position = position;
    this.scale = scale;
    this.loaded = false;
    this.image = new Image();
    this.image.onload = (e) => {
      this.width = (this.image.width / this.frameRate) * this.scale;
      this.height = this.image.height * this.scale;
      this.loaded = true;
    };
    this.image.src = srcImage;
    this.frameRate = frameRate;
    this.currentFrame = 0;

    // Reduce animation speed
    this.frameBuffer = frameBuffer;
    this.elapsedFrames = 0;
  }

  draw() {
    if (!this.image) {
      return;
    }

    // Cropping image png
    const cropBox = {
      position: {
        x: this.currentFrame * (this.image.width / this.frameRate),
        y: 0,
      },
      width: this.image.width / this.frameRate,
      height: this.image.height,
    };

    ctx.drawImage(
      this.image,
      cropBox.position.x,
      cropBox.position.y,
      cropBox.width,
      cropBox.height,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update() {
    this.draw();
    this.updateFrames();
  }

  updateFrames() {
    this.elapsedFrames++;
    if (this.elapsedFrames % this.frameBuffer === 0) {
      if (this.currentFrame < this.frameRate - 1) {
        this.currentFrame++;
      } else {
        this.currentFrame = 0;
      }
    }
  }
}
