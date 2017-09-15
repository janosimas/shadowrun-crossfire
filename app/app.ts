/*
In NativeScript, the app.ts file is the entry point to your application.
You can use this file to perform app-level initialization, but the primary
purpose of the file is to pass control to the app’s first module.
*/

import "./bundle-config";
import * as app from 'application';

import fs = require("file-system");
import Loki = require("lokijs/src/lokijs.js");
import LokiNativeScriptAdapter = require("lokijs/src/loki-nativescript-adapter.js")
import { TAG } from "./resources/enum";
// Setup Loki
let path = fs.path.join(fs.knownFolders.currentApp().path, TAG.SHADOWRUN_DB_FILE);
let shadowrunDb = new Loki(path, {
    autoload: true,
    autosave: true,
    adapter: new LokiNativeScriptAdapter()
});

global[TAG.SHADOWRUN_DB] = shadowrunDb;

app.start({ moduleName: 'views/main/main' });

/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
