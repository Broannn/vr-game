<script setup>
import { ref } from 'vue';

import TheCameraRig from './TheCameraRig.vue';


// Import des composants A-Frame personnalisés
import '../aframe/simple-grab.js';
import '../aframe/outline.js';
import '../aframe/flicker-light.js';
import '../aframe/listen-to.js';
import '../aframe/event-set.js';
import '../aframe/torch-sound.js';
import '../aframe/super-keyboard.js';
import '../aframe/simple-navmesh-constraint.js';
import '../aframe/quitgame.js'
import '../aframe/quitgame-listener.js'
import '../aframe/emit-when-near.js'


const enteredCode = ref("");

// --------------
// (POINT 3) Vérifier que les assets sont bien chargés
// avant de sélectionner #leveldoor :
const allAssetsLoaded = ref(false);

const handleKeyboardInput = (event) => {
  // Vérifier qu'on n'essaie pas de manipuler la porte
  // tant que la scène n'est pas prête.
  if (!allAssetsLoaded.value) {
    console.log("❌ Les assets ne sont pas encore chargés, porte introuvable !");
    return;
  }

  const input = event.detail.value;
  enteredCode.value = input;
  
  console.log("Code entré : ", input); // DEBUG
  
  if (input === "96") {
  console.log("✅ Code correct entré: " + input);

  // 1) Activer la zone derrière la porte
  const behindDoor = document.querySelector('#behind-door-navmesh');
  behindDoor.setAttribute('data-role', 'nav-mesh');
  behindDoor.classList.add('navmesh');

  // 2) Forcer simple-navmesh-constraint à rescanner
  const navComp = document.querySelector('#head').components['simple-navmesh-constraint'];
  navComp.entitiesChanged = true;

  // 3) (Optionnel) Forcer blink-controls à rescanner
  const blinkComp = document.querySelector('#hand-left').components['blink-controls'];
  if (blinkComp && blinkComp.queryCollisionEntities) {
    blinkComp.queryCollisionEntities();
  }
  // 3) Animer la porte
  const doorElement = document.querySelector('#leveldoor');
  if (doorElement) {
    doorElement.setAttribute('animation', {
      property: 'position',
      to: '12.000 -3.920 -4.760',
      dur: 3000,
      easing: 'easeInOutQuad'
    });
    doorElement.setAttribute(
      'sound',
      'src: url(assets/dooropen.mp3); autoplay: true; volume: 1'
    );
  }
}


};

// (POINT 1 + 2) : On utilise defineProps pour "scale" et "overlaySelector",
// c'est inchangé dans ton code, sauf qu'on a renommé l'ID de l'asset.
defineProps({
  scale: Number,
  overlaySelector: String,
});
</script>

