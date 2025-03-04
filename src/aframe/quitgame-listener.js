import { quitGame } from './quitgame.js'; // (chemin à adapter)

AFRAME.registerComponent('quitgame-listener', {
  schema: {
    event: {type: 'string', default: 'quitgame'}, 
    time: {type: 'number', default: 5000}
  },

  init: function () {
    this.onEvent = () => {
      console.log(`\nquitgame-listener: reçu l'événement "${this.data.event}" → on appelle quitGame(${this.data.time})`);
      quitGame(this.data.time);
    };
    // On écoute l’événement "event" sur l'entité
    this.el.addEventListener(this.data.event, this.onEvent);
  },

  remove: function () {
    this.el.removeEventListener(this.data.event, this.onEvent);
  }
});
