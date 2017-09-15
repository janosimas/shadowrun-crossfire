import { Observable } from 'data/observable';
import { ObservableArray, ChangedData, ChangeType } from "tns-core-modules/data/observable-array";
import frameModule = require("ui/frame");
import dialogs = require("ui/dialogs");

import listViewModule = require("tns-core-modules/ui/list-view");
import labelModule = require("tns-core-modules/ui/label");

import Loki = require("lokijs/src/lokijs.js"); 
import { Party } from "../../resources/party";
import { TAG } from "../../resources/enum";

export class PartyListModule extends Observable {

    partyCollection: Loki.Collection;
    shadowrunDb: Loki;
    partyList: ObservableArray<Party> = new ObservableArray<Party>();

    constructor() {
        super();

        this.shadowrunDb = global[TAG.SHADOWRUN_DB];
        this.partyCollection = this.shadowrunDb.getCollection(TAG.PARTY_LIST);
        if(this.partyCollection == null) {
            this.partyCollection = this.shadowrunDb.addCollection(TAG.PARTY_LIST);
        };

        this.loadItems();
    }

    loadItems() {
        let collection = this.partyCollection.where(()=>{ return true; });
        for(let party of collection) {
            this.partyList.push(party);
        }
    }

    findInPartyList(value: string) {
        for (var i = 0; i < this.partyList.length; i += 1) {
            if (this.partyList.getItem(i).name === value) {
                return i;
            }
        }
        return -1;
    }

    onTapAdd() {
        dialogs.prompt("Create new party", "Party name").then(r => {
            if(r.result)
            {
                let newPartyName = r.text.trim();
                if(this.findInPartyList(newPartyName) > -1) {
                    alert("This name is already taken...");
                } else {
                    let newParty = new Party();
                    newParty.name = newPartyName;

                    this.partyCollection.insert(newParty);
                    this.shadowrunDb.save();

                    this.partyList.push(newParty);
                    this.partyList.sort();                
                }
            }
        });
    }

    onItemTap(args: listViewModule.ItemEventData) {
        let tappedItemIndex = args.index;
        let partyName = (<labelModule.Label>args.view).text;

        this.partyList.splice(tappedItemIndex, 1);

        let currentParty = this.partyCollection.where( (obj:Party) => { return obj.name == partyName; })[0];

        var navigationOptions={
            moduleName:'views/player-list/player-list',
            context:{ party: currentParty }
        }
    
        frameModule.topmost().navigate(navigationOptions);
    };
}