import { Observable, fromObject } from 'data/observable';
import { ObservableArray, ChangedData, ChangeType } from "tns-core-modules/data/observable-array";
import { StackLayout } from "ui/layouts/stack-layout";
import frameModule = require("ui/frame");
import dialogs = require("ui/dialogs");
import * as application from "application";
import { AndroidApplication, AndroidActivityBackPressedEventData } from "application";

import listViewModule = require("tns-core-modules/ui/list-view");
import labelModule = require("tns-core-modules/ui/label");
import * as dialogsModule from "ui/dialogs";

import Loki = require("lokijs/src/lokijs.js"); 
import { Party, Player } from "../../resources/party";
import { TAG } from "../../resources/enum";

export class PlayerListModule extends Observable {

    partyCollection: Loki.Collection;
    playerCollection: Loki.Collection;
    shadowrunDb: Loki;
    playerList: ObservableArray<Player> = new ObservableArray<Player>();
    
    currentParty: Party;
    activity: any;

    // Easy function get the current party name
	get partyName(): string {
		return this.get('_partyName');
	}

    // Easy functin to update the party name
	set partyName(value: string) {
        if(this.partyName === value)
            return;

		this.set('_partyName', value);
        this.currentParty.name = value;

        this.updateCurrentParty();
	}

    updateCurrentParty() {
        this.partyCollection.update(this.currentParty);
        this.shadowrunDb.save();
    }

    constructor(currentParty:Party) {
        super();

        this.currentParty = currentParty;
        this.shadowrunDb = global[TAG.SHADOWRUN_DB];
        this.partyCollection = this.shadowrunDb.getCollection(TAG.PARTY_LIST);
        this.playerCollection = this.shadowrunDb.getCollection(TAG.PLAYER_LIST);
        if(this.playerCollection == null) {
            this.playerCollection = this.shadowrunDb.addCollection(TAG.PLAYER_LIST);
        };
        
        this.partyName = this.currentParty.name;
        this.loadItems();


        ///////////////////////////////////////////////////////////////////////
        // the back button should always go to the party-list
        // * this would not happen if a player was removed and back was pressed

        this.activity = application.android.startActivity ||
            application.android.foregroundActivity ||
            frameModule.topmost().android.currentActivity ||
            frameModule.topmost().android.activity;

        this.activity.onBackPressed = function () {
            var navigationOptions = {
                moduleName: 'views/party-list/party-list',
            }

            frameModule.topmost().navigate(navigationOptions);
        }
    }

    onDelete() {
        dialogsModule.confirm({
            message: "Are you sure you want to remove this party?",
            okButtonText: "Yes",
            cancelButtonText: "No"
        }).then((result:boolean) => {
            if (result) {
                for (let playerId of this.currentParty.playersId) {
                    this.playerCollection.remove(playerId);
                }
                this.partyCollection.remove(this.currentParty);
                this.shadowrunDb.save();

                var navigationOptions = {
                    moduleName: 'views/party-list/party-list'
                }

                frameModule.topmost().navigate(navigationOptions);
            }
        });
    }

    loadItems() {
        for(let playerId of this.currentParty.playersId) {
            let player = this.playerCollection.get(playerId);
            if(! player)
            {
                // remove invalid player from list
                let index = this.currentParty.playersId.indexOf(playerId);
                this.currentParty.playersId.splice(index, 1);
            }
            else
            {
                this.playerList.push(player);
            }
        }
    }

    findInPlayerList(value:string) {
        for (var i = 0; i < this.playerList.length; i += 1) {
            if (this.playerList.getItem(i).name === value) {
                return i;
            }
        }
        return -1;
    }

    onTapAdd() {
        dialogs.prompt("Add player", "Player name").then(r => {
            if(r.result)
            {
                let newPlayerName = r.text.trim();
                if(this.findInPlayerList(newPlayerName) > -1) {
                    alert("This player is already in the party.");
                } else {
                    if(this.currentParty.playersId.length == 4) {
                        alert("This party already have 4 players.");
                    }
                    else {
                        let newPlayer = new Player();
                        newPlayer.name = newPlayerName;

                        this.addPlayer(newPlayer);             
                    }
                }
            }
        });
    }

    onItemTap(args: listViewModule.ItemEventData){
        let tappedItemIndex = args.index;
        let playerName = (<labelModule.Label>args.view).text;
        
        let obj = this.getPlayer(playerName);
        var navigationOptions={
            moduleName:'views/player-info/player-info',
            context:{ currentPlayer: obj.player, currentParty: this.currentParty }
        }
    
        frameModule.topmost().navigate(navigationOptions);
    };

    getPlayer(playerName:string): { player: Player, index: number } {
        let players = this.playerCollection.where( (obj:Player) => { return obj.name == playerName; });

        let index = -1;
        let player:Player;
        for(player of players) {
            //get player id
            let id = player['$loki'];
            index = this.currentParty.playersId.findIndex((playerId:number) => {return playerId == id;});
            if(index != -1)
                break;
        };

        return { player, index };
    }

    addPlayer(player: Player) {
        player = this.playerCollection.insert(player)
        this.currentParty.playersId.push(player['$loki']);

        this.partyCollection.update(this.currentParty);
        this.shadowrunDb.save();

        this.playerList.push(player);
        this.playerList.sort();   
    }

    removePlayer(tappedItemIndex: number, playerName: string) {
        this.playerList.splice(tappedItemIndex, 1);

        let obj = this.getPlayer(playerName);
        if(obj.index === -1){
            alert("Inconsistent party database.")
            return;
        }

        this.playerCollection.remove(obj.player);
        this.currentParty.playersId.splice(obj.index ,1);
        this.updateCurrentParty();
    }
    
}