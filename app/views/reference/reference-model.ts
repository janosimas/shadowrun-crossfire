import { Observable, EventData } from 'data/observable';
import { Label } from "tns-core-modules/ui/label";

export class ReferenceModule extends Observable {
    public playCards: string       = "Play as many cards as you want. Each card must affect only one target.";
    public applyDamage: string     = "Resolve the damage of the cards played. You must clear each level, in order, to defeat an obstacle.";
    public collectingNuyen: string = "Start distributing 1 to the current runner and, in order, 1 for each runner." ;
    public takeDamage: string      = "All obstacles damage is applied at the same time. If you take damage to go pass staggered, move the marker to staggered." ;
    public drawCards: string       = "If you have 3 or less cards, draw 2 cards." ;
    public buyCards: string        = "You can buy as many cards as you want if you have the nuyen. The cards bought are immediately replace, and are placed at the runner's hand." ;
    constructor() {
        super();
    }

    public toggleWrap(data: EventData)
    {
        let label = <Label>data.object;
        if(label.textWrap)
            label.textWrap = false;
        else
            label.textWrap = true;
    }
}