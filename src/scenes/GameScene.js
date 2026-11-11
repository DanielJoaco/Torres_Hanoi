import Phaser from 'phaser';
import Customer from '../objects/Customer.js';
import { generateOrder } from '../logic/OrderGenerator.js';
import { createPuzzle } from '../logic/PuzzleGenerator.js';
import { validateOrder, orderAccuracy } from '../logic/OrderValidator.js';
import { PLATE_TOWER } from '../logic/HanoiGame.js';
import IngredientView, { ING_HEIGHT, COLORS } from '../objects/IngredientView.js';
import { SFX } from '../logic/SoundFX.js';
import { SaveManager } from '../logic/SaveManager.js';
import LEVELS from '../data/levels.json';

const TOWER_X = [240, 640, 1040];
const BASE_Y = 620;
const TOWER_HEIGHT = 380;
const CUSTOMER_POS = { x: 1130, y: 130 };

export default class GameScene extends Phaser.Scene {
  constructor() { super('GameScene'); }

  init(data) {
    this.levelIndex = data.level ?? 0;
    this.level = LEVELS[this.levelIndex];
    this.score = 0;
    this.served = 0;          // clientes atendidos con éxito
    this.customerIndex = 0;
    this.canPlay = false;
    this.views = new Map();
    this.customer = null;
    this.topBun = null;
  }

  create() {
    // Textura circular para las partículas
    if (!this.textures.exists('spark')) {
      const g = this.add.graphics();
      g.fillStyle(0xffffff).fillCircle(6, 6, 6);
      g.generateTexture('spark', 12, 12);
      g.destroy();
    }

    this.drawBackground();
    this.drawTowers();

    this.drawTowers();
    this.drawHUD();
    this.setupDragEvents();

    // Tutorial solo la primera vez que se juega el nivel 1
    if (this.levelIndex === 0 && SaveManager.getStars(0) === 0) {
      this.showTutorial(() => this.startCustomer());
    } else {
      this.startCustomer();
    }
  }

  drawBackground() {
  const g = this.add.graphics().setDepth(-10);

  // Pared con franjas
  g.fillStyle(0x4a3f5c).fillRect(0, 0, 1280, 640);
  g.fillStyle(0x54486a);
  for (let x = 0; x < 1280; x += 80) g.fillRect(x, 0, 40, 640);

  // Mostrador
  g.fillStyle(0xa0703f).fillRect(0, 630, 1280, 12);
  g.fillStyle(0x6b4423).fillRect(0, 642, 1280, 78);

  // Ventana
  g.fillStyle(0x8ecae6).fillRect(520, 40, 240, 130);
  g.lineStyle(10, 0xf1e4d0).strokeRect(520, 40, 240, 130);
  g.lineBetween(640, 40, 640, 170);
  g.lineBetween(520, 105, 760, 105);

  // Lámparas colgantes
  [400, 880].forEach(x => {
    g.lineStyle(3, 0x222222).lineBetween(x, 0, x, 30);
    g.fillStyle(0xffd166).fillCircle(x, 42, 16);
  });
}

  update(time, delta) {
    if (!this.canPlay || !this.customer) return;
    this.customer.tick(delta / 1000);
    if (this.customer.remaining <= 0) this.onTimeout();
  }

  // ---------- Ciclo de clientes ----------
  startCustomer() {
    const lvl = this.level;

    this.order = generateOrder({
      ingredientCount: lvl.ingredientsPerOrder,
      availableTypes: lvl.availableTypes
    });
    this.hanoi = createPuzzle(this.order, { shuffleMoves: lvl.shuffleMoves });

    this.clearViews();
    this.createIngredientViews();
    this.layoutAll(false);

    this.customerText.setText(
      `${lvl.name} · Cliente ${this.customerIndex + 1}/${lvl.customers}`
    );

    this.customer = new Customer(this, CUSTOMER_POS.x, CUSTOMER_POS.y, this.order, lvl.patience);
    this.customer.enter(() => {
      this.canPlay = true;
      this.layoutAll(false); // activa el arrastre
    });
  }

  // Entrega (automática al completar, o con el botón)
  deliver() {
    if (!this.canPlay) return;
    this.canPlay = false;
    this.layoutAll(false); // bloquea el arrastre

    const plate = this.hanoi.plate();
    const accuracy = orderAccuracy(plate, this.order);
    const perfect = accuracy === 1;
    const bonus = perfect ? Math.round(50 * this.customer.ratio) : 0;
    const points = Math.round(accuracy * 100) + bonus;

    this.score += points;
    if (accuracy >= 0.5) this.served++;
    this.scoreText.setText(`Puntos: ${this.score}`);

    if (perfect) {
      SFX.success();
      this.addTopBun();
      if (bonus > 0) this.time.delayedCall(500, () => SFX.coin());
    } else {
      SFX.drop();
    }

    this.floatText(
      perfect ? `¡Perfecto! +${points}` : `+${points}`,
      perfect ? '#ffd166' : '#ffffff'
    );
    this.customer.leave(accuracy >= 0.5, () => this.nextCustomer());
  }

