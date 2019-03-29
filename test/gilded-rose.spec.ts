import { Item, GildedRose } from '../app/gilded-rose';
import { cloneDeep } from 'lodash';

const NORMAL_DEGRADE = 1;
const TWICE_DEGRADE = 2;
const THREE_TIMES_DEGRADE = 3;

describe('Gilded Rose', function() {
  const gildedRose: GildedRose = new GildedRose();

  beforeEach(() => {
    gildedRose.items = [];
  });

  function daysPassed(n): Item[] {
    const previous = cloneDeep(gildedRose.items);
    for (let i = 0; i < n; ++i) {
      gildedRose.updateQuality();
    }
    return previous;
  }

  it('should never update name', function() {
    gildedRose.items = [new Item('foo', 9, 6)];
    const previous = daysPassed(1);
    gildedRose.items.forEach((item, index) => {
      expect(item.name).toEqual(previous[index].name);
      expect(item.sellIn).toEqual(previous[index].sellIn - NORMAL_DEGRADE);
    });
  });

  it('should be never more than 50', () => {
    gildedRose.items = [new Item('Aged Brie', 1, 50)]; // Aged Brie will increase;
    daysPassed(10);
    gildedRose.items.forEach(item => {
      expect(item.quality).toBeLessThanOrEqual(50);
    });
  });

  it('should be never negative', () => {
    gildedRose.items = [new Item('foo', 0, 1)];
    daysPassed(10);
    gildedRose.items.forEach(item => {
      expect(item.quality).toBeGreaterThanOrEqual(0);
    });
  });

  it('should degrade twice once the date has passed', () => {
    gildedRose.items = [new Item('foo', 10, 16)];
    const previous =  daysPassed(10 + 1); // 1 days passed
    gildedRose.items.forEach((item, index) => {
      expect(item.sellIn).toEqual(
        previous[index].sellIn - 10 * NORMAL_DEGRADE - 1 * NORMAL_DEGRADE
      );
      expect(item.quality).toEqual(
        previous[index].quality - 10 * NORMAL_DEGRADE - 1 * TWICE_DEGRADE
      );
    });
  });

  it('should never update Quality and sellIn for Sulfuras', () => {
    gildedRose.items = [new Item('Sulfuras, Hand of Ragnaros', 9, 6)];
    const previous = daysPassed(1);
    gildedRose.items.forEach((item, index) => {
      expect(item.sellIn).toEqual(previous[index].sellIn);
      expect(item.quality).toEqual(previous[index].quality);
    });
  });

  it('should increase in Quality the older it gets for Aged Brie', () => {
    gildedRose.items = [new Item('Aged Brie', 9, 6)];
    const previous = daysPassed(1);
    gildedRose.items.forEach((item, index) => {
      expect(item.quality).toBeGreaterThan(previous[index].quality);
    });
  });

  it('should increase in quality for Aged Brie', () => {
    gildedRose.items = [new Item('Aged Brie', 1, 6)];
    const previous =  daysPassed(1);
    gildedRose.items.forEach((item, index) => {
      expect(item.quality).toBeGreaterThan(previous[index].quality);
    });
  });

  it('should increase in Quality as its SellIn value approaches for Backstage passes', () => {
    gildedRose.items = [
      new Item('Backstage passes to a TAFKAL80ETC concert', 15, 10),
    ];
    // 15 days left
    let previous = daysPassed(5);
    gildedRose.items.forEach((item, index) => {
      expect(item.quality).toEqual(
        previous[index].quality + 5 * NORMAL_DEGRADE
      );
    });
    // 10 days left
    previous = daysPassed(1);
    gildedRose.items.forEach((item, index) => {
      expect(item.quality).toEqual(
        previous[index].quality + 1 * TWICE_DEGRADE
      );
    });
    // 9 days left
    previous = daysPassed(4);
    gildedRose.items.forEach((item, index) => {
      expect(item.quality).toEqual(
          previous[index].quality +
          4 * TWICE_DEGRADE
      );
    });
    // 5 days left
    previous = daysPassed(1);
    gildedRose.items.forEach((item, index) => {
      expect(item.quality).toEqual(
        previous[index].quality +
          1 * THREE_TIMES_DEGRADE
      );
    });
    // 4 days left
    previous = daysPassed(1);
    gildedRose.items.forEach((item, index) => {
      expect(item.quality).toEqual(
        previous[index].quality +
          1 * THREE_TIMES_DEGRADE
      );
    });
    // 3 day left
    previous = daysPassed(3);
    gildedRose.items.forEach((item, index) => {
      expect(item.quality).toEqual(
          previous[index].quality +
          3 * THREE_TIMES_DEGRADE);
    });
    // 0 days left
    previous = daysPassed(1);
    gildedRose.items.forEach((item) => {
      expect(item.quality).toEqual(0);
    });
    // 1 days passed
    previous = daysPassed(1);
    gildedRose.items.forEach((item) => {
      expect(item.quality).toEqual(0);
    });
    // 2 days passed
  });

  it('should degrade in Quality twice as fast as normal items for Conjured Mana Cake', () => {
    gildedRose.items = [new Item('Conjured Mana Cake', 10, 15)];
    const previous = daysPassed(1);
    gildedRose.items.forEach((item, index) => {
      expect(item.quality).toBeLessThanOrEqual(previous[index].quality - 1 * TWICE_DEGRADE);
    });
  });
});
