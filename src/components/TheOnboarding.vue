<script setup>
import { ref, defineProps, watch, onMounted, onBeforeUnmount } from 'vue';

const showOnboarding = ref(true);
const progress = ref(0);
const progressComplete = ref(false);
const statusText = ref("Loading...");

const props = defineProps({
  loaded: Boolean,
});

// Barre de progression simulée
watch(() => props.loaded, (newValue) => {
  if (newValue) {
    let interval = setInterval(() => {
      if (progress.value < 100) {
        progress.value += 1;
      } else {
        clearInterval(interval);
        progressComplete.value = true;
        statusText.value = "Loading complete !";
      }
    }, 300);
  }
});

// Images de fond pour le diaporama
const backgrounds = [
  "assets/loading/loading1.png",
  "assets/loading/loading2.png",
  "assets/loading/loading3.png",
  "assets/loading/loading4.png",
  "assets/loading/loading5.png"
];

// Couche A et B pour le fade
const layerA = ref({ image: backgrounds[0], opacity: 1 });
const layerB = ref({ image: backgrounds[1], opacity: 0 });
const activeLayer = ref('A');
let currentIndex = 0;
let bgTimeout = null;

// Transition d'images toutes les 8s
function cycleBackground() {
  if (!showOnboarding.value) return;
  const nextIndex = (currentIndex + 1) % backgrounds.length;
  const inactiveLayer = (activeLayer.value === 'A') ? layerB : layerA;

  // Prépare la couche inactive
  inactiveLayer.value.image = backgrounds[nextIndex];
  inactiveLayer.value.opacity = 0;

  bgTimeout = setTimeout(() => {
    requestAnimationFrame(() => {
      // Fait apparaître la couche inactive
      inactiveLayer.value.opacity = 1;
      // Fait disparaître la couche active
      if (activeLayer.value === 'A') {
        layerA.value.opacity = 0;
      } else {
        layerB.value.opacity = 0;
      }
    });
    // Après 1.5s de transition, on permute
    setTimeout(() => {
      activeLayer.value = (activeLayer.value === 'A') ? 'B' : 'A';
      currentIndex = nextIndex;
      cycleBackground();
    }, 1500);
  }, 8000);
}

onMounted(() => {
  cycleBackground();
});

onBeforeUnmount(() => {
  clearTimeout(bgTimeout);
});

// Fermeture de l'onboarding
function enterScene() {
  showOnboarding.value = false;
  clearTimeout(bgTimeout);
  if (AFRAME && AFRAME.utils && AFRAME.utils.device) {
    if (AFRAME.utils.device.checkHeadsetConnected() && !AFRAME.utils.device.isMobile()) {
      document.querySelector('a-scene').enterVR();
    }
    document.querySelector('a-scene').emit('enter-scene');
  }
}
</script>

<template>
  <div id="onboarding" v-if="showOnboarding">

    <!-- Mise en page 2 colonnes -->
    <div class="layout">
      <!-- Colonne gauche : l'espace réservé au diaporama -->
      <div class="left-col">
        <!-- Couche A -->
        <div 
          class="background"
          :style="{
            backgroundImage: `url(${layerA.image})`,
            opacity: layerA.opacity,
            zIndex: activeLayer === 'A' ? 2 : 1
          }"
        ></div>
        <!-- Couche B -->
        <div 
          class="background"
          :style="{
            backgroundImage: `url(${layerB.image})`,
            opacity: layerB.opacity,
            zIndex: activeLayer === 'B' ? 2 : 1
          }"
        ></div>
      </div>
      
      <!-- Colonne droite : le panneau beige -->
      <div class="panel">
        
        <h2 class="game-title">Tomb of the Ruined King</h2>
        <p class="text-intro">
          In the heart of an ancient desert, the tomb of a fallen king is said to contain priceless treasures.
          Few souls have ever returned. It's up to you to unravel this mystery:
          will you find the legendary riches or join the lost adventurers?

        </p>

        <h3>{{ statusText }}</h3>
        <div class="loading-bar-container">
          <div class="loading-bar" :style="{ width: progress + '%' }"></div>
        </div>

        <button v-if="progressComplete" @click="enterScene()">Enter Scene</button>

        <p class="ps-codes">
          <strong>PS :</strong> Pour saisir vos codes, utilisez simplement le regard 
          pour sélectionner les chiffres et valider l’entrée.
        </p>
      </div>
    </div>

    <p class="fun-fact">Le savais-tu ? Le savais-tu que... Avoir un chat c'est ... C'est trop cool ? Trop bien ouais. 
      Et bien laisse moi t'expliquer pourquoi avoir un chat c'est super de nous, considère ça... Alors... 
      Euhhhh les chats rend la vie moins euhh.... diminue le stress et la compagnie de eux rend la joie à nous tous. 
      Et oui. Voilà. C'est pour ça que les égyptiens vénéraient les chats.</p>
  </div>  
