<script setup>
import { ref } from 'vue';

import TheCameraRig from './TheCameraRig.vue';
import TheMainRoom from './TheMainRoom.vue';
import TheLifeCubeRoom from './TheLifeCubeRoom.vue';
import ThePhysicRoom from './ThePhysicRoom.vue';

import '../aframe/simple-grab.js';
import '../aframe/outline.js';
import '../aframe/flicker-light.js';
import '../aframe/listen-to.js';
import '../aframe/event-set.js';
import '../aframe/torch-sound.js';


defineProps({
  scale: Number,
  overlaySelector: String,
});

const allAssetsLoaded = ref(false);
</script>

<template>
  <a-scene background="color: black;" :webxr="`
      requiredFeatures: local-floor;
      referenceSpaceType: local-floor;
      optionalFeatures: dom-overlay;
      overlayElement: ${overlaySelector};
    `" xr-mode-ui="XRMode: xr" physx="
      autoLoad: true;
      delay: 1000;
      useDefaultScene: false;
      wasmUrl: lib/physx.release.wasm;
    " outline simple-grab>

    <a-assets @loaded="allAssetsLoaded = true">

      <a-asset-item id="level" src="assets/egypt_chamber_for_ar__vr_games/scene.gltf"></a-asset-item>
      <a-asset-item id="character" src="assets/mummy_character/scene.gltf"></a-asset-item>
      <a-asset-item id="torch" src="assets/torch/torch.glb"></a-asset-item>
      <a-asset-item id="bougie" src="assets/bougies/scene.gltf"></a-asset-item>
      <a-asset-item id="bougiesolo" src="assets/bougiesolo/scene.gltf"></a-asset-item>
      <a-asset-item id="indice" src="assets/indice/indice.glb"></a-asset-item>
      <a-asset-item id="indice2" src="assets/indice/indice2.glb"></a-asset-item>
      


      <img id="room-physic-out-texture" :src="`assets/main-room-from-physic-room.png`">
      <img id="room-gol-out-texture" :src="`assets/main-room-from-gol-room.png`">
      <img id="room-physic-texture" :src="`assets/physicRoom.png`">
    </a-assets>

    <template v-if="allAssetsLoaded">

      <a-entity 
        sound="src: url(assets/ambiance.mp3); autoplay: true; loop: true; volume: 0.7">
      </a-entity>

      
      <a-entity gltf-model="#level" scale="0.005 0.005 0.005" position="13.070 -3.920 -4.760"></a-entity>
      <!-- <a-light type="ambient" color="#888"></a-light>
      <a-light type="directional" color="#fff" intensity="1" position="-1 2 1"></a-light> -->


      <a-entity gltf-model="#bougie" position="1.900 -1.060 0" scale="2 2 2">
        <!-- Lumière principale (point light) -->
        <a-entity light="type: point; color: #FFA500; intensity: 1; distance: 3; decay: 2;" position="0 0.6 0"
          flicker-light="minIntensity: 0.8; maxIntensity: 1.2; minDuration: 200; maxDuration: 700"></a-entity>

        <!-- Lumière secondaire (spotlight) pour une lueur vers le haut -->
        <a-entity light="type: spot; color: #FFAE42; intensity: 0.8; distance: 7; angle: 30; penumbra: 0.5; decay: 1.5;"
          position="0 0.7 0" rotation="-90 0 0"></a-entity>
      </a-entity>

      <a-entity gltf-model="#bougie" position="-5.770 -1.060 -9.450" scale="2 2 2">
        <a-entity light="type: point; color: #FFA500; intensity: 1; distance: 3; decay: 2;" position="0 0.6 0"
        flicker-light="minIntensity: 0.8; maxIntensity: 1.2; minDuration: 200; maxDuration: 700"></a-entity>
        <!-- Lumière secondaire (spotlight) pour une lueur vers le haut -->
        <a-entity light="type: spot; color: #FFAE42; intensity: 0.8; distance: 7; angle: 30; penumbra: 0.5; decay: 1.5;"
          position="0 0.7 0" rotation="-90 0 0"></a-entity>
      </a-entity>

      <a-entity gltf-model="#bougiesolo" position="-0.880 -1.060 -7.490" scale="0.1 0.1 0.1">
        <!-- Lumière principale (point light) -->
        <a-entity light="type: point; color: #FFA500; intensity: 1; distance: 3; decay: 2;" position="0 7.410 0"
          flicker-light="minIntensity: 0.8; maxIntensity: 1.2; minDuration: 200; maxDuration: 700"></a-entity>

        <!-- Lumière secondaire (spotlight) pour une lueur vers le haut -->
        <a-entity light="type: spot; color: #FFAE42; intensity: 0.8; distance: 7; angle: 30; penumbra: 0.5; decay: 1.5;"
          position="0 5.050 0" rotation="-90 0 0"></a-entity>
      </a-entity>

      <a-entity gltf-model="#bougiesolo" position="3.930 -1.060 -12.050" scale="0.1 0.1 0.1">
        <!-- Lumière principale (point light) -->
        <a-entity light="type: point; color: #FFA500; intensity: 1; distance: 3; decay: 2;" position="0 7.410 0"
          flicker-light="minIntensity: 0.8; maxIntensity: 1.2; minDuration: 200; maxDuration: 700"></a-entity>

        <!-- Lumière secondaire (spotlight) pour une lueur vers le haut -->
        <a-entity light="type: spot; color: #FFAE42; intensity: 0.8; distance: 7; angle: 30; penumbra: 0.5; decay: 1.5;"
          position="0 5.050 0" rotation="-90 0 0"></a-entity>
      </a-entity>

      <a-entity gltf-model="#bougiesolo" position="-8.340 0.220 -13.310" scale="0.07 0.07 0.07">
        <!-- Lumière principale (point light) -->
        <a-entity light="type: point; color: #FFA500; intensity: 0.182; distance: 2.180; decay: 1.900;" position="0 1.910 0"
          flicker-light="minIntensity: 0.8; maxIntensity: 1.2; minDuration: 200; maxDuration: 700"></a-entity>

        <!-- Lumière secondaire (spotlight) pour une lueur vers le haut -->
        <a-entity light="type: spot; color: #FFAE42; intensity: 0.4; distance: 7; angle: 20; penumbra: 0.5; decay: 1.5;"
          position="0 5.050 0" rotation="-90 0 0"></a-entity>
      </a-entity>

      <a-entity
        gltf-model="#indice"
        position="1.500 -1.070 -11.550"
        rotation="0 180 0"
        scale="0.740 0.740 0.740"
      ></a-entity>
      <a-entity
        gltf-model="#indice2"
        position="1.510 -1.110 -8.950"
        scale="0.740 0.740 0.740"
      ></a-entity>
      <!--<a-entity
        gltf-model="#character"
        scale="1 1 1"
      ></a-entity>-->


      <a-entity 
  id="torch-container"
  gltf-model="#torch" 
  scale="0.09 0.09 0.09" 
  position="1.550 1.300 12.040" 
  rotation="0 0 17.000"
  simple-grab 
  clickable
  sound="src: url(assets/fire.mp3); autoplay: false; loop: true; volume: 0.1"
  torch-sound
>
  <!-- Lumière de la torche avec un scintillement naturel -->
  <a-entity 
    light="type: point; color: #FFA500; intensity: 4; distance: 8;" 
    position="0 10.4 0"
    flicker-light="minIntensity: 2; maxIntensity: 3.8; minDuration: 300; maxDuration: 800">
  </a-entity>
</a-entity>

    </template>

    <TheCameraRig position="0.700 0 14.5"></TheCameraRig>

  </a-scene>
</template>
