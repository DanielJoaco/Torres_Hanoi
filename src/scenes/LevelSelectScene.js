import Phaser from 'phaser';
import LEVELS from '../data/levels.json';
import { SaveManager } from '../logic/SaveManager.js';

const COLUMNS = 4;
const CARD_W = 200;
const CARD_H = 150;
const GAP = 40;

export default class LevelSelectScene extends Phaser.Scene {
  constructor() { super('LevelSelectScene'); }

  create() {
    const { width } = this.scale;

    this.add.text(width / 2, 90, 'Niveles', { fontSize: '56px', color: '#ffffff', fontStyle: 'bold' })
      .setOrigin(0.5);

    const gridW = COLUMNS * CARD_W + (COLUMNS - 1) * GAP;
    const startX = (width - gridW) / 2 + CARD_W / 2;
    const startY = 250;

    LEVELS.forEach((lvl, i) => {
      const x = startX + (i % COLUMNS) * (CARD_W + GAP);
      const y = startY + Math.floor(i / COLUMNS) * (CARD_H + GAP);
      this.createCard(x, y, i);
    });

    // Volver
    this.add.text(30, 30, '← Menú', { fontSize: '24px', color: '#cccccc' })
      .setInteractive({ useHandCursor: true })
      .on('pointerover', function () { this.setColor('#ffffff'); })
      .on('pointerout', function () { this.setColor('#cccccc'); })
      .on('pointerdown', () => this.scene.start('MenuScene'));
  }

  createCard(x, y, index) {
    const unlocked = SaveManager.isUnlocked(index);
    const stars = SaveManager.getStars(index);

    const bg = this.add.rectangle(x, y, CARD_W, CARD_H, unlocked ? 0x3d405b : 0x2a2b3a)
      .setStrokeStyle(3, unlocked ? 0xffd166 : 0x444455);

    if (!unlocked) {
      this.add.text(x, y, '🔒', { fontSize: '48px' }).setOrigin(0.5).setAlpha(0.6);
      return;
    }

    this.add.text(x, y - 25, `${index + 1}`, {
      fontSize: '64px', color: '#ffffff', fontStyle: 'bold'
    }).setOrigin(0.5);
    this.add.text(x, y + 40, '★'.repeat(stars) + '☆'.repeat(3 - stars), {
      fontSize: '32px', color: '#ffd166'
    }).setOrigin(0.5);

    bg.setInteractive({ useHandCursor: true })
      .on('pointerover', () => bg.setFillStyle(0x4f5373))
      .on('pointerout', () => bg.setFillStyle(0x3d405b))
      .on('pointerdown', () => this.scene.start('GameScene', { level: index }));
  }
}