export class Item {
  name: string;
  sellIn: number;
  quality: number;

  constructor(name, sellIn, quality) {
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
  }

  shouldDegrade() {
    return !this.shouldIncrease() && !this.shouldNeverSold();
  }

  shouldIncrease() {
    return this.name == OddItems.AgedBrie || this.name == OddItems.Backstage;
  }

  shouldNeverSold() {
    return this.name == OddItems.Sulfuras;
  }

  isDatePassed() {
    return this.sellIn < 0;
  }

  daysOrLessRemaining(n: number) {
    return this.sellIn < n + 1;
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

const MIN_QUALITY = 0;
const MAX_QUALITY = 50;
const enum OddItems {
  AgedBrie = 'Aged Brie',
  Backstage = 'Backstage passes to a TAFKAL80ETC concert',
  Sulfuras = 'Sulfuras, Hand of Ragnaros',
  Conjured = 'Conjured Mana Cake',
}

export class GildedRose {
  items: Array<Item> = [];

  constructor() {}

  updateItemQuality(item) {
    this.updateQualityWhenDegrade(item);
    this.updateQualityWhenIncrease(item);
    this.updateDate(item);
    this.handleDatePassed(item);
  }

  private updateQualityWhenDegrade(item) {
    if (!item.shouldDegrade()) return;
    item.degrade();
    if (item.name == OddItems.Conjured) {
      item.degrade();
    }
  }

  private updateQualityWhenIncrease(item) {
    if (!item.shouldIncrease()) return;
    item.increase();
    if (item.name == OddItems.Backstage) {
      if (item.daysOrLessRemaining(10)) {
        item.increase();
      }
      if (item.daysOrLessRemaining(5)) {
        item.increase();
      }
    }
  }

  private updateDate(item) {
    if (item.shouldNeverSold()) return;
    item.sellIn -= 1;
  }

  private handleDatePassed(item) {
    if (!item.isDatePassed()) return;
    switch (item.name) {
      case OddItems.Backstage:
        item.quality = 0;
        break;
      case OddItems.AgedBrie:
        item.increase();
        break;
      default:
        item.degrade();
        break;
    }
  }

  updateQuality() {
    for (let i = 0; i < this.items.length; i++) {
      this.updateItemQuality(this.items[i]);
    }

    return this.items;
  }
}