<template>
  <!-- Scène A-Frame -->
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
    <!-- Son d'ambiance, inchangé -->
    <a-entity
      sound="src: url(assets/ambiance.mp3); autoplay: true; loop: true; volume: 2; positional: false"
    ></a-entity>

    <!-- (POINT 3) On met @loaded="allAssetsLoaded = true" 
         pour n'afficher la suite qu'après chargement. -->
    <a-assets @loaded="allAssetsLoaded = true">
      <!-- (POINT 1) RENOMMÉ l'asset de la porte en 'doormodel' -->
      <a-asset-item
        id="level"
        src="assets/egypt_chamber_for_ar__vr_games/pyramidesansporte.glb"
      ></a-asset-item>
      <a-asset-item
        id="doormodel"
        src="assets/egypt_chamber_for_ar__vr_games/door.glb"
      ></a-asset-item>

      <!-- Le reste de tes assets identiques -->
      <a-asset-item id="character" src="assets/mummy_character/scene.gltf"></a-asset-item>
      <a-asset-item id="torch" src="assets/torch/scene.gltf"></a-asset-item>
      <a-asset-item id="bougie" src="assets/bougies/scene.gltf"></a-asset-item>
      <a-asset-item id="bougiesolo" src="assets/bougiesolo/scene.gltf"></a-asset-item>
      <a-asset-item id="indice" src="assets/indice/indice.glb"></a-asset-item>
      <a-asset-item id="indice2" src="assets/indice/indice2.glb"></a-asset-item>
      <a-asset-item id="code_pad" src="assets/code_pad/scene.gltf"></a-asset-item>
      
      <img id="room-physic-out-texture" :src="`assets/main-room-from-physic-room.png`">
      <img id="room-gol-out-texture" :src="`assets/main-room-from-gol-room.png`">
      <img id="room-physic-texture" :src="`assets/physicRoom.png`">
    </a-assets>

    <!-- N'affiche le contenu qu'une fois que allAssetsLoaded est true -->
    <template v-if="allAssetsLoaded">
      <a-entity id="navmesh">
        <a-entity
          class="navmesh"
          data-role="nav-mesh"
          geometry="primitive: plane; width: 15; height: 15"
          material="color: green; opacity: 0; shader: flat;"
          rotation="-90 0 0"
          position="0.590 -1 -3.700"
          scale="0.870 0.810 1.070"  
        ></a-entity>
        <a-entity
          geometry="primitive: plane; width: 15; height: 15"
          data-role="nav-mesh"
          class="navmesh"
          material="color: green; opacity: 0; shader: flat;"
          rotation="-90 0 0"
          position="5.540 -1 -11.100"
          scale="0.090 0.190 0.400"  
        ></a-entity>
        <a-entity
          id="behind-door-navmesh"
          geometry="primitive: plane; width: 15; height: 15"
          material="color: green; opacity: 0; shader: flat;"
          rotation="-90 0 0"
          position="0.250 -1 -15.800"
          scale="0.060 0.260 0.400"  
        ></a-entity>
        <a-entity
          geometry="primitive: plane; width: 15; height: 15"
          data-role="nav-mesh"
          class="navmesh"
          material="color: green; opacity: 0; shader: flat;"
          rotation="-90 0 0"
          position="-4.680 -1 -11.100"
          scale="0.090 0.190 0.400"  
        ></a-entity>
        <a-entity
          geometry="primitive: plane; width: 15; height: 15"
          data-role="nav-mesh"
          class="navmesh"
          material="color: green; opacity: 0; shader: flat;"
          rotation="-90 0 0"
          position="0.590 -1 -13.340"
          scale="0.800 0.140 1.100"  
        ></a-entity>
        <a-entity
          geometry="primitive: plane; width: 15; height: 15"
          data-role="nav-mesh"
          class="navmesh"
          material="color: green; opacity: 0; shader: flat;"
          rotation="-90 0 0"
          position="0.590 -1 -13.290"
          scale="1.120 0.040 1.110"  
        ></a-entity>
        <a-entity
          geometry="primitive: plane; width: 5; height: 15"
          data-role="nav-mesh"
          class="navmesh"
          material="color: green; opacity: 0; shader: flat;"
          rotation="-90 0 0"
          position="0.700 -1 7.050"
          scale="0.240 0.930 0.990"  
        ></a-entity>

    </a-entity>
      <!-- Niveau principal (pyramide) -->
      <a-entity
        gltf-model="#level"
        scale="0.005 0.005 0.005"
        position="13.070 -3.920 -4.760"
      ></a-entity>

      <!-- (POINT 2) Entité porte, ID UNIQUE 'leveldoor' et gltf-model="#doormodel" -->
      <a-entity
        id="leveldoor"
        gltf-model="#doormodel"
        scale="0.005 0.005 0.005"
        position="13.070 -3.920 -4.760"
      ></a-entity>

      <!-- Lights et bougies (inchangés)   
      <a-light type="ambient" color="#888"></a-light>
      <a-light type="directional" color="#fff" intensity="1" position="-1 2 1"></a-light>-->
    
      <a-entity gltf-model="#bougie" position="1.900 -1.160 0" scale="2 2 2">
        <a-entity
          light="type: point; color: #FFA500; intensity: 1; distance: 3; decay: 2;"
          position="0 0.6 0"
          flicker-light="minIntensity: 0.8; maxIntensity: 1.2; minDuration: 200; maxDuration: 700"
        ></a-entity>
      </a-entity>

      <a-entity gltf-model="#bougie" position="-5.770 -1.160 -9.450" scale="2 2 2">
        <a-entity
          light="type: point; color: #FFA500; intensity: 1; distance: 3; decay: 2;"
          position="0 0.6 0"
          flicker-light="minIntensity: 0.8; maxIntensity: 1.2; minDuration: 200; maxDuration: 700"
        ></a-entity>
      </a-entity>

      <a-entity gltf-model="#bougiesolo" position="-0.880 -1.060 -7.490" scale="0.1 0.1 0.1">
        <a-entity
          light="type: point; color: #FFA500; intensity: 1; distance: 3; decay: 2;"
          position="0 7.410 0"
          flicker-light="minIntensity: 0.8; maxIntensity: 1.2; minDuration: 200; maxDuration: 700"
        ></a-entity>
      </a-entity>

      <a-entity gltf-model="#bougiesolo" position="3.930 -1.060 -12.050" scale="0.1 0.1 0.1">
        <a-entity
          light="type: point; color: #FFA500; intensity: 1; distance: 3; decay: 2;"
          position="0 7.410 0"
          flicker-light="minIntensity: 0.8; maxIntensity: 1.2; minDuration: 200; maxDuration: 700"
        ></a-entity>
      </a-entity>

      <a-entity gltf-model="#bougiesolo" position="-8.340 0.160 -13.310" scale="0.07 0.07 0.07">
        <a-entity
          light="type: point; color: #FFA500; intensity: 0.182; distance: 2.180; decay: 1.900;"
          position="0 1.910 0"
          flicker-light="minIntensity: 0.8; maxIntensity: 1.2; minDuration: 200; maxDuration: 700"
        ></a-entity>
      </a-entity>

      <!-- Indices -->
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

      <!-- Clavier (super-keyboard) -->
      <a-entity
        id="keyboard"
        class="clickable"
        super-keyboard="
          hand: [cursor];
          filters: numbers;
          model: numpad;
          align: center;
          maxLength: 2;
          multipleInputs: false;
        "
        @superkeyboardinput="handleKeyboardInput"
        position="1.230 0.800 -14.680"
        rotation="0 0 0"
      ></a-entity>

      <!-- Torche (inchangé) -->
      <a-entity
        id="torch-container"
        simple-grab
        clickable
        geometry="primitive: cylinder; height: 1; radius: 0.1;"
        material="shader: flat; color: #FFA500; opacity: 0"
        scale="0.5 0.5 0.5"
        position="1.550 1.300 11.090"
        rotation="0 0 17.000"
        sound="src: url(assets/fire.mp3); autoplay: false; loop: true; volume: 0.3"
        torch-sound
      >
        <a-entity
          id="torch-model"
          gltf-model="#torch"
          position="0 -0.950 0"
          scale="0.20 0.20 0.20"
          animation-mixer="clip: Burning; loop: repeat"
          outline-on-event
          listen-to__grab="target: #torch-container; event: grab; emit: taken"
          listen-to__drop="target: #torch-container; event: drop; emit: untaken"
          event-set__taken_rotation="event:taken; attribute: rotation; value: 0 90 300"
          event-set__untaken_rotation="event:untaken; attribute: rotation; value: 0 0 17.000"
          event-set__taken_position="event: taken; attribute: position; value: 0.010 -0.200 0.350"
          event-set__untaken_position="event: untaken; attribute: position; value: 0 0 0"
          event-set__taken_scale="event:taken; attribute: scale; value: 0.09 0.09 0.09"
          event-set__untaken_scale="event: untaken; attribute: scale; value: 0.09 0.09 0.09"
        >
            <a-entity
            light="type: point; color: #FFA500; intensity: 5; distance: 10;"
            position="-0.130 11.190 0"
            flicker-light="minIntensity: 3; maxIntensity: 4.5; minDuration: 300; maxDuration: 800"
            event-set__taken="position: -3.630 7.500 -2.230; parent: #torch-model"
            event-set__untaken="position: 0 11.190 0; parent: #torch-model"
            ></a-entity>
        </a-entity>
      </a-entity>

     <!-- LE TRIGGER : -->
     <a-entity
        id="end-trigger"
        geometry="primitive: box; width: 2; height: 3; depth: 2"
        material="opacity: 0; color: red; wireframe: true"
        position="0.340 1 -18.260"
        scale="0.7 1 0.120"
        emit-when-near="target: #torch-container; distance: 2; event: quitgame;"
        quitgame-listener="event: quitgame; time: ;"
      ></a-entity>
    </template>

    <!-- Rig de la caméra -->
    <TheCameraRig 
    position="0.665 -1 12.7"
    ></TheCameraRig>
  </a-scene>
</template>
