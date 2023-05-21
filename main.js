import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()
scene.background = cubeTextureLoader.load([
  'public/imgs/Untitled design/Untitled design (1).jpg',
  'public/imgs/Untitled design/Untitled design (1).jpg',
  'public/imgs/Untitled design/Untitled design (9).png',
  'public/imgs/Untitled design/Untitled design (1).jpg',
  'public/imgs/Untitled design/Untitled design (1).jpg',
  'public/imgs/Untitled design/Untitled design (1).jpg',
])

const planeGeometry = new THREE.PlaneGeometry(1000,1000)

const planeMaterial = new THREE.MeshBasicMaterial({
  map: textureLoader.load('public/imgs/Untitled design/pavement_04_disp_4k.png')
})
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
scene.add(plane)
plane.rotation.x = -0.5 * Math.PI

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00FF00 });
const box = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(box);
box.position.set(0,1,0)

const boxBoundingBox = new THREE.Box3().setFromObject(box);

camera.position.set(0, 1, 0);

const controls = new PointerLockControls(camera, document.body);
scene.add(controls.getObject());

document.body.addEventListener('click', () => {
  controls.lock();
});

// Event listener to handle mouse movements and update camera rotation
document.addEventListener('mousemove', (event) => {
  if (controls.isLocked) {
    const movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    const movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

    // Update camera rotation based on mouse movements
    controls.updateRotation(movementX, movementY);
  }
});

function handleKeyDown(event) {
  // Handle keyboard controls for movement
  switch (event.code) {
    case 'KeyW':
      controls.moveForward(1);
      break;
    case 'KeyS':
      controls.moveForward(-1);
      break;
    case 'KeyA':
      controls.moveRight(-1);
      break;
    case 'KeyD':
      controls.moveRight(1);
      break;
  }
}

document.addEventListener('keydown', handleKeyDown);

function animate() {
  requestAnimationFrame(animate);

  // Update camera bounding box
  controls.getObject().updateMatrixWorld();
  const cameraBoundingBox = new THREE.Box3().setFromObject(controls.getObject());

  // Check for collision
  const intersection = cameraBoundingBox.intersectsBox(boxBoundingBox);
  if (intersection) {
    // Collision occurred, trigger your action here
    console.log('Collision occurred!');
  }

  renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', function() {
  camera.aspect = window.innerWidth / this.window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})