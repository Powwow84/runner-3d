import * as THREE from 'three';
import {PointerLockControls} from 'three/examples/jsm/controls/PointerLockControls';
import * as CANNON from 'cannon-es';
import maze from './mapArray';
import CannonDebugger from 'cannon-es-debugger';

// --------------Three Js setup ----------------
// Set up renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.domElement.requestPointerLock = renderer.domElement.requestPointerLock || renderer.domElement.mozRequestPointerLock;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // Enable shadow mapping
document.body.appendChild(renderer.domElement);

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1, 0);
// Create a scene
const scene = new THREE.Scene();

// Add OrbitControls
// const orbitControls = new OrbitControls(camera, renderer.domElement);
// orbitControls.update()

// ----------------------------Files---------------------------------

// const bgMusic = new Audio('public/music/tunetank.com_5196_secrets-of-the-house-on-the-hill_by_rage-sound.mp3')
// const sfx = new Audio('public/music/661499__het_hckm_ds_huis__mortality-boring-death-dying-clock-tick-tock-klok-tik-tak-incl-20-hertz-sometimes-02-01.mp3')
// // bgMusic.play()

// const playSfx = () =>
// {
//   sfx.play
// }
// --------------Cannon ES Set up ----------------------------

const world = new CANNON.World()
// world.broadphase = new CANNON.SAPBroadphase(world)
// world.allowsleep = true
world.gravity.set(0, -9.82, 0)

// ---------------------Generate default material-----

const defaultMaterial = new CANNON.Material('default')
const defaultContactMaterial = new CANNON.ContactMaterial(
  defaultMaterial,
  defaultMaterial,
  {
    friction: 0.009,
    restitution: 0
  }
)
world.addContactMaterial(defaultContactMaterial)
world.defaultContactMaterial = defaultContactMaterial

// ----------------Creating a camera and body---------------
const cameraBody = new CANNON.Body({
  mass: 1,
  shape: new CANNON.Box(new CANNON.Vec3(.5, .5, .5)),
  fixedRotation: true
  // type: 4
})
world.addBody(cameraBody)
cameraBody.position.set(0, 1, 0)

// Create a plane
const planeGeometry = new THREE.PlaneGeometry(10, 10);
const planeMaterial = new THREE.MeshPhongMaterial({ color: 0xeeeeee });
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
planeMesh.receiveShadow = true; // Enable shadow casting on the plane
scene.add(planeMesh);
planeMesh.rotation.x = -0.5* Math.PI

const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body()
floorBody.mass = 0
floorBody.addShape(floorShape)
floorBody.quaternion.setFromAxisAngle(
  new CANNON.Vec3(-1, 0, 0),
  Math.PI * .5
)
world.addBody(floorBody)


// Create lighting
const ambientLight = new THREE.AmbientLight(0x404040); // Ambient light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Directional light
directionalLight.position.set(0, 10, 0);
directionalLight.castShadow = true; // Enable shadow casting from the light
scene.add(directionalLight);


// ----------------Utilities-----------

const objectsToUpdate = []

// create box's
const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
const boxMaterial = new THREE.MeshStandardMaterial({
  metalness:0.3,
  roughness: 0.1,
})


const createBox = (width, height, depth, position) => {
  // threejs mesh
  const mesh = new THREE.Mesh(boxGeometry, boxMaterial);
  mesh.scale.set(width, height, depth);
  mesh.castShadow = true;
  mesh.position.copy(position);
  scene.add(mesh);

  // cannon shapes
  const shape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2));
  const body = new CANNON.Body({
    mass: 10, //0.000001,
    type: 2,
    position: new CANNON.Vec3(0, 0, 0),
    shape: shape,
    material: new CANNON.Material() // Using CANNON.Material directly
  });
  body.position.copy(position);
  // body.addEventListener('collide', playSfx) example to use when we are doing the win condition
  world.addBody(body);

  // save in objects to update
  objectsToUpdate.push({
    mesh: mesh,
    body: body
  });
};

