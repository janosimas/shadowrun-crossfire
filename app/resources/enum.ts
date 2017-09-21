
export class RaceData {
    public name: string;
    public hit_points: number;
    public cards: number;
    public nuyen: number;
};

export namespace Race {
    export let human: RaceData = {name:'Human', hit_points: 5, cards: 4, nuyen: 3 } ;
    export let elf: RaceData = { name: "Elf", hit_points: 4, cards: 4, nuyen: 4 };
    export let dwarf: RaceData = { name: "Dwarf", hit_points: 5, cards: 2, nuyen: 5 };
    export let ork: RaceData = { name: "Ork", hit_points: 6, cards: 5, nuyen: 1 };
    export let troll: RaceData = { name: "Troll", hit_points: 7, cards: 3, nuyen: 2 };
    export let raceList = [human.name, elf.name, dwarf.name, ork.name, troll.name];
}

export namespace Class {
    export let face = "Face";
    export let decker = "Decker";
    export let mage = "Mage";
    export let samurai = "Street Samurai";
    export let classList = [face, decker, mage, samurai];
}

export namespace TAG {
    export let SHADOWRUN_DB: string = 'shadowrunDb';
    export let SHADOWRUN_DB_FILE: string = 'ShadowrunCrossfire.db';
    export let PARTY_LIST: string = 'party_list';
    export let PLAYER_LIST: string = 'player_list';
}