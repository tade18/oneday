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
      if (this.get(key) < amount) {
        return false;
      }
    }
    return true;
  }

  spend(cost) {
    if (!this.canAfford(cost)) {
      return false;
    }

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
}