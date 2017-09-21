import { Observable } from 'data/observable';
import * as frameModule from "ui/frame";
import * as dialogsModule from "ui/dialogs";
import { Race, RaceData } from "../../resources/enum";

export class RacesModule extends Observable {
    constructor() {
        super();
    }

    navigateTo(race: RaceData)
    {
        var navigationOptions = {
            moduleName: 'views/races-info/races-info',
            context: { currentRace: race }
        }

        frameModule.topmost().navigate(navigationOptions);
    }

    public onTapHumans() {
        this.navigateTo(Race.human);
    }
    public onTapElves() {
        this.navigateTo(Race.elf);
    }
    public onTapDwarfs() {
        this.navigateTo(Race.dwarf);
    }
    public onTapOrks() {
        this.navigateTo(Race.ork);
    }
    public onTapTrolls() {
        this.navigateTo(Race.troll);
    }
}