  onTimeout() {
    SFX.angry();
    this.canPlay = false;
    this.layoutAll(false);
    this.floatText('¡Se fue sin su pedido!', '#ff6b6b');
    this.customer.leave(false, () => this.nextCustomer());
  }

  nextCustomer() {
    this.customerIndex++;
    if (this.customerIndex >= this.level.customers) {
      this.scene.start('ResultScene', {
        level: this.levelIndex,
        score: this.score,
        served: this.served,
        total: this.level.customers
      });
    } else {
      this.time.delayedCall(400, () => this.startCustomer());
    }
  }

  floatText(msg, color) {
    const t = this.add.text(640, 260, msg, {
      fontSize: '56px', color, stroke: '#000', strokeThickness: 8
    }).setOrigin(0.5).setDepth(2000);
    this.tweens.add({
      targets: t, y: 200, alpha: 0, duration: 1400, delay: 400,
      onComplete: () => t.destroy()
    });
  }

drawTowers() {
  const labels = ['Ingredientes', 'Auxiliar', 'Plato del cliente'];
  TOWER_X.forEach((x, i) => {
    this.add.rectangle(x, BASE_Y - TOWER_HEIGHT / 2, 10, TOWER_HEIGHT, 0x8d99ae);

    if (i === PLATE_TOWER) {
      this.add.ellipse(x, BASE_Y + 8, 320, 34, 0xffffff).setStrokeStyle(4, 0x9aa5b1);
      this.add.ellipse(x, BASE_Y + 6, 250, 18, 0xe9ecef);
    } else {
      this.add.rectangle(x, BASE_Y + 10, 300, 20, 0xc9a66b).setStrokeStyle(3, 0x7a5a2b);
    }

    this.add.text(x, BASE_Y + 52, labels[i], { fontSize: '24px', color: '#ffffff' })
      .setOrigin(0.5);
  });
}

  drawHUD() {
    this.customerText = this.add.text(20, 20, '', { fontSize: '26px', color: '#ffd166' });
    this.scoreText = this.add.text(20, 56, 'Puntos: 0', { fontSize: '24px', color: '#ffffff' });
    this.movesText = this.add.text(20, 90, 'Movimientos: 0', { fontSize: '22px', color: '#ffffff' });

    this.add.text(20, 135, '✔ Entregar', {
      fontSize: '26px', color: '#ffffff', backgroundColor: '#2a9d8f', padding: { x: 12, y: 6 }
    }).setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.deliver());

    const muteBtn = this.add.text(1260, 120, SFX.isMuted() ? '🔇' : '🔊', {
  fontSize: '28px', backgroundColor: '#555', padding: { x: 10, y: 4 }
}).setOrigin(1, 0).setInteractive({ useHandCursor: true });

muteBtn.on('pointerdown', () => {
  muteBtn.setText(SFX.toggleMute() ? '🔇' : '🔊');
});

