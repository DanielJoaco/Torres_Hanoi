import Phaser from 'phaser';
import { ING_HEIGHT } from './Constants.js';

export { COLORS, ING_HEIGHT } from './Constants.js';  // compatibilidad con imports existentes

export default class IngredientView extends Phaser.GameObjects.Container {
  constructor(scene, x, y, ingredient) {
    super(scene, x, y);
    this.ingredient = ingredient;

    const w = 100 + ingredient.level * 35;
    const img = scene.add.image(0, 0, `ing_${ingredient.type}`)
      .setDisplaySize(w, ING_HEIGHT - 4);
    const label = scene.add.text(0, 0, ingredient.type, {
      fontSize: '16px', color: '#ffffff', fontStyle: 'bold',
      stroke: '#000000', strokeThickness: 3
    }).setOrigin(0.5);

    this.add([img, label]);
    this.setSize(w, ING_HEIGHT - 4);
    this.setInteractive({ useHandCursor: true });
    scene.input.setDraggable(this);
    scene.add.existing(this);
  }
}