function createMaze() {
  // Dimensions of the maze
  const numRows = maze.length;
  const numCols = maze[0].length;

  // Size of each cell in the maze
  const cellSize = 2;

  // Calculate the adjusted spacing between each box
  const adjustedSpacing = (cellSize - 0.5) / 2;

  // Starting position of the maze
  const startX = -((numCols - 1) * cellSize) / 2 + adjustedSpacing;
  const startZ = -((numRows - 1) * cellSize) / 2 + adjustedSpacing;

  // Create boxes based on maze layout
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      if (maze[row][col] === 1) { // Flip condition from 0 to 1
        const positionX = startX + col * cellSize;
        const positionZ = startZ + row * cellSize;
        createBox(2, 6, 2, { x: positionX, y: 0, z: positionZ });
      }
    }
  }
}

createMaze();



// ------------------------------Cnntrols--------------

const controls = new PointerLockControls(camera, document.body);

// Event listener to start the pointer lock when user clicks the scene
document.body.addEventListener('click', () => {
  controls.lock();
});

// Event listener to handle mouse movements and update camera rotation
document.addEventListener('mousemove', (event) => {
  if (controls.isLocked) {
    const movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    const movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

    // Update camera rotation based on mouse movements
    // controls.updateRotation(movementX, movementY);
  }
});

document.addEventListener('pointerlockchange', () => {
  console.log(controls.isLocked)
  // controls.isLocked = document.pointerLockElement === renderer.domElement;
});

document.addEventListener('mozpointerlockchange', () => {
  // controls.isLocked = document.mozPointerLockElement === renderer.domElement;
});

const keys = {w: false, a: false, s: false, d: false}

document.addEventListener('keydown', function (event) {
  switch (event.code) {
    case 'KeyW':
      keys['w'] = true
      break;
    case 'KeyS':
      keys['s'] = true
      break;
    case 'KeyA':
      keys['a'] = true
      break;
    case 'KeyD':
      keys['d'] = true
      break;
  }
})


document.addEventListener('keyup', function (event) {
  switch (event.code) {
    case 'KeyW':
      keys['w'] = false
      break;
    case 'KeyS':
      keys['s'] = false
      break;
    case 'KeyA':
      keys['a'] = false
      break;
    case 'KeyD':
      keys['d'] = false
      break;
  }
})





const clock = new THREE.Clock()
let oldElapsedTIme = 0

// Render loop
function animate() {

  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - oldElapsedTIme
  oldElapsedTIme = elapsedTime

  // sphereBody.applyForce(new CANNON.Vec3(-.05, 0, 0), sphereBody.position)

  // update physics world
  world.step(1/60, deltaTime, 3 )

  for(const object of objectsToUpdate) {
    object.mesh.position.copy(object.body.position)
  }
  // sphereMesh.position.copy(sphereBody.position)

  const force = 25
  if(keys['w']) {
    let input = new CANNON.Vec3(0, 0,  -force * deltaTime);
    const cameraRotation = controls.getObject().quaternion;
    const cam = new CANNON.Quaternion()
    cam.copy(cameraRotation)
    let world = cam.vmult(input)
    cameraBody.applyImpulse(world)
  } else if(keys['a']) {
    cameraBody.applyImpulse(new CANNON.Vec3(-force * deltaTime, 0,  0))
  } else if(keys['s']) {
    cameraBody.applyImpulse(new CANNON.Vec3(0, 0,  force * deltaTime))
  } else if(keys['d']) {
    cameraBody.applyImpulse(new CANNON.Vec3(force * deltaTime, 0,  0))
  }
  // cameraBody.position.copy(controls.getObject().position);
  // cameraBody.quaternion.copy(controls.getObject().quaternion);
  camera.position.copy(cameraBody.position);
  // camera.quaternion.copy(cameraBody.quaternion);​
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  
}
animate();

window.addEventListener('resize', function(){
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})
