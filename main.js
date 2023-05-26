import * as THREE from 'three';
import {PointerLockControls} from 'three/examples/jsm/controls/PointerLockControls';
import * as CANNON from 'cannon-es';
import maze from './mapArray';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import CannonDebugger from 'cannon-es-debugger';


// --------------Three Js setup ----------------

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.domElement.requestPointerLock = renderer.domElement.requestPointerLock || renderer.domElement.mozRequestPointerLock;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // Enable shadow mapping
document.body.appendChild(renderer.domElement);


// *************************Game Init


const gameInit = () => {
  
  // Create a camera
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 1, 0);
  // Create a scene
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x202020, 0, 7)
  
  const textureLoader = new THREE.TextureLoader()
// Add OrbitControls
// const orbitControls = new OrbitControls(camera, renderer.domElement);
// orbitControls.update()

// ----------------------------Files---------------------------------

const bgMusic = new Audio('https://res.cloudinary.com/dpxbrpprt/video/upload/v1685078423/Runner-3d%20audio/tunetank.com_5614_countdown-horror-trailer_by_audiotime_gybqpw.mp3')

const restartMusic = new Audio('https://res.cloudinary.com/dpxbrpprt/video/upload/v1685078424/Runner-3d%20audio/tunetank.com_5196_secrets-of-the-house-on-the-hill_by_rage-sound_l50pi9.mp3')

const winMusic = new Audio('https://res.cloudinary.com/dpxbrpprt/video/upload/v1685078423/Runner-3d%20audio/tunetank.com_5212_castle-in-the-village_by_rage-sound-02-02_h6dyef.mp3')

const loseSFX = new Audio('https://res.cloudinary.com/dpxbrpprt/video/upload/v1685078425/Runner-3d%20audio/133674__klankbeeld__horror-laugh-original-132802__nanakisan__evil-laugh-08_uuc1l8.wav')

const whoosh = new Audio('https://res.cloudinary.com/dpxbrpprt/video/upload/v1685078427/Runner-3d%20audio/683664__eponn__dark-bell-scary_mxrjhe.wav')

// -------------------Start Box-------------

const startBox = new THREE.BoxGeometry(.5 , .2 ,.2)
// const startButtonMaterial = new THREE.MeshStandardMaterial({ 
  // color: 0xffffff,
//   map: textureLoader.load('public/imgs/Untitled design/Ready.jpg')
// })
const startButtonMultiMaterial = [ 
  new THREE.MeshBasicMaterial({map: textureLoader.load('https://ucarecdn.com/755d63da-9342-446a-9c1a-e757354fda79/')}),
  new THREE.MeshBasicMaterial({map: textureLoader.load('https://ucarecdn.com/755d63da-9342-446a-9c1a-e757354fda79/')}),
  new THREE.MeshBasicMaterial({map: textureLoader.load('https://ucarecdn.com/755d63da-9342-446a-9c1a-e757354fda79/')}),
  new THREE.MeshBasicMaterial({map: textureLoader.load('https://ucarecdn.com/0de6ff0f-f657-4f5e-8ffa-ce6cb80e2345/')}),
  new THREE.MeshBasicMaterial({map: textureLoader.load('https://ucarecdn.com/bf044efc-9c3d-490e-bf06-4bb4fc058756/')}),
  new THREE.MeshBasicMaterial({map: textureLoader.load('https://ucarecdn.com/1e7ca8c9-c20d-4724-912a-c9541772cae6/')}),
]
const startButton = new THREE.Mesh(startBox, startButtonMultiMaterial)
scene.add(startButton)
startButton.position.set(0,.3,69)
startButton.rotation.x = Math.PI / -2
startButton.castShadow = true


//  ------------------- Restart Sphere -----------

const restartSphere = new THREE.SphereGeometry(2)
const restartMaterial = new THREE.MeshStandardMaterial({
map: textureLoader.load('https://ucarecdn.com/74754d08-1da8-404b-acdd-1d5538524333/'),
normalMap: textureLoader.load('https://ucarecdn.com/202822e4-9613-4918-98a7-f832061d8ae8/'),
fog: false
})
const restart = new THREE.Mesh(restartSphere, restartMaterial)
scene.add(restart)
restart.position.set(39, -3, -30);

// const ballLight = new THREE.DirectionalLight(0xffffff, .5); // Directional light
// ballLight.position.set(33, 0, -22);
// ballLight.castShadow = true; // Enable shadow casting from the light
// scene.add(ballLight);
// ballLight.target = restart

// const helper = new THREE.DirectionalLightHelper(ballLight);
// scene.add(helper);


const loader = new FontLoader();

