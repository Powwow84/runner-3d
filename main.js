import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';
import * as CANNON from 'cannon-es'




// --------------Three Js setup ----------------
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000 )

// const orbit = new OrbitControls(camera, renderer.domElement)

camera.position.set(0, 2, 10)
// orbit.update()

//  Cannon Declaration the rest of the asset building will be with its three js counter part
const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.81, 0)
})


// --------Controls -----------

const controls = new PointerLockControls(camera, document.body);
scene.add(controls.getObject());

// Event listener to start the pointer lock when user clicks the scene
document.body.addEventListener('click', () => {
  controls.lock();
});

function checkCollisionForMove(object, direction, amount) {
  // Calculate the target position based on the movement amount and direction
  const targetPosition = object.position.clone().add(direction.clone().multiplyScalar(amount));

  // Perform collision detection by casting a ray from the object's current position to the target position
  const raycaster = new THREE.Raycaster(object.position, direction);
  const intersects = raycaster.intersectObjects(scene.children, true);

  // Check if any intersection occurs and determine if the target position is obstructed
  for (let i = 0; i < intersects.length; i++) {
    const intersection = intersects[i];
    if (intersection.object !== object) {
      return true; // Collision detected, movement is blocked
    }
  }

  return false; // No collision detected, movement is allowed
}

// Event listener to handle mouse movements and update camera rotation
document.addEventListener('mousemove', (event) => {
  if (controls.isLocked) {
    const movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    const movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

    // Update camera rotation based on mouse movements
    controls.updateRotation(movementX, movementY);
  }
});

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;

// Event listeners to handle keydown and keyup events for movement
document.addEventListener('keydown', (event) => {
  switch (event.code) {
    case 'KeyW':
      moveForward = true;
      break;
    case 'KeyS':
      moveBackward = true;
      break;
    case 'KeyA':
      moveLeft = true;
      break;
    case 'KeyD':
      moveRight = true;
      break;
  }
});

document.addEventListener('keyup', (event) => {
  switch (event.code) {
    case 'KeyW':
      moveForward = false;
      break;
    case 'KeyS':
      moveBackward = false;
      break;
    case 'KeyA':
      moveLeft = false;
      break;
    case 'KeyD':
      moveRight = false;
      break;
  }
});

function updateMovement() {
  const movementSpeed = 0.001; // Adjust the movement speed as needed

  // Update the position of the controls object based on the keyboard input
  if (moveForward && !checkCollisionForMove(camera, camera.getWorldDirection(new THREE.Vector3()), movementSpeed)) {
    controls.moveForward(movementSpeed);
  }
  if (moveBackward && !checkCollisionForMove(camera, camera.getWorldDirection(new THREE.Vector3()).negate(), movementSpeed)) {
    controls.moveForward(-movementSpeed);
  }
  if (moveLeft && !checkCollisionForMove(camera, camera.getWorldDirection(new THREE.Vector3()).cross(new THREE.Vector3(0, 1, 0)), movementSpeed)) {
    controls.moveRight(-movementSpeed);
  }
  if (moveRight && !checkCollisionForMove(camera, camera.getWorldDirection(new THREE.Vector3()).cross(new THREE.Vector3(0, -1, 0)), movementSpeed)) {
    controls.moveRight(movementSpeed);
  }
}





// ------------------Plane --------------

const planeGeometry = new THREE.PlaneGeometry(30, 30)
const planeMaterial = new THREE.MeshBasicMaterial({ color : 0xFFFFFF})
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
scene.add(plane)
plane.rotation.x = -0.5* Math.PI

const planePhysicsMat = new CANNON.Material()
const planeBody = new CANNON.Body({
  shape: new CANNON.Plane(),
  mass: 0,
  material: planePhysicsMat
})
world.addBody(planeBody)
planeBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0) 

// ----------------------Box -------------------

const boxGeo = new THREE.BoxGeometry(2 ,2 ,2)
const boxMat = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
})
const boxMesh = new THREE.Mesh(boxGeo, boxMat)
scene.add(boxMesh)

const boxPhysicsMat = new CANNON.Material()

const boxBody = new CANNON.Body({
  mass: 1,
  shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
  position: new CANNON.Vec3(1, 2, 0),
  material: boxPhysicsMat,
});
world.addBody(boxBody);

// Disable collision between cameraBody and boxBody



//----------------------Camera --------

const cameraPhysicsMat = new CANNON.Material()

const cameraBody = new CANNON.Body({
  mass:1,
  shape: new CANNON.Sphere(2),
  material: cameraPhysicsMat
})
world.addBody(cameraBody)
cameraBody.position.set(0,0,10)

const cameraBoxContactMat = new CANNON.ContactMaterial(
  cameraPhysicsMat,
  boxPhysicsMat,
  { friction: 0.0, restitution: 0.0 }
);
world.addContactMaterial(cameraBoxContactMat);

const cameraBoxDistanceConstraint = new CANNON.DistanceConstraint(
  boxBody,
  cameraBody,
  0,
  1
);
world.addConstraint(cameraBoxDistanceConstraint);


// cameraBody.collisionFilterGroup = 1;   // Group 1 for cameraBody
// cameraBody.collisionFilterMask = 2;    // Collide with objects in group 2
// boxBody.collisionFilterGroup = 2;      // Group 2 for boxBody
// boxBody.collisionFilterMask = 0;


// ----------Animation loop----------

const timeStep = 1/60.0

function animate() {
  // Step the physics simulation
  world.step(timeStep);
  updateMovement();

  cameraBody.position.copy(controls.getObject().position);
  cameraBody.quaternion.copy(controls.getObject().quaternion);


  // camera.position.copy(cameraBody.position);
  // camera.quaternion.copy(cameraBody.quaternion);

  // Update the position and rotation of the plane mesh based on the plane body
  plane.position.copy(planeBody.position);
  plane.quaternion.copy(planeBody.quaternion);

  boxMesh.position.copy(boxBody.position)
  boxMesh.quaternion.copy(boxBody.quaternion)

  // Render the scene
  renderer.render(scene, camera);

  // Request the next animation frame
  requestAnimationFrame(animate);
}

renderer.setAnimationLoop(animate)

window.addEventListener('resize', function(){
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})