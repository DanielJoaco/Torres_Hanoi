import Phaser from 'phaser';
import { COLORS, ING_HEIGHT } from './Constants.js';
import { INGREDIENTS } from '../logic/Ingredients.js';

const H = ING_HEIGHT - 4; // 36 px de alto

const shade = (c, n) => Phaser.Display.Color.IntegerToColor(c).darken(n).color;
const tint = (c, n) => Phaser.Display.Color.IntegerToColor(c).lighten(n).color;

// Detalles propios de cada ingrediente
const decorate = {
  lechuga(g, w, h) {
    g.fillStyle(0x8fd14f);
    for (let x = 10; x < w - 6; x += 16) { g.fillCircle(x, 7, 6); g.fillCircle(x + 8, h - 9, 6); }
  },
  tomate(g, w, h) {
    g.fillStyle(0xffd6a5);
    for (let x = w * 0.2; x < w * 0.85; x += w * 0.15) g.fillEllipse(x, h / 2, 9, 5);
  },
  cebolla(g, w, h) {
    g.lineStyle(2, 0xb39ddb, 0.9).strokeRoundedRect(14, 9, w - 28, h - 22, 8);
  },
  carne(g, w, h) {
    g.lineStyle(3, 0x2e1814, 0.55);
    for (let x = 20; x < w - 24; x += 22) g.lineBetween(x, 8, x + 10, h - 10);
  },
  pollo(g, w, h) {
    g.fillStyle(0xc99a4b);
    for (let x = 16, i = 0; x < w - 10; x += 14, i++) g.fillCircle(x, 11 + (i % 2) * 10, 3);
  },
  queso(g, w, h) {
    g.fillStyle(0xd9b800);
    [[0.25, 11, 4], [0.5, 20, 5], [0.72, 12, 3]].forEach(([fx, y, r]) => g.fillCircle(w * fx, y, r));
  },
  ketchup: sauce, mostaza: sauce, mayonesa: sauce
};

function sauce(g, w, h) {
  g.lineStyle(4, 0xffffff, 0.45);
  for (let x = 14; x < w - 24; x += 14) g.lineBetween(x, 11, x + 7, h - 14);
}

function drawIngredient(g, type, w) {
  const color = COLORS[type];
  const r = type === 'pan' ? { tl: 6, tr: 6, bl: 16, br: 16 } : 12;

  g.fillStyle(color).fillRoundedRect(2, 2, w - 4, H - 4, r);                    // cuerpo
  g.fillStyle(shade(color, 20))
    .fillRoundedRect(2, H - 14, w - 4, 12, { tl: 0, tr: 0, bl: 12, br: 12 });  // sombra inferior
  g.fillStyle(tint(color, 25), 0.7).fillRoundedRect(10, 5, w - 20, 5, 3);       // brillo
  decorate[type]?.(g, w, H);
  g.lineStyle(3, 0x000000, 0.55).strokeRoundedRect(2, 2, w - 4, H - 4, r);      // contorno
}

function drawTopBun(g, w, h) {
  g.fillStyle(0xd9a066).fillRoundedRect(2, 2, w - 4, h - 4, { tl: 50, tr: 50, bl: 8, br: 8 });
  g.fillStyle(0xb9814a).fillRoundedRect(2, h - 12, w - 4, 10, { tl: 0, tr: 0, bl: 8, br: 8 });
  g.fillStyle(0xfff1d0);
  [[0.3, 14], [0.42, 22], [0.55, 12], [0.66, 22], [0.78, 14], [0.5, 30]].forEach(([fx, y]) =>
    g.fillEllipse(w * fx, y, 10, 6));
  g.lineStyle(3, 0x000000, 0.55)
    .strokeRoundedRect(2, 2, w - 4, h - 4, { tl: 50, tr: 50, bl: 8, br: 8 });
}

export function generateTextures(scene) {
  const g = scene.make.graphics({ x: 0, y: 0, add: false });

  Object.keys(INGREDIENTS).forEach(type => {
    const key = `ing_${type}`;
    if (scene.textures.exists(key)) return;       // si cargaste arte real, no lo pisa
    const w = 100 + INGREDIENTS[type].level * 35;
    drawIngredient(g, type, w);
    g.generateTexture(key, w, H);
    g.clear();
  });

  if (!scene.textures.exists('bun_top')) {
    drawTopBun(g, 240, 52);
    g.generateTexture('bun_top', 240, 52);
    g.clear();
  }

  g.destroy();
}