import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';
import * as CANNON from 'cannon-es';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui'
import maze from './mapArray';


// --------------Three Js setup ----------------
// Set up renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // Enable shadow mapping
document.body.appendChild(renderer.domElement);

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 20, 10);
// Create a scene
const scene = new THREE.Scene();

// Add OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);

// -------------------------------------------------------------

// --------------Cannon ES Set up ----------------------------

const world = new CANNON.World()
world.gravity.set(0, -9.82, 0)

// const concreteMaterial = new CANNON.Material('concrete')
// const plasticMaterial = new CANNON.Material('plastic')

const defaultMaterial = new CANNON.Material('default')
const defaultContactMaterial = new CANNON.ContactMaterial(
  defaultMaterial,
  defaultMaterial,
  {
    friction: 0.1,
    restitution: 0.7
  }
)
world.addContactMaterial(defaultContactMaterial)
world.defaultContactMaterial = defaultContactMaterial

// const concretePlasticContactMaterial = new CANNON.ContactMaterial(
//   concreteMaterial,
//   plasticMaterial,
//   {
//     friction: 0.1,
//     restitution: 1
//   }
// )
// world.addContactMaterial(concretePlasticContactMaterial)

// Create a plane
const planeGeometry = new THREE.PlaneGeometry(10, 10);
const planeMaterial = new THREE.MeshPhongMaterial({ color: 0xeeeeee });
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
planeMesh.receiveShadow = true; // Enable shadow casting on the plane
scene.add(planeMesh);
planeMesh.rotation.x = -0.5* Math.PI

const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body()
// floorBody.material = defaultContactMaterial
floorBody.mass = 0
floorBody.addShape(floorShape)
floorBody.quaternion.setFromAxisAngle(
  new CANNON.Vec3(-1, 0, 0),
  Math.PI * .5
)
world.addBody(floorBody)

// Create a sphere
// const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
// const sphereMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
// const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
// sphereMesh.position.set(0, 1, 0);
// sphereMesh.castShadow = true; // Enable shadow casting from the sphere
// scene.add(sphereMesh);

// const sphereShape = new CANNON.Sphere(1)
// const sphereBody = new CANNON.Body({
//   mass: 1,
//   position: new CANNON.Vec3(0, 10, 0),
//   shape: sphereShape,
//   // material: defaultContactMaterial
// })
// sphereBody.applyLocalForce(new CANNON.Vec3(150, 0, 0), new CANNON.Vec3(0, 0, 0))
// world.addBody(sphereBody)



// Create lighting
const ambientLight = new THREE.AmbientLight(0x404040); // Ambient light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Directional light
directionalLight.position.set(0, 10, 0);
directionalLight.castShadow = true; // Enable shadow casting from the light
scene.add(directionalLight);


// ----------------Utilities-----------

const objectsToUpdate = []


const createSphere = (radius, position) => {
  // threejs mesh
  const mesh = new THREE.Mesh(
    new THREE.SphereBufferGeometry(radius, 20, 20),
    new THREE.MeshStandardMaterial({
      metalness: 0.3,
      roughness: 0.4,
      // envMap: environmentMapTexture
    })
  )
  mesh.castShadow = true
  mesh.position.copy(position)
  scene.add(mesh)

  //  cannon shapes
  const shape = new CANNON.Sphere(radius)
  const body = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 3, 0),
    shape: shape,
    material: defaultMaterial
  })
  body.position.copy(position)
  world.addBody(body)

  // save in objects to update
  objectsToUpdate.push({
    mesh: mesh,
    body: body
  })
}

// createSphere(0.5, {x: 0, y: 3, z: 0})

function createMaze() {
  // Array representing the maze layout

  // Dimensions of the maze
  const numRows = maze.length;
  const numCols = maze[0].length;

  // Size of each cell in the maze
  const cellSize = 2;

  // Starting position of the maze
  const startX = -((numCols - 1) * cellSize) / 2;
  const startZ = -((numRows - 1) * cellSize) / 2;

  // Create spheres based on maze layout
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      if (maze[row][col] === 0) {
        const positionX = startX + col * cellSize;
        const positionZ = startZ + row * cellSize;
        createSphere(0.5, { x: positionX, y: 0, z: positionZ });
      }
    }
  }
}

createMaze()

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



  controls.update()
  requestAnimationFrame(animate);



  
  renderer.render(scene, camera);
}

animate();