</template>

<style scoped>
/* Container global */
#onboarding {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  overflow: hidden;
  display: flex;
}

/* Layout : 2 colonnes
   - .left-col : occupe ~2/3 ou 60% 
   - .panel    : occupe ~1/3 ou 40% 
*/
.layout {
  display: flex;
  width: 100%;
  height: 100%;
}

.left-col {
  position: relative; 
  flex: 2;  /* 2 parts sur un total de 3 => 66% */
  overflow: hidden;
}

/* Panel sur la droite (1 part => ~33%) */
.panel {
  flex: 1;
  background: rgba(249, 232, 196, 0.85);
  backdrop-filter: blur(4px);
  display: flex;
  flex-direction: column;
  padding: 40px;
  justify-content: center;
  box-shadow: -2px 0 10px rgba(0,0,0,0.3);
}

/* Les couches d'image */
.background {
  position: absolute;
  top: 0; 
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  transition: opacity 1.5s ease-in-out;
  opacity: 0;
}

/* Titre : style hiéroglyphique/égyptien */
.game-title {
  font-family: 'Fondamento', Papyrus, fantasy, serif;
  font-size: 2rem;
  margin-bottom: 20px;
  text-align: center;
}

/* Intro plus moderne */
.text-intro {
  font-family: sans-serif;
  font-size: 1rem;
  line-height: 1.4;
  margin-bottom: 20px;
  text-align: justify;
}

/* Status text, barre de progression */
h3 {
  font-family: sans-serif;
  text-align: center;
  font-size: 1.2rem;
  margin-bottom: 10px;
}

.loading-bar-container {
  width: 100%;
  height: 8px;
  background: rgba(0,0,0,0.1);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 20px;
}

.loading-bar {
  height: 100%;
  background: linear-gradient(to right, #ffd27f, #ffbf00);
  transition: width 0.3s ease;
}

/* Bouton */
button {
  font-family: sans-serif;
  align-self: center;
  font-size: 1rem;
  padding: 0.7rem 1.2rem;
  border-radius: 0.4rem;
  border: 2px solid #593d15;
  background: #ffefc0;
  color: #3e2d1a;
  box-shadow: 1px 1px 5px rgba(0,0,0,0.2);
  margin-top: 20px;
  cursor: pointer;
}
button:hover {
  background-color: #ffe798;
}
button:active {
  background-color: #ffe065;
  box-shadow: inset 1px 1px 5px rgba(0,0,0,0.2);
}

/* Note codes */
.ps-codes {
  margin-top: 20px;
  font-family: sans-serif;
  font-size: 0.9rem;
  text-align: center;
  font-style: italic;
}
/* "Le savais-tu ?" en bas à gauche */
.fun-fact {
  position: fixed;
  bottom: 10px;
  left: 10px;
  font-size: 0.8rem;
  color: white;
  opacity: 0.8;
  max-width: 300px;
  font-style: italic;
  z-index: 10000;
  pointer-events: none;
}



</style>
