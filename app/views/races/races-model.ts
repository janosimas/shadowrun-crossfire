import { Observable } from 'data/observable';
import * as frameModule from "ui/frame";
import * as dialogsModule from "ui/dialogs";
import { Race } from "../../resources/enum";

class RaceData {
    public life: number;
    public cards: number;
    public money: number;
};

export class RacesModule extends Observable {
    readonly start_values: Map<string, RaceData> = new Map<string, RaceData>([
        [Race.human, { life: 5, cards: 4, money: 3 }],
        [Race.elf, { life: 4, cards: 4, money: 4 }],
        [Race.dwarf, { life: 5, cards: 2, money: 5 }],
        [Race.ork, { life: 6, cards: 5, money: 1 }],
        [Race.troll, { life: 7, cards: 3, money: 2 }],
    ]);

    constructor() {
        super();
    }

    raise(race: string) {
        dialogsModule.alert({
            message: race + "\n"
            + "\nInitial life: " + this.start_values.get(race).life
            + "\nInitial cards in hand: " + this.start_values.get(race).cards
            + "\nInitial money: " + this.start_values.get(race).money,

            okButtonText: "OK"
        });
    }

    public onTapHumans() {
        this.raise(Race.human);
    }
    public onTapElves() {
        this.raise(Race.elf);
    }
    public onTapDwarfs() {
        this.raise(Race.dwarf);
    }
    public onTapOrks() {
        this.raise(Race.ork);
    }
    public onTapTrolls() {
        this.raise(Race.troll);
    }
}