
class WavyVertexShader extends affine.Gpu.VertexShader {
    dim: Fx8;
    constructor(src: affine.Vertex[], dim: number) {
        super(src);
        this.dim = Fx8(dim);
    }
    public transform(frameId: number, xfrm: affine.Transform): void {
        if (this.frameId === frameId) { return; }
        this.frameId = frameId;
        this.src.forEach((v, i) => {
            xfrm.transformToRef(v.pos, this.verts[i].pos);
            const t = Fx8(this.frameId);
            const angle = Fx.toFloat(Fx.add(t, Fx.mul(this.dim, v.uv.u)));
            const s = Fx8(Math.sin(angle));
            //const s = affine.trig.sin(angle);
            const offset = Fx.mul(xfrm.localScl.x, s);
            this.verts[i].pos.y = Fx.add(this.verts[i].pos.y, offset);
        });
    }

}

class Scene extends affine.Scene {
    sprite: affine.MeshSprite;
    scale: number;

    constructor() {
        super();
        this.scale = 1;
        const img = helpers.getImageByName("dino");
        const dim = 6;
        const size = 60;
        this.sprite = new affine.MeshSprite(this, dim, dim, size / dim, size / dim,
            (src: affine.Vertex[]) => new WavyVertexShader(src, dim),
            () => new affine.Gpu.TexturedPixelShader(img));
    }

    /*override*/startup() {
        controller.setRepeatDefault(0, 1);
        controller.up.onEvent(ControllerButtonEvent.Pressed, () => this.moveUp());
        controller.up.onEvent(ControllerButtonEvent.Repeated, () => this.moveUp());
        controller.down.onEvent(ControllerButtonEvent.Pressed, () => this.moveDown());
        controller.down.onEvent(ControllerButtonEvent.Repeated, () => this.moveDown());
        controller.left.onEvent(ControllerButtonEvent.Pressed, () => this.moveLeft());
        controller.left.onEvent(ControllerButtonEvent.Repeated, () => this.moveLeft());
        controller.right.onEvent(ControllerButtonEvent.Pressed, () => this.moveRight());
        controller.right.onEvent(ControllerButtonEvent.Repeated, () => this.moveRight());
        controller.A.onEvent(ControllerButtonEvent.Pressed, () => this.scaleUp());
        controller.B.onEvent(ControllerButtonEvent.Pressed, () => this.scaleDown());
    }

    /*override*/update(dt: number) {
        this.sprite.xfrm.localScl.x = this.sprite.xfrm.localScl.y = Fx8(this.scale);
    }

    /*override*/draw() {
        this.sprite.draw();
    }

    moveSpeed = Fx8(2);

    moveUp() {
        this.sprite.xfrm.localPos.y = Fx.sub(this.sprite.xfrm.localPos.y, this.moveSpeed);
    }

    moveDown() {
        this.sprite.xfrm.localPos.y = Fx.add(this.sprite.xfrm.localPos.y, this.moveSpeed);
    }

    moveLeft() {
        this.sprite.xfrm.localPos.x = Fx.sub(this.sprite.xfrm.localPos.x, this.moveSpeed);
    }

    moveRight() {
        this.sprite.xfrm.localPos.x = Fx.add(this.sprite.xfrm.localPos.x, this.moveSpeed);
    }

    scaleUp() {
        this.scale *= 1.5;
    }

    scaleDown() {
        this.scale /= 1.5;
        if (this.scale < 0.1) this.scale = 0.1;
    }
}

affine.Scene.pushScene(new Scene());
