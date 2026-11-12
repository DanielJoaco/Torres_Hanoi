import Phaser from 'phaser';
import { SaveManager } from '../logic/SaveManager.js';

export default class MenuScene extends Phaser.Scene {
  constructor() { super('MenuScene'); }

  create() {
    const { width, height } = this.scale;

    const title = this.add.text(width / 2, height * 0.34, 'Burger Hanoi', {
      fontSize: '88px', color: '#ffffff', fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(width / 2, height * 0.34 + 70, 'Arma la hamburguesa perfecta', {
      fontSize: '28px', color: '#ffd166'
    }).setOrigin(0.5);

    // Botón principal
    const play = this.add.text(width / 2, height * 0.62, 'JUGAR', {
      fontSize: '44px', color: '#2b2d42', fontStyle: 'bold',
      backgroundColor: '#ffd166', padding: { x: 60, y: 16 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    play.on('pointerover', () => this.tweens.add({ targets: play, scale: 1.06, duration: 100 }));
    play.on('pointerout', () => this.tweens.add({ targets: play, scale: 1, duration: 100 }));
    play.on('pointerdown', () => this.scene.start('LevelSelectScene'));

    // Latido suave del título
    this.tweens.add({
      targets: title, scale: 1.03, duration: 1400, yoyo: true, repeat: -1, ease: 'Sine.InOut'
    });

    // Enlace discreto (esquina inferior)
    const reset = this.add.text(width / 2, height - 40, 'Borrar progreso', {
      fontSize: '18px', color: '#8d99ae'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    reset.on('pointerover', () => reset.setColor('#ffffff'));
    reset.on('pointerout', () => reset.setColor('#8d99ae'));
    reset.on('pointerdown', () => {
      if (window.confirm('¿Seguro que quieres borrar todo tu progreso?')) {
        SaveManager.reset();
        reset.setText('Progreso borrado').disableInteractive();
      }
    });
  }
}