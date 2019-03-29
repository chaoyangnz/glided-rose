import { Item, GildedRose } from '../app/gilded-rose';
import { cloneDeep } from 'lodash';

const NORMAL_DEGRADE = 1;
const TWICE_DEGRADE = 2;
const THREE_TIMES_DEGRADE = 3;

describe('Gilded Rose', function () {
    const gildedRose = new GildedRose();

    beforeEach(() => {
        gildedRose.items = [];
    })

    function daysPassed(n) {
        for(let i = 0; i < n; ++i) {
            gildedRose.updateQuality();
        }
    }

    it('should never update name', function() {
        const origin = [ new Item('foo', 9, 6) ];
        gildedRose.items = cloneDeep(origin);
        daysPassed(1);
        gildedRose.items.forEach((item, index) => {
            expect(item.name).toEqual(origin[index].name);
            expect(item.sellIn).toEqual(origin[index].sellIn - NORMAL_DEGRADE);
        })
    });

    it('should be never more than 50', () => {
        const origin =  [ new Item('Aged Brie', 1, 50) ]; // Aged Brie will increase
        gildedRose.items = cloneDeep(origin);
        daysPassed(10);
        gildedRose.items.forEach((item) => {
            expect(item.quality).toBeLessThanOrEqual(50);
        });
    })

    it('should fail when quality is negative', () => {
        const origin = [ new Item('foo', 0, 1) ]
        gildedRose.items = cloneDeep(origin);
        daysPassed(10);
        gildedRose.items.forEach((item) => {
            expect(item.quality).toBeGreaterThanOrEqual(0);
        });
    })

    it('should degrade twice once the date has passed', () => {
        const origin = [ new Item('foo', 10, 16) ];
        gildedRose.items = cloneDeep(origin);
        daysPassed(10 + 1); // 1 days passed
        gildedRose.items.forEach((item, index) => {
            expect(item.sellIn).toEqual((origin[index].sellIn - 10 * NORMAL_DEGRADE) - 1 * NORMAL_DEGRADE)
            expect(item.quality).toEqual((origin[index].quality - 10 * NORMAL_DEGRADE)  - 1 * TWICE_DEGRADE);
        });
    })

    it('should never update Quality and sellIn for Sulfuras', () => {
        const origin = [
            new Item('Sulfuras, Hand of Ragnaros', 9, 6)
        ]
        gildedRose.items = cloneDeep(origin);
        daysPassed(1);
        gildedRose.items.forEach((item, index) => {
            expect(item.sellIn).toEqual(origin[index].sellIn);
            expect(item.quality).toEqual(origin[index].quality);
        })
    })

    it('should increase in Quality the older it gets for Aged Brie', () => {
        const origin = [
            new Item('Aged Brie', 9, 6)
        ]
        gildedRose.items = cloneDeep(origin);
        daysPassed(1);
        gildedRose.items.forEach((item, index) => {
            expect(item.quality).toBeGreaterThan(origin[index].quality);
        })
    })

    it('should increase in quality for Aged Brie', () => {
        const origin = [ new Item('Aged Brie', 1, 6) ];
        gildedRose.items = cloneDeep(origin);
        daysPassed(1)
        gildedRose.items.forEach((item, index) => {
            expect(item.quality).toBeGreaterThan(origin[index].quality);
        });
    })

    it('should increase in Quality as its SellIn value approaches for Backstage passes', () => {
        const origin = [ new Item('Backstage passes to a TAFKAL80ETC concert', 15, 10) ];
        gildedRose.items = cloneDeep(origin);
        daysPassed(5); // 11 days left
        gildedRose.items.forEach((item, index) => {
            expect(item.quality).toEqual(origin[index].quality + 5 * NORMAL_DEGRADE);
        });
        daysPassed(1); // 10 days left
        gildedRose.items.forEach((item, index) => {
            expect(item.quality).toEqual(origin[index].quality + 5 * NORMAL_DEGRADE + 1 * TWICE_DEGRADE);
        });
        daysPassed(5); // 5 days left
        gildedRose.items.forEach((item, index) => {
            expect(item.quality).toEqual(origin[index].quality + 5 * NORMAL_DEGRADE + 5 * TWICE_DEGRADE + 1 * THREE_TIMES_DEGRADE);
        });
        daysPassed(1); // 4 days left
        gildedRose.items.forEach((item, index) => {
            expect(item.quality).toEqual(origin[index].quality + 5 * NORMAL_DEGRADE + 5 * TWICE_DEGRADE + 2 * THREE_TIMES_DEGRADE);
        });
        daysPassed(4); // 0 days left
        gildedRose.items.forEach((item, index) => {
            expect(item.quality).toEqual(0);
        });
        daysPassed(1); // 1 days passed
        gildedRose.items.forEach((item, index) => {
            expect(item.quality).toEqual(0);
        });
    })

    // it('should degrade in Quality twice as fast as normal items for Conjured Mana Cake', () => {
    //     const origin =  [ new Item('Conjured Mana Cake', 10, 15) ];
    //     gildedRose.items = cloneDeep(origin);
    //     daysPassed(1);
    //     gildedRose.items.forEach((item) => {
    //         expect(item.quality).toBeLessThanOrEqual(15 - 1 * TWICE_DEGRADE);
    //     });
    // })
});
