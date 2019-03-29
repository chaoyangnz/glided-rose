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

export class GildedRose {
    items: Array<Item> = [];

    constructor() {}
    
    updateItemQuality(item) {
        if (item.name != OddItem.AgedBrie && item.name != OddItem.Backstage) {
            if (item.quality > 0) {
                if (item.name != 'Sulfuras, Hand of Ragnaros') {
                    item.quality = item.quality - DEGRADE.NORMAL
                }
            }
        } else {
            if (item.quality < MAX_QUALITY) {
                item.quality = item.quality + 1
                if (item.name == OddItem.Backstage) {
                    if (item.sellIn < 11) {
                        if (item.quality < MAX_QUALITY) {
                            item.quality = item.quality + DEGRADE.NORMAL
                        }

                    }
                    if (item.sellIn < 6) {
                        if (item.quality < MAX_QUALITY) {
                            item.quality = item.quality + DEGRADE.NORMAL
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
                            item.quality = item.quality - DEGRADE.NORMAL
                        }
                    }
                } else {
                    item.quality = item.quality - item.quality
                }
            } else {
                if (item.quality < MAX_QUALITY) {
                    item.quality = item.quality + DEGRADE.NORMAL
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
