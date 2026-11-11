import Phaser from 'phaser';

export default class MenuScene extends Phaser.Scene {
  constructor() { super('MenuScene'); }

  create() {
    const { width, height } = this.scale;

    this.add.text(width / 2, height / 3, 'Burger Hanoi', {
      fontSize: '64px', color: '#ffffff'
    }).setOrigin(0.5);

    const playBtn = this.add.text(width / 2, height / 2, 'JUGAR', {
      fontSize: '40px', color: '#ffd166', backgroundColor: '#333', padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    playBtn.on('pointerdown', () => this.scene.start('LevelSelectScene'));
  }
}