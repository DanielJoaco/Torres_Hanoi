import Phaser from 'phaser';
import LEVELS from '../data/levels.json';
import { calcStars } from '../logic/Scoring.js';
import { SaveManager } from '../logic/SaveManager.js';

export default class ResultScene extends Phaser.Scene {
  constructor() { super('ResultScene'); }

  init(data) {
    this.level = data.level ?? 0;
    this.score = data.score ?? 0;
    this.served = data.served ?? 0;
    this.total = data.total ?? 1;
  }

  create() {
    const stars = calcStars(this.score, this.total, this.served);
    const isRecord = SaveManager.setStars(this.level, stars);
    const hasNext = this.level + 1 < LEVELS.length;

    this.add.text(640, 130, `Nivel ${this.level + 1}: ${LEVELS[this.level].name}`, {
      fontSize: '48px', color: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(640, 230, '★'.repeat(stars) + '☆'.repeat(3 - stars), {
      fontSize: '80px', color: '#ffd166'
    }).setOrigin(0.5);

    this.add.text(640, 320, `Puntos: ${this.score}`, { fontSize: '32px', color: '#ffffff' })
      .setOrigin(0.5);
    this.add.text(640, 363, `Clientes satisfechos: ${this.served}/${this.total}`, {
      fontSize: '26px', color: '#cccccc'
    }).setOrigin(0.5);

    if (isRecord) {
      this.add.text(640, 405, '¡Nuevo récord!', { fontSize: '26px', color: '#6abe30' })
        .setOrigin(0.5);
    }
    if (stars === 0) {
      this.add.text(640, 440, 'Necesitas al menos 1 estrella para avanzar', {
        fontSize: '22px', color: '#ff6b6b'
      }).setOrigin(0.5);
    } else if (hasNext && SaveManager.isUnlocked(this.level + 1) && this.level + 1 < LEVELS.length
               && SaveManager.getStars(this.level + 1) === 0) {
      this.add.text(640, 440, `¡Nivel ${this.level + 2} desbloqueado!`, {
        fontSize: '22px', color: '#ffd166'
      }).setOrigin(0.5);
    }

    let y = 510;
    if (stars > 0 && hasNext) {
      this.button(y, 'Siguiente nivel', () => this.scene.start('GameScene', { level: this.level + 1 }));
      y += 65;
    }
    this.button(y, 'Reintentar', () => this.scene.start('GameScene', { level: this.level }));
    this.button(y + 65, 'Niveles', () => this.scene.start('LevelSelectScene'));
  }

  button(y, label, onClick) {
    this.add.text(640, y, label, {
      fontSize: '30px', color: '#ffffff', backgroundColor: '#333', padding: { x: 20, y: 6 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }).on('pointerdown', onClick);
  }
}