import {Observable} from 'data/observable';
import * as frameModule from "ui/frame";

export class MainModule extends Observable {
    constructor() {
        super();
    }

    public onTapRaces() {
        var topmost = frameModule.topmost();
        topmost.navigate("views/races/races");
    }

    public onTapGroups() {
        var topmost = frameModule.topmost();
        topmost.navigate("views/party-list/party-list");
    }
}