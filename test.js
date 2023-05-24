
// // test function for start position

// import * as THREE from 'three';
// import {PointerLockControls} from 'three/examples/jsm/controls/PointerLockControls';
// import * as CANNON from 'cannon-es';
// import maze from './mapArray';
// import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
// import { FontLoader } from 'three/addons/loaders/FontLoader.js';
// import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'


// let isStartScreenActive = true;
// let requestId;

// const renderer = new THREE.WebGLRenderer({ antialias: true });
// renderer.domElement.requestPointerLock = renderer.domElement.requestPointerLock || renderer.domElement.mozRequestPointerLock;
// renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.shadowMap.enabled = true; // Enable shadow mapping
// document.body.appendChild(renderer.domElement);


// // ----------------Start Screen Scene

// const startScreen = () => {
//   // Create a camera
// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// camera.position.set(0, 30, 40);
// camera.lookAt(new THREE.Vector3(0, 0, 0))
// // Create a scene
// const scene = new THREE.Scene();

// // Setup font ---------------------
// const loader = new FontLoader();

// loader.load( 'https://threejs.org/examples/fonts/optimer_bold.typeface.json', function ( font ){

// 	const fontgeometry = new TextGeometry( 'Runner', {
// 		font: font,
// 		size: 5,
// 		height: 0.3,
// 		curveSegments: 12,
// 		bevelEnabled: true,
// 		bevelThickness: 0,
// 		bevelSize: 0,
// 		bevelOffset: 0,
// 		bevelSegments: 0
// 	} );
//   const fontMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  
//   const textMesh = new THREE.Mesh(fontgeometry, fontMaterial);
//   scene.add(textMesh);
//   textMesh.position.set(-15, 15.5, 8);
//   textMesh.rotation.x = Math.PI / -2
// } );

// loader.load( 'https://threejs.org/examples/fonts/optimer_bold.typeface.json', function ( font ){

// 	const fontgeometry = new TextGeometry( '3D', {
// 		font: font,
// 		size: 5,
// 		height: 0,
// 		curveSegments: 12,
// 		bevelEnabled: true,
// 		bevelThickness: 1,
// 		bevelSize: 0,
// 		bevelOffset: 0,
// 		bevelSegments: 1
// 	} );
//   const fontMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  
//   const textMesh = new THREE.Mesh(fontgeometry, fontMaterial);
//   scene.add(textMesh);
//   textMesh.position.set(9, 15, 1);
//   textMesh.rotation.x = 5.5
// } );



// // Add OrbitControls
// // const orbitControls = new OrbitControls(camera, renderer.domElement);
// // orbitControls.update()

// // ---------------Start Button ----------------------

// const startBox = new THREE.BoxGeometry(3 , .5 ,1)
// const startButtonMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF})
// const startButton = new THREE.Mesh(startBox, startButtonMaterial)
// scene.add(startButton)
// startButton.position.set(0,20,34)

// // startButton.addEventListener('click', function(event) {
// //   // Your event handling code here
// //   console.log('Start button clicked!');
// // });


// // -----------------Creating the cube texture for the world environment
// const textureLoader = new THREE.TextureLoader()
// const cubeTextureLoader = new THREE.CubeTextureLoader()
// scene.background = cubeTextureLoader.load([
//   'public/imgs/Untitled design/1.jpg',
//   'public/imgs/Untitled design/3.jpg',
//   'public/imgs/Untitled design/2.jpg',
//   'public/imgs/Untitled design/4.jpg',
//   'public/imgs/Untitled design/5.jpg',
//   'public/imgs/Untitled design/6.jpg',
  
// ])

// // Create a plane-------------------------------------------------
// const planeGeometry = new THREE.PlaneGeometry(130, 100);
// const planeMaterial = new THREE.MeshPhongMaterial({
//   map: textureLoader.load('public/imgs/Untitled design/4.jpg') });
// const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
// planeMesh.receiveShadow = true; // Enable shadow casting on the plane
// scene.add(planeMesh);
// planeMesh.rotation.x = -0.5 * Math.PI


// // Create lighting
// const ambientLight = new THREE.AmbientLight(0x404040); // Ambient light
// scene.add(ambientLight);

// const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Directional light
// directionalLight.position.set(0, 10, 0);
// directionalLight.castShadow = true; // Enable shadow casting from the light
// scene.add(directionalLight);


// // ----------------Utilities-----------

// const objectsToUpdate = []

// // create box's
// const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
// const boxMaterial = new THREE.MeshStandardMaterial({
//   map: textureLoader.load('public/imgs/Untitled design/AdobeStock_242318067.jpeg') 
// })


// const createBox = (width, height, depth, position) => {
//   // threejs mesh
//   const mesh = new THREE.Mesh(boxGeometry, boxMaterial);
//   mesh.scale.set(width, height, depth);
//   mesh.castShadow = true;
//   mesh.position.copy(position);
//   scene.add(mesh);

//   // save in objects to update
//   objectsToUpdate.push({
//     mesh: mesh,
//     // body: body
//   });
// };

// function createMaze() {
//   // Dimensions of the maze
//   const numRows = maze.length;
//   const numCols = maze[0].length;

//   // Size of each cell in the maze
//   const cellSize = 1;

//   // Calculate the adjusted spacing between each box
//   const adjustedSpacing = (cellSize - 0.5) / 2;

//   // Starting position of the maze
//   const startX = -((numCols - 1) * cellSize) / 2 + adjustedSpacing;
//   const startZ = -((numRows - 1) * cellSize) / 2 + adjustedSpacing;

//   // Create boxes based on maze layout
//   for (let row = 0; row < numRows; row++) {
//     for (let col = 0; col < numCols; col++) {
//       if (maze[row][col] === 1) { // Flip condition from 0 to 1
//         const positionX = startX + col * cellSize;
//         const positionZ = startZ + row * cellSize;
//         createBox(1, 3, 1, { x: positionX, y: 1, z: positionZ });
//       }
//     }
//   }
// }

// createMaze();

// renderer.domElement.addEventListener('click', function (event) {
//   const raycaster = new THREE.Raycaster();
//   const mouse = new THREE.Vector2();
//   mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//   mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
//   raycaster.setFromCamera(mouse, camera);
//   const intersects = raycaster.intersectObject(startButton);
//   if (intersects.length > 0) {
//     isStartScreenActive = false
//     console.log(requestId)
//     cancelAnimationFrame(requestId)
//     scene.clear()
//     console.log(isStartScreenActive);
//     console.log(requestId)
//   }
// });



// // Render loop
// function animate() {
//   if (isStartScreenActive === false) return;
//   requestId = requestAnimationFrame(animate)
//   renderer.render(scene, camera);
  
// }
// animate();

// window.addEventListener('resize', function(){
//   camera.aspect = window.innerWidth / window.innerHeight
//   camera.updateProjectionMatrix()
//   renderer.setSize(window.innerWidth, window.innerHeight)

// })

// }