AFRAME.registerComponent('torch-sound', {
    init: function () {
      this.el.addEventListener('grab', () => {
        console.log("🔥 Torche saisie : Activation du son");
        if (this.el.components.sound) {
          this.el.components.sound.playSound();
        }
      });
  
      this.el.addEventListener('drop', () => {
        console.log("❄️ Torche relâchée : Arrêt du son");
        if (this.el.components.sound) {
          this.el.components.sound.pauseSound();
        }
      });
    }
  });
  