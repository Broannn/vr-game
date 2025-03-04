AFRAME.registerComponent('emit-when-near', {
  multiple: true,

  schema: {
    target: {type: 'selector', default: '[camera]'},
    distance: {type: 'number', default: 1},
    event: {type: 'string', default: 'click'},
    eventFar: {type: 'string', default: 'unclick'},
    throttle: {type: 'number', default: 100},
  },

  init: function () {
    // On appelle checkDist au maximum 1 fois/100ms (throttle)
    this.tick = AFRAME.utils.throttleTick(this.checkDist, this.data.throttle, this);
    this.emiting = false;
    this.myPos = new THREE.Vector3();
    this.targetPos = new THREE.Vector3();
  },

  checkDist: function () {
    // Positions globales
    this.el.object3D.getWorldPosition(this.myPos);
    this.data.target.object3D.getWorldPosition(this.targetPos);

    const distanceTo = this.myPos.distanceTo(this.targetPos);

    if (distanceTo <= this.data.distance) {
      // Proche
      if (this.emiting) return; // Déjà en collision
      this.emiting = true;
      // Émet l'événement local "event" (ex: nearTorch)
      this.el.emit(this.data.event, {collidingEntity: this.data.target}, false);
      this.data.target.emit(this.data.event, {collidingEntity: this.el}, false);
    } else {
      // Trop loin
      if (!this.emiting) return; // N'était pas en collision
      this.el.emit(this.data.eventFar, {collidingEntity: this.data.target}, false);
      this.data.target.emit(this.data.eventFar, {collidingEntity: this.el}, false);
      this.emiting = false;
    }
  },
});
