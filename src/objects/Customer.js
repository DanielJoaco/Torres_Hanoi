import Phaser from 'phaser';

const BAR_W = 110;

export default class Customer extends Phaser.GameObjects.Container {
  constructor(scene, x, y, order, patience) {
    super(scene, x, y);
    this.order = order;
    this.maxPatience = patience;
    this.remaining = patience;
    this.mood = null;

    const pick = (arr) => Phaser.Utils.Array.GetRandom(arr);
    const skin = pick([0xf1c27d, 0xe0ac69, 0xc68642, 0x8d5524]);
    const hair = pick([0x2b1d0e, 0x6b3e1d, 0xd4a017, 0xb5391a, 0x222222]);
    const shirt = pick([0x3a86ff, 0xef476f, 0x06d6a0, 0xffbe0b, 0x8338ec]);

    const shoulders = scene.add.ellipse(0, 76, 110, 56, shirt).setStrokeStyle(4, 0x000000, 0.5);
    const face = scene.add.circle(0, 0, 45, skin).setStrokeStyle(4, 0x000000, 0.6);
    const hairShape = scene.add.ellipse(0, -36, 82, 30, hair);
    const eyeL = scene.add.circle(-16, -8, 9, 0xffffff);
    const eyeR = scene.add.circle(16, -8, 9, 0xffffff);
    const pupL = scene.add.circle(-16, -8, 5, 0x000000);
    const pupR = scene.add.circle(16, -8, 5, 0x000000);
    const cheekL = scene.add.circle(-28, 10, 7, 0xff7b7b, 0.35);
    const cheekR = scene.add.circle(28, 10, 7, 0xff7b7b, 0.35);

    this.faceG = scene.add.graphics(); // cejas y boca (cambian con el humor)

    const barBg = scene.add.rectangle(0, 112, BAR_W, 14, 0x000000, 0.5);
    this.barFill = scene.add.rectangle(-BAR_W / 2, 112, BAR_W, 10, 0x6abe30).setOrigin(0, 0.5);

    this.add([
      shoulders, face, hairShape, eyeL, eyeR, pupL, pupR, cheekL, cheekR,
      this.faceG, barBg, this.barFill, this.buildBubble(scene)
    ]);
    this.setMood('happy');
    scene.add.existing(this);
  }

  setMood(mood) {
    if (mood === this.mood) return;
    this.mood = mood;
    const g = this.faceG;
    g.clear().lineStyle(4, 0x000000, 0.85);

    if (mood === 'happy') {
      g.beginPath(); g.arc(0, 8, 15, 0.2, Math.PI - 0.2, false); g.strokePath();
    } else if (mood === 'neutral') {
      g.lineBetween(-12, 22, 12, 22);
    } else { // angry
      g.beginPath(); g.arc(0, 36, 15, Math.PI + 0.2, 2 * Math.PI - 0.2, false); g.strokePath();
      g.lineBetween(-26, -26, -8, -18);
      g.lineBetween(26, -26, 8, -18);
    }
  }

  // Burbuja con mini-hamburguesa (el pan queda abajo)
  buildBubble(scene) {
    const rowH = 16;
    const w = 150;
    const h = this.order.length * rowH + 30;
    const container = scene.add.container(-45 - w / 2 - 10, 0);

    const bg = scene.add.graphics();
    bg.fillStyle(0xffffff, 0.95).fillRoundedRect(-w / 2, -h / 2, w, h, 16);
    bg.lineStyle(3, 0x000000, 0.5).strokeRoundedRect(-w / 2, -h / 2, w, h, 16);
    container.add(bg);

    this.order.forEach((type, i) => {
      const y = h / 2 - 15 - rowH / 2 - i * rowH;
      container.add(scene.add.image(0, y, `ing_${type}`).setDisplaySize(100, rowH));
    });
    return container;
  }

  get ratio() { return Math.max(0, this.remaining / this.maxPatience); }

  tick(dt) {
    this.remaining = Math.max(0, this.remaining - dt);
    const r = this.ratio;

    this.barFill.displayWidth = Math.max(1, BAR_W * r);
    if (r > 0.5)       { this.barFill.setFillStyle(0x6abe30); this.setMood('happy'); }
    else if (r > 0.25) { this.barFill.setFillStyle(0xffd166); this.setMood('neutral'); }
    else               { this.barFill.setFillStyle(0xcc2b2b); this.setMood('angry'); }
  }

  enter(onDone) {
    const targetX = this.x;
    this.x = targetX + 400;
    this.setAlpha(0);
    this.scene.tweens.add({
      targets: this, x: targetX, alpha: 1, duration: 500, ease: 'Back.Out',
      onComplete: onDone
    });
  }

  leave(happy, onDone) {
    this.setMood(happy ? 'happy' : 'angry');
    this.scene.tweens.add({
      targets: this, x: this.x + 400, alpha: 0, duration: 500, delay: 400, ease: 'Quad.In',
      onComplete: () => { this.destroy(); onDone?.(); }
    });
  }
}