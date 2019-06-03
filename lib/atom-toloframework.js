'use babel';

import AtomToloframeworkView from './atom-toloframework-view';
import { CompositeDisposable } from 'atom';

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
    console.log('AtomToloframework was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
