import { Observable, fromObject } from 'data/observable';

import { StackLayout } from "ui/layouts/stack-layout";
import frameModule = require("ui/frame");
import dialogs = require("ui/dialogs");


import { ObservableArray, ChangedData, ChangeType } from "tns-core-modules/data/observable-array";
import listViewModule = require("tns-core-modules/ui/list-view");
import labelModule = require("tns-core-modules/ui/label");

import { SelectedIndexChangedEventData } from "nativescript-drop-down";
import Loki = require("lokijs/src/lokijs.js"); 
import { Party, Player } from "../../resources/party";
import { TAG, Class, Race } from "../../resources/enum";

export class PlayerInfoModule extends Observable {

    playerCollection: Loki.Collection;
    shadowrunDb: Loki;
    
    currentPlayer: Player;
    currentParty: Party;

    constructor(player: Player, party: Party) {
        super();

        this.shadowrunDb = global[TAG.SHADOWRUN_DB];
        this.playerCollection = this.shadowrunDb.getCollection(TAG.PLAYER_LIST);

        this.currentParty = party;
        this.currentPlayer = player;
        this.playerName = player.name;
        this.currentClass = player.class;
        this.currentRace = player.race;
        this.currentXP = player.xp;

        this.set('_classList', Class.classList);
        this.set('_currentClassIndex', Class.classList.indexOf(player.class));
        this.set('_raceList', Race.raceList);
        this.set('_currentRaceIndex', Race.raceList.indexOf(player.race));
    }

// Easy function get the current party name
	get playerName(): string {
		return this.get('_playerName');
	}

    // Easy functin to update the party name
	set playerName(value: string) {
        if(this.playerName === value)
            return;

		this.set('_playerName', value);
        this.currentPlayer.name = value;
        this.updateCurrentPlayer();
	}

        // Easy function get the current party name
	get currentXP(): number {
		return this.get('_currentXP');
	}

    // Easy functin to update the party name
	set currentXP(value: number) {
        if(value === 0)
            this.set('_currentXP', 0);
        else {
            this.set('_currentXP', value);
            if (this.currentPlayer.xp === value)
                return;
            this.currentPlayer.xp = value;
            this.updateCurrentPlayer();
        }
    }
    
    // update current xp valeu with edited value
    public editXp() {
        this.currentXP = this.currentXP;
    }

    get currentClass(): string {
		return this.get('_currentClass');
	}

    // Easy functin to update the party name
	set currentClass(value: string) {
        if(value === "")
            this.set('_currentClass', 'Class');
        else {
            if(this.currentPlayer.class === value && value != "")
                return;
            this.set('_currentClass', value);
            this.currentPlayer.class = value;
            this.updateCurrentPlayer();
        }
    }
    
    public selectedClassIndex(args: SelectedIndexChangedEventData) {
        this.currentClass = Class.classList[args.newIndex];
    }

    public selectedRaceIndex(args: SelectedIndexChangedEventData) {
        this.currentRace = Race.raceList[args.newIndex];
    }

    get currentRace(): string {
		return this.get('_currentRace');
	}

    // Easy functin to update the current player race
	set currentRace(value: string) {
        if(value === "")
            this.set('_currentRace', 'Race');
        else {
            if(this.currentPlayer.race === value && value != "")
                return;
            this.set('_currentRace', value);
            this.currentPlayer.race = value;
            this.updateCurrentPlayer();
        }
	}

    updateCurrentPlayer() {
        // update database with current player
        this.playerCollection.update(this.currentPlayer);
        this.shadowrunDb.save();
    }    

    onDelete() {
        // confirm if the user wants to delete the current player
        dialogs.confirm({
            message: "Are you sure you want to remove this party?",
            okButtonText: "Yes",
            cancelButtonText: "No"
        }).then((result: boolean) => {
            if (result) {
                // remove player from party object
                let index = this.currentParty.playersId.indexOf(this.currentPlayer['$loki']);
                this.currentParty.playersId.splice(index, 1);
                // remove player from database
                this.playerCollection.remove(this.currentPlayer);
                this.shadowrunDb.save();

                //navigate to player list page
                var navigationOptions = {
                    moduleName: 'views/player-list/player-list',
                    context: { party: this.currentParty }
                }
                frameModule.topmost().navigate(navigationOptions);
            }
        });
    }
}