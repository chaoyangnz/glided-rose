const MIN_QUALITY = 0;
const MAX_QUALITY = 50;
// Odd items
const AgedBrie = 'Aged Brie';
const Backstage = 'Backstage passes to a TAFKAL80ETC concert';
const Sulfuras = 'Sulfuras, Hand of Ragnaros';
const Conjured = 'Conjured Mana Cake';

export class Item {
  name: string;
  sellIn: number;
  quality: number;

  constructor(name, sellIn, quality) {
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
  }

  shouldDegrade(): boolean {
    return !this.shouldIncrease() && !this.shouldNeverUpdate();
  }

  shouldIncrease(): boolean {
    return [AgedBrie, Backstage].includes(this.name);
  }

  shouldNeverUpdate(): boolean {
    return this.name === Sulfuras;
  }

  isDatePassed(): boolean {
    return this.sellIn < 0;
  }

  daysOrLessRemaining(n: number): boolean {
    return this.sellIn <= n;
  }

  degrade() {
    if (this.quality > MIN_QUALITY) {
      this.quality -= 1;
    }
  }

  increase() {
    if (this.quality < MAX_QUALITY) {
      this.quality += 1;
    }
  }
}

export class GildedRose {
  items: Array<Item> = [];

  constructor() {}

  updateItem(item) {
    this.updateQualityWhenDegrade(item);
    this.updateQualityWhenIncrease(item);
    this.updateDate(item);
  }

  private updateQualityWhenDegrade(item) {
    if (!item.shouldDegrade()) return;
    item.degrade();
    if (item.name === Conjured) {
      item.degrade();
    }
  }

  private updateQualityWhenIncrease(item) {
    if (!item.shouldIncrease()) return;
    item.increase();
    if (item.name === Backstage) {
      if (item.daysOrLessRemaining(10)) {
        item.increase();
      }
      if (item.daysOrLessRemaining(5)) {
        item.increase();
      }
    }
  }

  private updateDate(item) {
    if (item.shouldNeverUpdate()) return;
    item.sellIn -= 1;
    this.handleDatePassed(item);
  }

  private handleDatePassed(item) {
    if (!item.isDatePassed()) return;
    switch (item.name) {
      case Backstage:
        item.quality = 0; break;
      case AgedBrie:
        item.increase(); break;
      default:
        item.degrade(); break;
    }
  }

  updateQuality() {
    this.items.forEach((item) => this.updateItem(item));
    return this.items;
  }
}
