import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';
import * as CANNON from 'cannon-es';

// --------------Three Js setup ----------------
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a plane as the ground
const planeGeometry = new THREE.PlaneGeometry(10, 10);
const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = Math.PI / 2;
scene.add(plane);

// Create a box as a wall
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const box = new THREE.Mesh(boxGeometry, boxMaterial);
box.position.y = 0.5;
scene.add(box);

// Set up physics world
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);

// Add ground plane as a static body
const groundShape = new CANNON.Plane();
const groundBody = new CANNON.Body({ mass: 0 });
groundBody.addShape(groundShape);
world.addBody(groundBody);

// Add box as a static body
const boxShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
const boxBody = new CANNON.Body({ mass: 0 });
boxBody.addShape(boxShape);
boxBody.position.y = 0.5;
world.addBody(boxBody);

// Add camera as a dynamic body
const cameraShape = new CANNON.Sphere(0.25);
const cameraBody = new CANNON.Body({ mass: 1 });
cameraBody.addShape(cameraShape);
cameraBody.position.y = 1;
world.addBody(cameraBody);

// Enable keyboard controls for camera movement
const keyboard = {};
const moveSpeed = 0.1;

function handleKeyDown(event) {
  keyboard[event.code] = true;
}

function handleKeyUp(event) {
  keyboard[event.code] = false;
}

document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

// Pointer lock controls for camera look
const controls = {
  pitch: 0,
  yaw: 0
};

function handleMouseMove(event) {
  controls.yaw -= event.movementX * 0.002;
  controls.pitch -= event.movementY * 0.002;
  controls.pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, controls.pitch));
}

function lockPointer() {
  pointerControls.lock();
}

document.addEventListener('mousemove', handleMouseMove);
document.addEventListener('click', lockPointer);

// Add pointer lock controls
const pointerControls = new PointerLockControls(camera, document.body);
scene.add(pointerControls.getObject());

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Move camera based on keyboard input
  const force = new CANNON.Vec3();
  if (keyboard['ArrowUp'] || keyboard['KeyW']) {
    const forward = new THREE.Vector3();
    pointerControls.getDirection(forward);
    forward.y = 0;
    forward.normalize();
    force.z = -moveSpeed;
  }
  if (keyboard['ArrowDown'] || keyboard['KeyS']) {
    const backward = new THREE.Vector3();
    pointerControls.getDirection(backward);
    backward.y = 0;
    backward.normalize();
    force.z = moveSpeed;
  }
  if (keyboard['ArrowLeft'] || keyboard['KeyA']) {
    const left = new THREE.Vector3();
    pointerControls.getDirection(left);
    left.cross(camera.up);
    left.y = 0;
    left.normalize();
    force.x = -moveSpeed;
  }
  if (keyboard['ArrowRight'] || keyboard['KeyD']) {
    const right = new THREE.Vector3();
    pointerControls.getDirection(right);
    right.cross(camera.up);
    right.y = 0;
    right.normalize();
    force.x = moveSpeed;
  }
  // cameraBody.velocity.copy(force);

  // Prevent camera from falling through the plane
  const minY = 0.5;
  if (cameraBody.position.y < minY) {
    cameraBody.position.y = minY;
    // cameraBody.velocity.y = 0;
  }

  // Check collision between camera and box
  const result = new CANNON.RaycastResult();
  const from = camera.position.clone();
  const to = camera.position.clone().add(camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(0.1));

  world.raycastAny(from, to, { skipBackfaces: true }, result);

  if (result.hasHit) {
    const distance = result.distance;
    if (distance < 0.1) {
      const separation = 0.1 - distance;
      const correction = camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(separation);
      // cameraBody.velocity.sub(correction);
    }
  }

  // Apply rotation to camera
  camera.rotation.order = 'YXZ';
  camera.rotation.y = controls.yaw;
  camera.rotation.x = controls.pitch;

  // Update physics simulation
  world.step(1 / 60);

  // Update camera position
  camera.position.copy(cameraBody.position);

  // Render the scene
  renderer.render(scene, camera);
}

animate();