loader.load( 'https://threejs.org/examples/fonts/optimer_bold.typeface.json', function ( font ){

	const fontgeometry = new TextGeometry( 'Runner', {
		font: font,
		size: 5,
		height: 0.3,
		curveSegments: 12,
		bevelEnabled: true,
		bevelThickness: 0,
		bevelSize: 0,
		bevelOffset: 0,
		bevelSegments: 0
	} );
  const fontMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  
  const textMesh = new THREE.Mesh(fontgeometry, fontMaterial);
  scene.add(textMesh);
  textMesh.position.set(-15, 2, 30);
  // textMesh.rotation.x = Math.PI / -2
} );

let threeD

loader.load( 'https://threejs.org/examples/fonts/optimer_bold.typeface.json', function ( font ){

	const fontgeometry = new TextGeometry( '3D', {
		font: font,
		size: 5,
		height: 0,
		curveSegments: 12,
		bevelEnabled: true,
		bevelThickness: 1,
		bevelSize: 0,
		bevelOffset: 0,
		bevelSegments: 1
	} );
  const fontMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000, fog: false });
  
  threeD = new THREE.Mesh(fontgeometry, fontMaterial);
  scene.add(threeD);
  threeD.position.set(9, 2, 30);
  // threeD.rotation.x = 0
} );

let lookMessage;

loader.load( 'https://threejs.org/examples/fonts/optimer_bold.typeface.json', function ( font ){

	const fontgeometry = new TextGeometry( 'Look Down!', {
		font: font,
		size: 5,
		height: 0,
		curveSegments: 12,
		bevelEnabled: true,
		bevelThickness: 1,
		bevelSize: 0,
		bevelOffset: 0,
		bevelSegments: 1
	} );
  const fontMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000, fog: false });
  
  lookMessage = new THREE.Mesh(fontgeometry, fontMaterial);
  scene.add(lookMessage);
  lookMessage.position.set(-18, -7, -15);
  // textMesh.rotation.x = 5.5
} );

let findText

loader.load( 'https://threejs.org/examples/fonts/optimer_bold.typeface.json', function ( font ){

	const fontgeometry = new TextGeometry( 'Find the exit', {
		font: font,
		size: 5,
		height: 0,
		curveSegments: 12,
		bevelEnabled: true,
		bevelThickness: 1,
		bevelSize: 0,
		bevelOffset: 0,
		bevelSegments: 1
	} );
  const fontMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 , fog: false});
  
  findText = new THREE.Mesh(fontgeometry, fontMaterial);
  scene.add(findText);
  findText.position.set(-18, -7, 0);
  findText.rotation.x = Math.PI / -2;
} );

let winner
loader.load( 'https://threejs.org/examples/fonts/optimer_bold.typeface.json', function ( font ){

	const fontgeometry = new TextGeometry( 'You Survived', {
		font: font,
		size: 2,
		height: 0,
		curveSegments: 12,
		bevelEnabled: true,
		bevelThickness: 1,
		bevelSize: 0,
		bevelOffset: 0,
		bevelSegments: 1
	} );
  const fontMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000, fog: false });
  
  winner = new THREE.Mesh(fontgeometry, fontMaterial);
  scene.add(winner);
  winner.position.set(16, -3, -30);
  
} );
loader.load( 'https://threejs.org/examples/fonts/optimer_bold.typeface.json', function ( font ){

	const fontgeometry = new TextGeometry( 'Game over. You ran out of time', {
		font: font,
		size: 4,
		height: 0,
		curveSegments: 9,
		bevelEnabled: false,
		bevelThickness: 1,
		bevelSize: 0,
		bevelOffset: 0,
		bevelSegments: 1
	} );
  const fontMaterial = new THREE.MeshBasicMaterial({ color: 0x39ff14 , fog : false });
  
  const textMesh = new THREE.Mesh(fontgeometry, fontMaterial);
  scene.add(textMesh);
  textMesh.position.set(-40, -20, 0);
  textMesh.rotation.x = Math.PI / 2;
  
} );

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
    friction: 0.001,
    restitution: .5
  }
)
world.addContactMaterial(defaultContactMaterial)
world.defaultContactMaterial = defaultContactMaterial

// ----------------Creating a camera and body---------------


const cameraBody = new CANNON.Body({
  mass: 1,
  shape: new CANNON.Box(new CANNON.Vec3(.2, .5, .1)),
  fixedRotation: true
  // type: 4
})
world.addBody(cameraBody)
cameraBody.position.set(0, 1, 70)



// -----------------Creating the cube texture for the world environment

