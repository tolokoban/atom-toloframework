'use babel';

import { tag, div } from "./dom";
import FS from "fs";
import Path from "path";

export default class AtomToloframeworkView {

    constructor(serializedState) {
        this.handleKeyboard = this.handleKeyboard.bind(this);
        this.handlers = {
            Escape: this.handleEscape.bind(this)
        };
        // Create root element
        this.element = div("atom-toloframework");
    }

    update() {
        this.element.innerHTML = "<h1>Toloframework</h1>";
        const currPath = getCurrentPath();
        if( !isDir(currPath) ) {
            this.appendSwitchTo(currPath);
        }

        this.appendCreate();

        this.element.appendChild(tag("hr"));
        this.element.appendChild(div("message", [currPath]));
    }

    appendCreate() {
        const elem = this.elem;
        const inputComponentName = tag("input", "input-text", {
            placeholder: "Component name"
        });
        const inputCreateContainer = tag("input", "input-toggle", {
            type: "checkbox"
        });
        const buttonOk = tag("button", "btn", ["Create"]);
        this.element.appendChild(
            div([
                tag("h2", ["Create"]),
                inputComponentName,
                tag("label", "input-label", [
                    inputCreateContainer, "Create a container"
                ], {
                    style: { margin: ".5em 0" }
                }),
                tag("br"),
                buttonOk
            ])
        );
    }

    appendSwitchTo(currPath) {
        const that = this;
        const elem = this.element;
        const handlers = this.handlers;
        const parsing = Path.parse(addIndexForDirectories(currPath));
        const curExt = parsing.ext.substr(1);
        const extensions = ["css", "yaml", "js", "vert", "frag"];
        let firstButton = null;
        elem.appendChild(tag("h2", ["Switch to"]));

        extensions.forEach(function (ext) {
            if( ext === curExt) return;
            const target = findTarget(parsing, ext);
            const handler = switchTo.bind(that, target);
            const initial = ext.charAt(0);
            const button = tag(
                "button", "btn", "btn-lg", {
                    accesskey: initial,
                    autofocus: true
                }, [
                    tag("span", "badge", "badge-info", [initial]),
                    tag("span", ["  "]),
                    tag("span", [Path.basename(target)])
                ]);
            button.addEventListener("click", handler, false);
            button.addEventListener("keydown", that.handleKeyboard.bind(that), false);
            elem.appendChild(button);
            handlers[initial] = handler;
            firstButton = button;
        });

        if( [".js", ".ts", ".tsx"].indexOf(parsing.ext) === -1 ) {
            // Adding "ts" or "tsx".
            const target = findTarget(parsing);
            const button = tag("button", "btn", "btn-lg", [Path.basename(target)]);
            button.addEventListener("click", () => {
                switchTo.call(this, target);
            }, false);
            elem.appendChild(button);
            firstButton = button;
        }

        if( firstButton ) {
            window.setTimeout(() => firstButton.focus(), 200 );
        }
    }

    // Returns an object that can be retrieved when package is activated
    serialize() {}

    // Tear down any state and detach
    destroy() {
        document.removeEventListener("keydown", this.handleKeyboard);
        this.element.remove();
    }

    getElement() {
        return this.element;
    }

    handleKeyboard(evt) {
        const handler = this.handlers[evt.key];
        if( typeof handler === 'function') {
            handler();
            evt.preventDefault();
            evt.stopPropagation();
        }
    }

    handleEscape() {
        const onHide = this.onHide;
        if (typeof onHide === 'function') onHide();
    }
}


function isDir(path) {
    const stat = FS.statSync(path);
    return stat.isDirectory();
}


function getCurrentPath() {
    const treeViewSelection = document.querySelector('.tree-view .selected');
    if( treeViewSelection ) return treeViewSelection.getPath();
    const activePaneItem = atom.workspace.getActivePaneItem();
    if( !activePaneItem ) return null;
    const buffer = activePaneItem.buffer;
    if( !buffer ) return null;
    const file = buffer.file;
    if( !file ) return null;
    return file.path;
}


function replaceExtension( filename, newExtension ) {
    const pos = filename.lastIndexOf( '.' );
    if ( newExtension.startsWith( "." ) ) {
        if ( pos < 0 ) return filename + newExtension;
        return filename.substr( 0, pos ) + newExtension;
    } else {
        if ( pos < 0 ) return filename + "." + newExtension;
        return filename.substr( 0, pos ) + "." + newExtension;
    }
}


function hyphenate( filename ) {
    const name = Path.parse( filename ).name;
    const parts = name.split( /[^a-zA-Z0-9]+/ );
    return parts.map( ( s ) => s.toLowercase() ).join( '-' );
}


/**
 * @param {{ root, dir, base, ext, name }} parsing
 * @param {string} ext
 */
function findTarget( parsing, ext ) {
    if( !ext ) {
        const filenames = [
            Path.join(parsing.dir, `${parsing.name}.tsx`),
            Path.join(parsing.dir, `${parsing.name}.ts`),
            Path.join(parsing.dir, `${parsing.name}.js`),
            Path.join(parsing.dir, `index.tsx`),
            Path.join(parsing.dir, `index.ts`),
            Path.join(parsing.dir, `index.js`)
        ];
        for( const filename of filenames ) {
            if( FS.existsSync(filename) ) return filename;
        }
    }
    if( parsing.name === 'index' ) {
        return Path.join(parsing.dir, `${Path.basename(parsing.dir)}.${ext}`);
    }
    else {
        return Path.join(parsing.dir, `${parsing.name}.${ext}`);
    }
}


function switchTo(target) {
    atom.workspace.activateNextPane();
    atom.workspace.open( target );
    this.handleEscape();
}


function addIndexForDirectories(path) {
    if( isDir( path ) ) {
        for( const ext of ["tsx", "ts"] ) {
            const filename = Path.join( path, `index.${ext}` );
            if( FS.existsSync( filename ) ) return filename;
        };
        return Path.join( path, "index.js" );
    }
    return path;
}
