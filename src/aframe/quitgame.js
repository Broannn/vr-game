export function quitGame(time) {
 
    console.log('Exiting game...');
    const cameraRig = document.querySelector('#head');
    const text = document.createElement('a-text');
    text.setAttribute('id', 'quit-text');
    text.setAttribute('value', 'Congrats, you found the artefact of the ruined King! \n\nExiting game...');
    text.setAttribute('align', 'center');
    text.setAttribute('anchor', 'center');
    text.setAttribute('baseline', 'center');
    text.setAttribute('width', 2);
    text.setAttribute('wrapCount', 30);
    text.setAttribute('position', '0 0 -1.5');
    text.setAttribute('color', '#ffffff');
    text.setAttribute('opacity', 100);
    text.setAttribute('visible', true);
    text.setAttribute('font', 'mozillavr');
    text.setAttribute('scale', '0.5 0.5 0.5');
 
    // Add text to scene
    cameraRig.appendChild(text);
  
    // Set initial fog
    const scene = document.querySelector('a-scene');
    scene.setAttribute('fog', {
      type: 'exponential',
      color: '#000000',
      density: 0.0001
    });
  
    // Animate fog density
    scene.setAttribute('animation__fog', {
      property: 'fog.density',
      from: 0.0001,
      to: 2,
      dur: time,
      easing: 'easeInQuad'
    });
  
    // Exit VR and reload page after animation
    setTimeout(() => {
        
      if (document.querySelector('a-scene').is('vr-mode')) {
        document.querySelector('a-scene').exitVR();
      }
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }, time);
}
 