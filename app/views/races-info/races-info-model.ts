import { Observable } from 'data/observable';
import * as frameModule from "ui/frame";
import * as dialogsModule from "ui/dialogs";
import { RaceData } from "../../resources/enum";

export class RacesInfoModule extends Observable {

    public race: string;
    public hit_points: number;
    public nuyen: number;
    public cards: number;
    constructor(race: RaceData) {
        super();

        this.race       = race.name;
        this.hit_points = race.hit_points;
        this.nuyen      = race.nuyen;
        this.cards      = race.cards;
    }
}