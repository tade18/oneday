import { CONFIG } from './config.js';

export class ResourceManager {
  constructor() {
    this.resources = { ...CONFIG.STARTING_RESOURCES };
  }

  get(key) {
    return this.resources[key] ?? 0;
  }

  getAll() {
    return { ...this.resources };
  }

  canAfford(cost) {
    if (!cost) return true;

    for (const [key, amount] of Object.entries(cost)) {
      if (this.get(key) < amount) return false;
    }
    return true;
  }

  spend(cost) {
    if (!this.canAfford(cost)) return false;

    for (const [key, amount] of Object.entries(cost)) {
      this.resources[key] -= amount;
    }
    return true;
  }

  add(key, amount) {
    if (this.resources[key] !== undefined) {
      this.resources[key] += amount;
    }
  }

  // Apply a delta object and return what actually changed
  // Example delta: { energy: 5, material: -1, organics: -2 }
  applyDelta(delta) {
    const changes = {};

    for (const [key, amount] of Object.entries(delta)) {
      if (!amount || this.resources[key] === undefined) continue;

      const before = this.resources[key];
      this.resources[key] = Math.max(0, before + amount); // prevent negative
      const realChange = this.resources[key] - before;

      if (realChange !== 0) {
        changes[key] = realChange;
      }
    }

    return changes;
  }
}