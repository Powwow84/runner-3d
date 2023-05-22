import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import * as CANNON from 'cannon-es'

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




// const orbit = new OrbitControls(camera, renderer.domElement)
camera.position.set(0, 1, 3);
// orbit.update()

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

const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.81, 0)
})


// ****************** camera 
const cameraPhyMat = new CANNON.Material()

const cameraBody = new CANNON.Body({
  mass: 1,
  shape: new CANNON.Box(new CANNON.Vec3(.5,.5, .5)),
  material: cameraPhyMat
})
world.addBody(cameraBody)
cameraBody.position.set(0, 1, 3)


// ************************** plane

const groundPhysMat = new CANNON.Material()

const groundBody = new CANNON.Body({
  // shape: new CANNON.Plane(),
  // mass: 10, // giving this mass sends it falling down the y axis  since in our vec 3 we set it to -9.81
  shape: new CANNON.Box(new CANNON.Vec3(500 ,500 , 0.1)),
  type: CANNON.Body.STATIC,//static is the same as setting mass to 0
  material: groundPhysMat
})
world.addBody(groundBody)
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0) 

// ---------------------------------box

const boxPhysMat = new CANNON.Material()

const boxBody = new CANNON.Body({
  mass: 1,
  shape: new CANNON.Box(new CANNON.Vec3(1,1,1)),
  position: new CANNON.Vec3(1, 20, 0),
  material: boxPhysMat
})
world.addBody(boxBody)

boxBody.angularVelocity.set(0 ,10 ,0)
boxBody.angularDamping = 0.5

const groundBoxContactMat = new CANNON.ContactMaterial(
  groundPhysMat,
  boxPhysMat,
  {friction : 10}
  )
  
  world.addContactMaterial(groundBoxContactMat)

const groundCameraContactMat = new CANNON.ContactMaterial(
  groundPhysMat,
  cameraPhyMat,
  {restitution : 0.9}
)

world.addContactMaterial(groundCameraContactMat)


const timeStep = 1/60.0


function animate() {
  world.step(timeStep)

  // controls.update(); // Update the controls
  // camera.position.copy(controls.getObject().position);
  // camera.quaternion.copy(controls.getObject().quaternion);
  
  cameraBody.position.copy(controls.getObject().position);
  cameraBody.quaternion.copy(controls.getObject().quaternion);


  camera.position.copy(cameraBody.position);
  camera.quaternion.copy(cameraBody.quaternion);

  // camera.position.copy(cameraBody.position)
  // camera.quaternion.copy(cameraBody.quaternion)

  plane.position.copy(groundBody.position)
  plane.quaternion.copy(groundBody.quaternion)

  box.position.copy(boxBody.position)
  box.quaternion.copy(boxBody.quaternion)

 

  renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)

window.addEventListener('resize', function() {
  camera.aspect = window.innerWidth / this.window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})