    this.add.text(1260, 20, '↻ Reiniciar', {
      fontSize: '24px', color: '#ffffff', backgroundColor: '#555', padding: { x: 12, y: 6 }
    }).setOrigin(1, 0).setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.scene.restart({ level: this.levelIndex }));

    this.add.text(1260, 70, '☰ Niveles', {
      fontSize: '24px', color: '#ffffff', backgroundColor: '#555', padding: { x: 12, y: 6 }
    }).setOrigin(1, 0).setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.scene.start('LevelSelectScene'));
  }

  // ---------- Vistas de ingredientes ----------
  clearViews() {
    this.views.forEach(v => v.destroy());
    this.views.clear();
    this.topBun?.destroy();
    this.topBun = null;
  }

  createIngredientViews() {
    this.hanoi.towers.forEach(tower => {
      tower.items.forEach(ing => {
        this.views.set(ing.id, new IngredientView(this, 0, 0, ing));
      });
    });
  }

  slotPosition(towerIndex, slotIndex) {
    return {
      x: TOWER_X[towerIndex],
      y: BASE_Y - ING_HEIGHT * slotIndex - ING_HEIGHT / 2
    };
  }

  layoutAll(animate = true) {
    this.hanoi.towers.forEach((tower, t) => {
      tower.items.forEach((ing, slot) => {
        const view = this.views.get(ing.id);
        const { x, y } = this.slotPosition(t, slot);
        const isTop = slot === tower.items.length - 1;

        this.input.setDraggable(view, isTop && this.canPlay);
        view.setDepth(slot);
        view.towerIndex = t;

        if (animate) {
          this.tweens.add({ targets: view, x, y, duration: 180, ease: 'Back.Out' });
        } else {
          view.setPosition(x, y);
        }
      });
    });
    this.movesText.setText(`Movimientos: ${this.hanoi.moves}`);
  }

  // ---------- Drag & drop ----------
  setupDragEvents() {
    this.input.on('dragstart', (pointer, obj) => {
      obj.setDepth(1000);
      obj.setScale(1.08);
      SFX.pick();
    });

    this.input.on('drag', (pointer, obj, dragX, dragY) => {
      obj.setPosition(dragX, dragY);
    });

    this.input.on('dragend', (pointer, obj) => {
      obj.setScale(1);
      if (!this.canPlay) return;

      const from = obj.towerIndex;
      const to = this.nearestTower(obj.x);

      if (this.hanoi.move(from, to)) {
        SFX.drop();
        this.layoutAll(true);
        if (validateOrder(this.hanoi.plate(), this.order)) this.deliver();
      } else {
        this.rejectMove(obj);
      }
    });
  }

  nearestTower(x) {
    let best = 0;
    TOWER_X.forEach((tx, i) => {
      if (Math.abs(tx - x) < Math.abs(TOWER_X[best] - x)) best = i;
    });
    return best;
  }

  rejectMove(view) {
    SFX.error();
    const slot = this.hanoi.towers[view.towerIndex].items.length - 1;
    const { x, y } = this.slotPosition(view.towerIndex, slot);

    this.tweens.add({
      targets: view, x, y, duration: 150, ease: 'Quad.Out',
      onComplete: () => {
        view.setDepth(slot);
        this.tweens.add({
          targets: view, x: x + 8, duration: 40, yoyo: true, repeat: 2,
          onComplete: () => view.setX(x)
        });
      }
    });
    this.cameras.main.flash(120, 255, 60, 60, false);
  }

  // ---------- Pulido ----------
  showTutorial(onClose) {
    const shade = this.add.rectangle(640, 360, 1280, 720, 0x000000, 0.85)
      .setDepth(3000).setInteractive();

    const text = this.add.text(640, 300, [
      '¡Bienvenido al restaurante!',
      '',
      'Arma la hamburguesa del cliente en el plato (torre de la derecha).',
      'Solo puedes mover el ingrediente de ARRIBA de cada torre.',
      '',
      'Regla: nunca pongas un ingrediente de arriba debajo de uno de abajo.',
      'Orden de abajo hacia arriba: pan › vegetales › carne › salsas.',
      '',
      'Usa la torre del medio como ayuda. ¡Y cuidado con la paciencia!'
    ], {
      fontSize: '28px', color: '#ffffff', align: 'center', lineSpacing: 8
    }).setOrigin(0.5).setDepth(3001);

    const btn = this.add.text(640, 560, '¡Entendido!', {
      fontSize: '36px', color: '#ffffff', backgroundColor: '#2a9d8f', padding: { x: 24, y: 10 }
    }).setOrigin(0.5).setDepth(3001).setInteractive({ useHandCursor: true });

    btn.on('pointerdown', () => {
      [shade, text, btn].forEach(o => o.destroy());
      onClose();
    });
  }

  burst(x, y) {
    const p = this.add.particles(x, y, 'spark', {
      speed: { min: 150, max: 450 },
      angle: { min: 200, max: 340 },
      gravityY: 700,
      lifespan: 1000,
      scale: { start: 1, end: 0 },
      tint: [0xffd166, 0xef476f, 0x06d6a0, 0x118ab2],
      emitting: false
    }).setDepth(1500);

    p.explode(35);
    this.time.delayedCall(1300, () => p.destroy());
  }

  // El pan superior cae sobre la hamburguesa terminada
addTopBun() {
  const slot = this.hanoi.plate().length;
  const { x, y } = this.slotPosition(PLATE_TOWER, slot);
  const targetY = y - 6; // el pan de arriba es un poco más alto que un slot

  this.topBun = this.add.image(x, targetY - 300, 'bun_top').setDepth(500);
  this.tweens.add({
    targets: this.topBun, y: targetY, duration: 350, ease: 'Bounce.Out',
    onComplete: () => this.burst(x, targetY)
  });
}
}