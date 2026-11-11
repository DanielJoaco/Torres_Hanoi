import Phaser from 'phaser';
import LEVELS from '../data/levels.json';
import { SaveManager } from '../logic/SaveManager.js';

const COLUMNS = 4;
const CARD_W = 240;
const CARD_H = 170;
const GAP = 30;

export default class LevelSelectScene extends Phaser.Scene {
  constructor() { super('LevelSelectScene'); }

  create() {
    const { width } = this.scale;

    this.add.text(width / 2, 70, 'Elige un nivel', { fontSize: '56px', color: '#ffffff' })
      .setOrigin(0.5);
    this.add.text(width / 2, 125, `★ ${SaveManager.totalStars()} / ${LEVELS.length * 3}`, {
      fontSize: '28px', color: '#ffd166'
    }).setOrigin(0.5);

    // Centra la cuadrícula horizontalmente
    const gridW = COLUMNS * CARD_W + (COLUMNS - 1) * GAP;
    const startX = (width - gridW) / 2 + CARD_W / 2;
    const startY = 260;

    LEVELS.forEach((lvl, i) => {
      const col = i % COLUMNS;
      const row = Math.floor(i / COLUMNS);
      const x = startX + col * (CARD_W + GAP);
      const y = startY + row * (CARD_H + GAP);
      this.createCard(x, y, i, lvl);
    });

    this.button(80, 670, '← Menú', () => this.scene.start('MenuScene'));
    this.button(1150, 670, 'Borrar progreso', () => {
      if (window.confirm('¿Seguro que quieres borrar todo tu progreso?')) {
        SaveManager.reset();
        this.scene.restart();
      }
    }, '20px');
  }

  createCard(x, y, index, lvl) {
    const unlocked = SaveManager.isUnlocked(index);
    const stars = SaveManager.getStars(index);

    const bg = this.add.rectangle(x, y, CARD_W, CARD_H, unlocked ? 0x3d405b : 0x22232f)
      .setStrokeStyle(4, unlocked ? 0xffd166 : 0x555555);

    if (unlocked) {
      this.add.text(x, y - 55, `Nivel ${index + 1}`, { fontSize: '30px', color: '#ffffff' })
        .setOrigin(0.5);
      this.add.text(x, y - 18, lvl.name, { fontSize: '20px', color: '#cccccc' })
        .setOrigin(0.5);
      this.add.text(x, y + 30, '★'.repeat(stars) + '☆'.repeat(3 - stars), {
        fontSize: '44px', color: '#ffd166'
      }).setOrigin(0.5);
      this.add.text(x, y + 68, `${lvl.customers} clientes`, { fontSize: '16px', color: '#aaaaaa' })
        .setOrigin(0.5);

      bg.setInteractive({ useHandCursor: true })
        .on('pointerover', () => bg.setFillStyle(0x4f5373))
        .on('pointerout', () => bg.setFillStyle(0x3d405b))
        .on('pointerdown', () => this.scene.start('GameScene', { level: index }));
    } else {
      this.add.text(x, y - 15, '🔒', { fontSize: '56px' }).setOrigin(0.5);
      this.add.text(x, y + 45, `Nivel ${index + 1}`, { fontSize: '22px', color: '#777777' })
        .setOrigin(0.5);
    }
  }

  button(x, y, label, onClick, size = '26px') {
    this.add.text(x, y, label, {
      fontSize: size, color: '#ffffff', backgroundColor: '#555', padding: { x: 14, y: 8 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }).on('pointerdown', onClick);
  }
}