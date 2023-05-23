import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js'
import * as CANNON from 'cannon-es';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui'
import maze from './mapArray';


// --------------Three Js setup ----------------
// Set up renderer
// Three.js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Cannon.js setup
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);

// Create a plane
const planeGeometry = new THREE.PlaneGeometry(10, 10);
const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(planeMesh);

const planeShape = new CANNON.Plane();
const planeBody = new CANNON.Body({ mass: 0 });
planeBody.addShape(planeShape);
planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
world.addBody(planeBody);

// Create a box
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(boxMesh);

const boxShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
const boxBody = new CANNON.Body({ mass: 1 });
boxBody.addShape(boxShape);
boxBody.position.set(0, 2, 0);
world.addBody(boxBody);

// Set up controls
const controls = new THREE.PointerLockControls(camera, document.body);
scene.add(controls.getObject());

const velocity = new THREE.Vector3();
const moveForward = new THREE.Vector3();
const moveRight = new THREE.Vector3();

// Pointer lock setup
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    controls.unlock();
  }
});

document.addEventListener("pointerlockchange", function () {
  if (document.pointerLockElement === document.body) {
    controls.enabled = true;
  } else {
    controls.enabled = false;
  }
});

// Event listeners for movement
document.addEventListener("keydown", function (event) {
  if (event.key === "w") {
    velocity.z -= 0.1;
  } else if (event.key === "s") {
    velocity.z += 0.1;
  } else if (event.key === "a") {
    velocity.x -= 0.1;
  } else if (event.key === "d") {
    velocity.x += 0.1;
  }
});

document.addEventListener("keyup", function (event) {
  if (event.key === "w") {
    velocity.z = 0;
  } else if (event.key === "s") {
    velocity.z = 0;
  } else if (event.key === "a") {
    velocity.x = 0;
  } else if (event.key === "d") {
    velocity.x = 0;
  }
});

document.addEventListener("mousemove", function (event) {
  if (document.pointerLockElement === document.body) {
    const movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    const movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

    camera.rotation.y -= movementX * 0.002;
    camera.rotation.x -= movementY * 0.002;

    camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x));
  }
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Apply movement
  if (controls.enabled) {
    const time = performance.now() * 0.001;

    // Update box position
    boxBody.position.copy(boxMesh.position);
    boxBody.quaternion.copy(boxMesh.quaternion);

    // Update camera position
    velocity.y -= 9.82 * 0.02;
    controls.getObject().translateX(velocity.x * 0.02);
    controls.getObject().translateY(velocity.y * 0.02);
    controls.getObject().translateZ(velocity.z * 0.02);

    const delta = (time - prevTime) * 0.1;
    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;

    controls.getObject().position.y = Math.max(controls.getObject().position.y, 1);

    prevTime = time;
  }

  // Step the physics simulation
  world.step(1 / 60);

  // Render the scene
  renderer.render(scene, camera);
}

let prevTime = performance.now();
animate();