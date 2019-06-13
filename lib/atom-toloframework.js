'use babel';

import AtomToloframeworkView from './atom-toloframework-view';
import { CompositeDisposable } from 'atom';
import ReactComponentView from "./create/react-component";

export default {

    atomToloframeworkView: null,
    modalPanel: null,
    subscriptions: null,

    activate(state) {
        this.atomToloframeworkView = new AtomToloframeworkView(state.atomToloframeworkViewState);
        this.modalPanel = atom.workspace.addModalPanel({
            item: this.atomToloframeworkView.getElement(),
            visible: false
        });
        this.atomToloframeworkView.onHide = () => this.modalPanel.hide();

        // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
        this.subscriptions = new CompositeDisposable();

        // Register command that toggles this view
        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'atom-toloframework:toggle': () => this.toggle()
        }));
    },

    deactivate() {
        this.modalPanel.destroy();
        this.subscriptions.dispose();
        this.atomToloframeworkView.destroy();
    },

    serialize() {
        return {
            atomToloframeworkViewState: this.atomToloframeworkView.serialize()
        };
    },

    toggle() {
        if( this.modalPanel.isVisible() ) {
            this.modalPanel.hide();
        } else {
            this.atomToloframeworkView.update();
            this.modalPanel.show();
        }
    },

    createReactComponent() {
        console.log(">>> createReactComponent()");
        const view = new ReactComponentView(state.atomToloframeworkViewState);
        console.info("[atom-toloframework] view=", view);
        const modal = atom.workspace.addModalPanel({
            item: view.getElement(),
            visible: false
        });
        console.info("[atom-toloframework] modal=", modal);
        modal.show();
    }
}
