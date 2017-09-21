
import { Class, Race } from "./enum";

export class Feat {
    constructor() {
    }

    public name: string = '';
    public description: string = '';
    public cost: number = 0;
}

export class Player {
    constructor() { 
    }

    public name: string = '';
    public race: string = Race.human.name;
    public class: string = Class.face;
    public xp: number = 0;
    public feats: Array<Feat> = new Array<Feat>();
}

export class Party {
    constructor() {
    }

    public name: string = '';
    public playersId: Array<number> = new Array<number>();
}