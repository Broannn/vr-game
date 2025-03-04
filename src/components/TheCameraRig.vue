<script setup>
  import '../aframe/disable-in-vr.js';
  import '../aframe/hide-in-vr.js';
  import '../aframe/simple-navmesh-constraint.js';
  import '../aframe/physx-grab.js';
  import '../aframe/blink-controls.js';
</script>

<template>
  <a-entity
    id="camera-rig"
    movement-controls="camera: #head; speed: 0.3;" 
    disable-in-vr="component: movement-controls;"
    physx-body="type: kinematic; shape: capsule; radius: 0.3; height: 2;"
  >

    <a-entity
      id="head"
      look-controls="pointerLockEnabled: true"
      simple-navmesh-constraint="navmesh: [data-role='nav-mesh']; height: 2;"
      camera
      position="0 2 0"
    >
      <a-entity
        geometry="primitive: circle; radius: 0.0003;"
        material="shader: flat; color: white;"
        cursor
        raycaster="far: 4; objects: [clickable]; showLine: false;"
        position="0 0 -0.1"
        hide-in-vr="hideInAR: false"
      ></a-entity>
      
      <a-entity
        id="dummy-hand-right"
        position="0.3 -0.4 -0.5"
      ></a-entity>
      <a-entity
        id="dummy-hand-left"
        position="-0.3 -0.4 -0.5"
      ></a-entity>
    </a-entity>

    <a-entity
    id="hand-left"
    hand-controls="hand: left"
    blink-controls="
    cameraRig: #camera-rig;
    teleportOrigin: #head;
    collisionEntities: [data-role='nav-mesh'];
    snapTurn: false;
  "
    >
      <a-sphere id="hand-left-collider"
        radius="0.02"
        visible="false"
        physx-body="type: kinematic; emitCollisionEvents: true">
      </a-sphere>
    </a-entity>

    <a-entity
      id="hand-right"
      hand-controls="hand: right"
      laser-controls="hand: right"
      raycaster="far: 4; objects: [clickable]; showLine: true;"
      position="0 1.5 0"
      physx-grab
    >
      <a-sphere id="hand-right-collider"
        radius="0.02"
        visible="false"
        physx-body="type: kinematic; emitCollisionEvents: true">
      </a-sphere>
    </a-entity>

  </a-entity>
</template>