const cubeTextureLoader = new THREE.CubeTextureLoader()
scene.background = cubeTextureLoader.load([

  'https://ucarecdn.com/d0269f89-0cdb-4433-b8e6-76b9e674648f/', //side3
  'https://ucarecdn.com/08d7d010-beda-49cd-b395-9f0992d17008/', //side1
  'https://ucarecdn.com/a8e0f013-b145-4e6e-811a-e129a57f1287/', //top
  'https://ucarecdn.com/ab8ae300-45c9-49f8-bd6a-a065a27b2d99/', //bottom
  'https://ucarecdn.com/07aca338-fd8d-4075-9632-b76cfd06d9ad/', //side4
  'https://ucarecdn.com/75808435-d003-4a96-8806-bbebdf8728b3/', //side2

])

// Create a plane
const planeGeometry = new THREE.BoxGeometry(100, 100, 15);
const planeMaterial = new THREE.MeshPhongMaterial({
  map: textureLoader.load('https://ucarecdn.com/a263e549-78a6-4a36-b3e1-1b9f29691fbd/'),
  normalMap: textureLoader.load('https://ucarecdn.com/8da6aa9f-a36b-4618-890f-6fa2fd28ace6/')
});
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
planeMesh.receiveShadow = true; // Enable shadow casting on the plane
scene.add(planeMesh);
planeMesh.rotation.x = -0.5 * Math.PI
planeMesh.position.set(0, -8, 0)

const floorBody = new CANNON.Body({
  shape:new CANNON.Box(new CANNON.Vec3(50,50, 0.1)),
  mass: 0
})
floorBody.quaternion.setFromAxisAngle(
  new CANNON.Vec3(-1, 0, 0),
  Math.PI * .5
)
world.addBody(floorBody)

// Create platform

const platformGeometry = new THREE.PlaneGeometry(10, 10);
const platformMaterial = new THREE.MeshPhongMaterial({
  map: textureLoader.load('https://ucarecdn.com/a263e549-78a6-4a36-b3e1-1b9f29691fbd/'),
  normalMap: textureLoader.load('https://ucarecdn.com/8da6aa9f-a36b-4618-890f-6fa2fd28ace6/') });
const platformMesh = new THREE.Mesh(platformGeometry, platformMaterial);
platformMesh.receiveShadow = true; // Enable shadow casting on the plane
platformMesh.position.set(0, 0, 70)
scene.add(platformMesh);
platformMesh.rotation.x = -0.5 * Math.PI

const platformBody = new CANNON.Body({
  shape:new CANNON.Box(new CANNON.Vec3(5,5, 0.1)),
  mass: 0
})
platformBody.quaternion.setFromAxisAngle(
  new CANNON.Vec3(-1, 0, 0),
  Math.PI * .5
)
world.addBody(platformBody)
platformBody.position.set(0, 0, 70)


// Create lighting
const ambientLight = new THREE.AmbientLight(0x404040);
ambientLight.intensity = .5 // Ambient light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, .2); // Directional light
directionalLight.position.set(-30, 40, 25);
directionalLight.castShadow = true; // Enable shadow casting from the light
scene.add(directionalLight);

directionalLight.shadow.camera.left = -30;   // Adjust left value
directionalLight.shadow.camera.right = 30;   // Adjust right value
directionalLight.shadow.camera.top = 30;     // Adjust top value
directionalLight.shadow.camera.bottom = -30;

// const helper = new THREE.DirectionalLightHelper(directionalLight);
// scene.add(helper);

// -----------Create an exit

const exitGeometry = new THREE.BoxGeometry(1, 2, 1)
const exitMaterial = new THREE.MeshStandardMaterial({
  map : textureLoader.load('https://ucarecdn.com/931fe6e8-be81-4f7a-b04c-0dc6905882be/'),
  normalMap: textureLoader.load('https://ucarecdn.com/86c2d86b-9157-4642-93a0-c51a1a4cc0da/')
})
const exit = new THREE.Mesh(exitGeometry, exitMaterial)
scene.add(exit)
exit.position.set(30.75, .5, -17.25)


// ----------------Utilities-----------

const objectsToUpdate = []

// create box's
const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
const boxMaterial = new THREE.MeshStandardMaterial({
  map: textureLoader.load('https://ucarecdn.com/43890b1b-e3a4-44a3-ac84-b2f44e31a2ff/'),
  normalMap: textureLoader.load('https://ucarecdn.com/8338da0a-94e7-447f-ba40-282028b4056f/') 
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
  const cellSize = 1;

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
        createBox(1, 3, 1, { x: positionX, y: 1, z: positionZ });
      }
    }
  }
}

createMaze();


// ------------Game timer --------------

let timer = 60;
let timerId
let timerMesh; // Declare textMesh outside the loader callback

