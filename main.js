import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00FF00 });
const box = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(box);

camera.position.set(0, 1.5, 0);

const controls = new PointerLockControls(camera, document.body);
scene.add(controls.getObject());

function handleKeyDown(event) {
  // Handle keyboard controls for movement
  switch (event.code) {
    case 'KeyW':
      controls.moveForward(0.5);
      break;
    case 'KeyS':
      controls.moveForward(-.5);
      break;
    case 'KeyA':
      controls.moveRight(-.5);
      break;
    case 'KeyD':
      controls.moveRight(.5);
      break;
  }
}

document.addEventListener('keydown', handleKeyDown);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();