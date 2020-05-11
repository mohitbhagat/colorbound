var anims = [];

function addAnim(frames, frameTime) {
    anims.push({
        frames : frames,
        frameTime : frameTime,
        frameIndex : 0,
        timer : 0
    });

    return anims[anims.length - 1];
}

function updateAnim(anim, dt) {
    anim.timer += dt;
    if(anim.timer >= anim.frameTime) {
        anim.frameIndex = (anim.frameIndex + 1) % anim.frames.length;
        anim.timer = 0;
    }
}

function drawFrame(image, x, y) {
    ctx.drawImage(image, x, y);
}
