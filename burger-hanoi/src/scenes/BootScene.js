import Phaser from 'phaser';
import { generateTextures } from '../objects/TextureFactory.js';

export default class BootScene extends Phaser.Scene {
  constructor() { super('BootScene'); }

  preload() {
    // Aquí cargarás arte real más adelante
  }

  create() {
  generateTextures(this);
  document.fonts.load('24px Fredoka').finally(() => this.scene.start('MenuScene'));
}
}