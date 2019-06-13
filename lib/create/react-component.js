'use babel';

import { tag, div } from "../dom";

export default class ReactComponentView {

    constructor(serializedState) {
        const currentPath = getCurrentPath();
        console.info("[react-component] currentPath=", currentPath);
        
        // Create root element
        const input = tag("input", 'input-text', { type: 'text', placeholder: 'Component name', autofocus: true });
        
        this.element = div("atom-toloframework", [
            tag("h1", ["Create React Component"]),
            input,
            div("message", [currentPath])
        ]);
    }

    // Returns an object that can be retrieved when package is activated
    serialize() {}

    // Tear down any state and detach
    destroy() {
        this.element.remove();
    }

    getElement() {
        return this.element;
    }
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
