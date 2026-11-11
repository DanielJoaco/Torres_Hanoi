const KEY = 'burger-hanoi-save';

function load() {
  try {
    const data = JSON.parse(localStorage.getItem(KEY));
    return data && Array.isArray(data.stars) ? data : { stars: [] };
  } catch {
    return { stars: [] };
  }
}

function save(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // localStorage puede estar bloqueado (modo privado); el juego sigue funcionando
  }
}

export const SaveManager = {
  getStars(level) {
    return load().stars[level] ?? 0;
  },

  // Guarda solo si mejora el récord. Devuelve true si fue récord nuevo.
  setStars(level, stars) {
    const data = load();
    const prev = data.stars[level] ?? 0;
    if (stars <= prev) return false;
    data.stars[level] = stars;
    save(data);
    return true;
  },

  // El nivel 0 siempre está abierto; los demás requieren ≥1 estrella en el anterior
  isUnlocked(level) {
    return level === 0 || this.getStars(level - 1) > 0;
  },

  totalStars() {
    return load().stars.reduce((a, b) => a + (b || 0), 0);
  },

  reset() {
    save({ stars: [] });
  }
};