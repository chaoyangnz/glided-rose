export class Item {
    name: string;
    sellIn: number;
    quality: number;

    constructor(name, sellIn, quality) {
        this.name = name;
        this.sellIn = sellIn;
        this.quality = quality;
    }
}

enum DEGRADE {
    NORMAL = 1,
    TWICE = 2,
}

const MAX_QUALITY = 50;
const enum OddItem {
    AgedBrie = 'Aged Brie',
    Backstage = 'Backstage passes to a TAFKAL80ETC concert',
    Sulfuras = 'Sulfuras, Hand of Ragnaros',
    Conjured = ' Conjured Mana Cake'
}

function daysOrLessRemaining(n: number, item: Item) {
    return item.sellIn < n + 1;
}

function degrade(rate: DEGRADE, item: Item) {
    item.quality = item.quality - rate;
}

function increase(rate: DEGRADE, item: Item) {
    item.quality = item.quality + rate;
}

export class GildedRose {
    items: Array<Item> = [];

    constructor() {}
    
    updateItemQuality(item) {
        if (item.name != OddItem.AgedBrie && item.name != OddItem.Backstage) {
            if (item.quality > 0) {
                if (item.name != OddItem.Sulfuras) {
                    degrade(DEGRADE.NORMAL, item);
                }
            }
        } else {
            if (item.quality < MAX_QUALITY) {
                increase(DEGRADE.NORMAL, item)
                if (item.name == OddItem.Backstage) {
                    if (daysOrLessRemaining(10, item)) {
                        if (item.quality < MAX_QUALITY) {
                            increase(DEGRADE.NORMAL, item)
                        }
                    }
                    if (daysOrLessRemaining(5, item)) {
                        if (item.quality < MAX_QUALITY) {
                            increase(DEGRADE.NORMAL, item)
                        }
                    }
                }
            }
        }
        if (item.name != OddItem.Sulfuras) {
            item.sellIn = item.sellIn - 1;
        }
        if (item.sellIn < 0) {
            if (item.name != OddItem.AgedBrie) {
                if (item.name != OddItem.Backstage) {
                    if (item.quality > 0) {
                        if (item.name != OddItem.Sulfuras) {
                            degrade(DEGRADE.NORMAL, item)
                        }
                    }
                } else {
                    item.quality = 0
                }
            } else {
                if (item.quality < MAX_QUALITY) {
                    increase(DEGRADE.NORMAL, item)
                }
            }
        }
    }

    updateQuality() {
        for (let i = 0; i < this.items.length; i++) {
            this.updateItemQuality(this.items[i]);
        }

        return this.items;
    }
}
