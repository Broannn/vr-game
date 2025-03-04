<script setup>
import { ref, defineProps, watch, onMounted, onBeforeUnmount } from 'vue';

const showOnboarding = ref(true);
const progress = ref(0);
const progressComplete = ref(false);
const statusText = ref("Chargement en cours...");

const props = defineProps({
  loaded: Boolean,
});

watch(() => props.loaded, (newValue) => {
  if (newValue) {
    let interval = setInterval(() => {
      if (progress.value < 100) {
        progress.value += 100;
      } else {
        clearInterval(interval);
        progressComplete.value = true;
        statusText.value = "Chargement terminé !";
      }
    }, 300);
  }
});

const backgrounds = [
  "assets/loading/loading1.png",
  "assets/loading/loading2.png",
  "assets/loading/loading3.png",
  "assets/loading/loading4.png",
  "assets/loading/loading5.png"
];

const layerA = ref({
  image: backgrounds[0],
  opacity: 1,
});
const layerB = ref({
  image: backgrounds[1],
  opacity: 0,
});
const activeLayer = ref('A'); // 'A' ou 'B'
let currentIndex = 0;
let bgTimeout = null;

function cycleBackground() {
  if (!showOnboarding.value) return;
  const nextIndex = (currentIndex + 1) % backgrounds.length;
  const inactiveLayer = activeLayer.value === 'A' ? layerB : layerA;
  
  // Prépare la couche inactive avec la prochaine image
  inactiveLayer.value.image = backgrounds[nextIndex];
  inactiveLayer.value.opacity = 0;
  
  // Après 8 secondes d'affichage
  bgTimeout = setTimeout(() => {
    // Forcer un rafraîchissement du DOM avant de lancer la transition
    requestAnimationFrame(() => {
      // Déclencher la transition : faire apparaître la couche inactive
      inactiveLayer.value.opacity = 1;
      // Et faire disparaître la couche active
      if (activeLayer.value === 'A') {
        layerA.value.opacity = 0;
      } else {
        layerB.value.opacity = 0;
      }
    });
    
    // Après la durée de la transition (1.5s), échanger les rôles
    setTimeout(() => {
      activeLayer.value = activeLayer.value === 'A' ? 'B' : 'A';
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
    <!-- Couche A -->
    <div 
      class="background"
      :style="{
        backgroundImage: `url(${layerA.image})`,
        opacity: layerA.opacity,
        zIndex: activeLayer === 'A' ? 2 : 1
      }">
    </div>
    <!-- Couche B -->
    <div 
      class="background"
      :style="{
        backgroundImage: `url(${layerB.image})`,
        opacity: layerB.opacity,
        zIndex: activeLayer === 'B' ? 2 : 1
      }">
    </div>
    
    <div class="content">
      <h1>{{ statusText }}</h1>
      <div class="loading-bar-container">
        <div class="loading-bar" :style="{ width: progress + '%' }"></div>
      </div>
      <button v-if="progressComplete" @click="enterScene()">Enter Scene</button>
      <div class="licences">
        <section>
          <h4>Modes de déplacement</h4>
          <ul>
            <li>PC – Clavier (WASD ou flèches) + Souris pour regarder</li>
            <li>Mobile – 1 doigt pour avancer, 2 doigts pour reculer</li>
            <li>VR/AR – Marche, téléportation et pointeur laser</li>
          </ul>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  transition: opacity 1.5s ease-in-out;
}
#onboarding {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
  font-family: monospace;
  z-index: 10000;
}
.content {
  position: relative;
  z-index: 10;
  background: rgba(0, 0, 0, 0.6);
  padding: 20px;
  border-radius: 10px;
}
h1 {
  font-size: 1.5rem;
  margin-bottom: 15px;
}
.loading-bar-container {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
  z-index: 10001;
}
.loading-bar {
  height: 100%;
  background: #fff;
  transition: width 0.3s ease;
}
button {
  font-size: 1.3rem;
  padding: 0.5rem 1rem;
  border-radius: 0.3rem;
  background-color: white;
  color: black;
  border: none;
  cursor: pointer;
  opacity: 1;
  transition: opacity 1s ease-in-out;
  margin-top: 20px;
}
.licences {
  margin-top: 20px;
  text-align: left;
}
.licences h4 {
  margin-bottom: 10px;
}
.licences ul {
  list-style: none;
  padding-left: 0;
}
.licences li {
  margin-bottom: 5px;
}
</style>