function updateTimerText(font) {
  if (timerMesh) {
    scene.remove(timerMesh)
    timerMesh.geometry.dispose(); // Dispose the previous geometry
    timerMesh.material.dispose();
     // Dispose the previous geometry
   // Update the geometry of the text mesh
  }
}

const callTimer = () => {
  loader.load('https://threejs.org/examples/fonts/optimer_bold.typeface.json', function (font) {
  const fontMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000, fog: false });
  const fontgeometry = new TextGeometry(`${timer}`, {
    font: font,
    size: 10,
    height: 0,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 1,
    bevelSize: 0,
    bevelOffset: 0,
    bevelSegments: 1,
  });
  timerMesh = new THREE.Mesh(fontgeometry, fontMaterial);
  scene.add(timerMesh);
  timerMesh.position.set(-9, 30, 2);
  timerMesh.rotation.x = Math.PI / 2
  // if (cameraBody.position.z >= 70) {
  //   timerMesh.position.set(0,0,0)
  // }
});
}

const checkTime = () => {
  if (timer <= 0) {
    // timer = 60 //set in the startgame click function now
    cameraBody.position.set(0,-20,0)
    clearInterval(timerId)
    bgMusic.pause()
    bgMusic.currentTime =0
    restartMusic.pause()
    restartMusic.currentTime = 0
    loseSFX.play()
    // timerMesh.position.set(0, -1, 0);
  }
}

const countdown = () => {
  timerId = setInterval(function(){
    timer--
    updateTimerText();
    callTimer()
    checkTime()
  }, 1000)
}




// --------------------Restart FUnctions

renderer.domElement.addEventListener('click', function (event) {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(startButton);
  if (intersects.length > 0) {
    cameraBody.position.set(0, 50, 0)
    exit.position.set(30.75, .5, -17.25)
    winMusic.pause()
    winMusic.currentTime = 0
    bgMusic.play()
    bgMusic.loop = true
    lookMessage.position.set(-18, 45, -15)
    findText.position.set(-18, 20, 0);
    timer = 60
    countdown()
    setTimeout(function() {
      findText.position.set(-18, -7, 0);
      lookMessage.position.set(-18, -7, -15);
    }, 2000);
   
  }
});

renderer.domElement.addEventListener('click', function (event) {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(restart);
  if (intersects.length > 0) {
    winMusic.pause()
    winMusic.currentTime = 0
    cameraBody.position.set(-30, 50, 8)
    restartMusic.play()
    restartMusic.loop = true
    bgMusic.pause()
    timer = 60
    countdown()
    exit.position.set(30.75, .5, -17.25)
    winMusic.pause
  }
});

renderer.domElement.addEventListener('click', function (event) {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(exit);
  if (intersects.length > 0) {
    whoosh.play()
    winMusic.play()
    exit.position.set(30.75, 5, -17.25)
    bgMusic.pause()
    bgMusic.currentTime = 0
    clearInterval(timerId)
    restart.position.set(37.5, 3, -30);
    winner.position.set(18.5, 2, -30);
  }
});

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
  if (cameraBody.position.y <= -200) {
    cameraBody.position.set(0, 0.5, 70)
    cameraBody.velocity.set(0,0,0)
    if(timerMesh) {
      timerMesh.position.set(0,0,0)
    }
  }
  // sphereBody.applyForce(new CANNON.Vec3(-.05, 0, 0), sphereBody.position)

  // update physics world
  world.step(1/60, deltaTime, 3 )

  for(const object of objectsToUpdate) {
    object.mesh.position.copy(object.body.position)
  }
  // sphereMesh.position.copy(sphereBody.position)
  const force = 5;

if (keys['w'] && cameraBody.position.y <= 1) {
  let input = new CANNON.Vec3(0, 0, -force * deltaTime);
  const cameraRotation = controls.getObject().quaternion;
  const cam = new CANNON.Quaternion();
  cam.copy(cameraRotation);
  let world = cam.vmult(input);
  cameraBody.applyImpulse(world);
} else if (keys['a'] && cameraBody.position.y <= 3) {
  cameraBody.applyImpulse(new CANNON.Vec3(-force * deltaTime, 0, 0));
} else if (keys['s'] && cameraBody.position.y <= 3) {
  cameraBody.applyImpulse(new CANNON.Vec3(0, 0, force * deltaTime));
} else if (keys['d'] && cameraBody.position.y <= 3) {
  cameraBody.applyImpulse(new CANNON.Vec3(force * deltaTime, 0, 0));
}

  // cameraBody.position.copy(controls.getObject().position);
  // cameraBody.quaternion.copy(controls.getObject().quaternion);
  camera.position.copy(cameraBody.position);
  startButton.rotation.x += .005
  restart.rotation.y -= .003
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

}


gameInit()

// startScreen()