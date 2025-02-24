<script setup>
  import { ref } from 'vue';

  import TheCameraRig from './TheCameraRig.vue';
  import TheMainRoom from './TheMainRoom.vue';
  import TheLifeCubeRoom from './TheLifeCubeRoom.vue';
  import ThePhysicRoom from './ThePhysicRoom.vue';

  import '../aframe/simple-grab.js';
  import '../aframe/outline.js';
  import '../aframe/flicker-light.js';

  defineProps({
    scale: Number,
    overlaySelector: String,
  });

  const allAssetsLoaded = ref(false);
</script>

<template>
  <a-scene
    background="color: black;"
    :webxr="`
      requiredFeatures: local-floor;
      referenceSpaceType: local-floor;
      optionalFeatures: dom-overlay;
      overlayElement: ${overlaySelector};
    `"
    xr-mode-ui="XRMode: xr"
    physx="
      autoLoad: true;
      delay: 1000;
      useDefaultScene: false;
      wasmUrl: lib/physx.release.wasm;
    "
    outline
    simple-grab
  >

    <a-assets @loaded="allAssetsLoaded = true">
      <!--
        Title: VR Gallery
        Model source: https://sketchfab.com/3d-models/vr-gallery-1ac32ed62fdf424498acc146fad31f7e
        Model author: https://sketchfab.com/mvrc.art (Maxim Mavrichev)
        Model license: CC BY 4.0 ( https://creativecommons.org/licenses/by/4.0/ )
      -->
      <a-asset-item id="room" src="assets/vr_gallery.glb"></a-asset-item>
      <!--
        Title: 3D Gallery for VR projects
        Model source: https://sketchfab.com/3d-models/3d-gallery-for-vr-projects-68f77ed8558c4bd59e0a13e2cc9d1fd1
        Model author: https://sketchfab.com/tekuto1s (tekuto1s)
        Model license: CC BY 4.0 ( https://creativecommons.org/licenses/by/4.0/ )
      -->
      <a-asset-item id="physic-room" src="assets/3d_gallery_for_vr_projects.glb"></a-asset-item>
      <a-asset-item id="sound-1" response-type="arraybuffer" src="assets/sound1.mp3" preload="auto"></a-asset-item>
      <a-asset-item id="level" src="assets/egypt_chamber_for_ar__vr_games/scene.gltf"></a-asset-item>
      <a-asset-item id="character" src="assets/mummy_character/scene.gltf"></a-asset-item>
      <a-asset-item id="torch" src="assets/torch/scene.gltf"></a-asset-item>
      <a-asset-item id="bougie" src="assets/bougies/scene.gltf"></a-asset-item>
      <a-asset-item id="indice" src="assets/indice/scene.gltf"></a-asset-item>

      <img id="room-physic-out-texture" :src="`assets/main-room-from-physic-room.png`">
      <img id="room-gol-out-texture" :src="`assets/main-room-from-gol-room.png`">
      <img id="room-physic-texture" :src="`assets/physicRoom.png`">
    </a-assets>

    <template v-if="allAssetsLoaded">
      <a-entity
        gltf-model="#level"
        scale="0.005 0.005 0.005"
        position="13.070 -3.920 -4.760"
      ></a-entity>
      <a-box position="0 0 0" scale="1 1 1"
      simple-grab
      clickable></a-box>
       <a-light type="ambient" color="#888"></a-light>
      <a-light type="directional" color="#fff" intensity="1" position="-1 2 1"></a-light>
      <a-entity
        gltf-model="#bougie"
        scale="1 1 1"
      ></a-entity>
      <a-entity
        gltf-model="#indice"
        scale="1 1 1"
      ></a-entity>
      <a-entity
        gltf-model="#character"
        scale="1 1 1"
      ></a-entity>

      <!-- Objet Torch tenable et illuminant avec des flammes animées -->
      <a-entity
  gltf-model="#torch"
  scale="1 1 1"
  simple-grab
  clickable
>
  <!-- Lumière de la torche avec un scintillement naturel -->
  <a-entity 
    light="type: point; color: #FFA500; intensity: 4; distance: 30;" 
    position="0 0.6 0"
    flicker-light="minIntensity: 1.5; maxIntensity: 2.8; minDuration: 300; maxDuration: 800">
  </a-entity>

  <!-- Effet de particules en mode "fire" pour des flammes réalistes -->
  <a-entity
    particle-system="preset: fire; particleCount: 150; size: 0.15; opacity: 0.8; 
                     accelerationValue: 0 1 0; velocityValue: 0 2 0; positionSpread: 0.1 0.2 0.1;"
    position="0 0.6 0">
  </a-entity>
</a-entity>

    </template>

    <TheCameraRig 
    ></TheCameraRig>

  </a-scene>
</template>
