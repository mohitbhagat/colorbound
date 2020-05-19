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

function drawFrame(image, x, y, frame, fw, fh, flip) {
    var columns = image.width / fw;

    var u = frame % columns;
    var v = Math.floor(frame / columns);

    if(!flip) {
        ctx.drawImage(image, u * fw, v * fh, fw, fh, x, y, fw, fh);
    } else {
        ctx.save();

        ctx.translate(x + fw, y);
        ctx.scale(-1, 1);

        ctx.drawImage(image, u * fw, v * fh, fw, fh, 0, 0, fw, fh);

        ctx.restore();
    }
}
