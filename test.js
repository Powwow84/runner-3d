// import * as THREE from 'three'
// import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
// import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';
// import * as CANNON from 'cannon-es'




// // --------------Three Js setup ----------------
// const renderer = new THREE.WebGLRenderer()
// renderer.setSize(window.innerWidth, window.innerHeight)
// document.body.appendChild(renderer.domElement)

// const scene = new THREE.Scene()

// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000 )

// // const orbit = new OrbitControls(camera, renderer.domElement)

// camera.position.set(0, 2, 10)
// // orbit.update()

// //  Cannon Declaration the rest of the asset building will be with its three js counter part
// const world = new CANNON.World({
//   gravity: new CANNON.Vec3(0, -9.81, 0)
// })


// // --------Controls -----------

// const controls = new PointerLockControls(camera, document.body);
// scene.add(controls.getObject());

// // Event listener to start the pointer lock when user clicks the scene
// document.body.addEventListener('click', () => {
//   controls.lock();
// });

// // Event listener to handle mouse movements and update camera rotation
// document.addEventListener('mousemove', (event) => {
//   if (controls.isLocked) {
//     const movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
//     const movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

//     // Update camera rotation based on mouse movements
//     controls.updateRotation(movementX, movementY);
//   }
// });

// function handleKeyDown(event) {
//   // Handle keyboard controls for movement
//   switch (event.code) {
//     case 'KeyW':
//       controls.moveForward(1);
//       break;
//     case 'KeyS':
//       controls.moveForward(-1);
//       break;
//     case 'KeyA':
//       controls.moveRight(-1);
//       break;
//     case 'KeyD':
//       controls.moveRight(1);
//       break;
//   }
// }

// document.addEventListener('keydown', handleKeyDown);


// // ------------------Plane --------------

// const planeGeometry = new THREE.PlaneGeometry(30, 30)
// const planeMaterial = new THREE.MeshBasicMaterial({ color : 0xFFFFFF})
// const plane = new THREE.Mesh(planeGeometry, planeMaterial)
// scene.add(plane)
// plane.rotation.x = -0.5* Math.PI

// const planePhysicsMat = new CANNON.Material()
// const planeBody = new CANNON.Body({
//   shape: new CANNON.Plane(),
//   mass: 0,
//   material: planePhysicsMat
// })
// world.addBody(planeBody)
// planeBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0) 

// // ----------------------Box -------------------

// const boxGeo = new THREE.BoxGeometry(2 ,2 ,2)
// const boxMat = new THREE.MeshBasicMaterial({
//   color: 0x00ff00,
// })
// const boxMesh = new THREE.Mesh(boxGeo, boxMat)
// scene.add(boxMesh)

// const boxPhysicsMat = new CANNON.Material()

// const boxBody = new CANNON.Body({
//   mass: 0,
//   shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
//   position: new CANNON.Vec3(1, 1, 0),
//   material: boxPhysicsMat,
// });
// world.addBody(boxBody);

// // Disable collision between cameraBody and boxBody



// //----------------------Camera --------

// const cameraPhysicsMat = new CANNON.Material()

// const cameraBody = new CANNON.Body({
//   mass:1,
//   shape: new CANNON.Sphere(2),
//   material: cameraPhysicsMat
// })
// world.addBody(cameraBody)
// cameraBody.position.set(0,0,10)

// const cameraBoxContactMat = new CANNON.ContactMaterial(
//   cameraPhysicsMat,
//   boxPhysicsMat,
//   { friction: 0.0, restitution: 0.0 }
// );
// world.addContactMaterial(cameraBoxContactMat);

// const cameraBoxDistanceConstraint = new CANNON.DistanceConstraint(
//   boxBody,
//   cameraBody,
//   0,
//   0
// );
// world.addConstraint(cameraBoxDistanceConstraint);


// cameraBody.collisionFilterGroup = 1;   // Group 1 for cameraBody
// cameraBody.collisionFilterMask = 2;    // Collide with objects in group 2
// boxBody.collisionFilterGroup = 2;      // Group 2 for boxBody
// boxBody.collisionFilterMask = 0;


// // ----------Animation loop----------

// const timeStep = 1/60.0

// function animate() {
//   // Step the physics simulation
//   world.step(timeStep);

//   cameraBody.position.copy(controls.getObject().position);
//   cameraBody.quaternion.copy(controls.getObject().quaternion);


//   camera.position.copy(cameraBody.position);
//   camera.quaternion.copy(cameraBody.quaternion);

//   // Update the position and rotation of the plane mesh based on the plane body
//   plane.position.copy(planeBody.position);
//   plane.quaternion.copy(planeBody.quaternion);

//   boxMesh.position.copy(boxBody.position)
//   boxMesh.quaternion.copy(boxBody.quaternion)

//   // Render the scene
//   renderer.render(scene, camera);

//   // Request the next animation frame
//   requestAnimationFrame(animate);
// }

// renderer.setAnimationLoop(animate)

// window.addEventListener('resize', function(){
//   camera.aspect = window.innerWidth / window.innerHeight
//   camera.updateProjectionMatrix()
//   renderer.setSize(window.innerWidth, window.innerHeight)
// })







// -------------------------Movement working, and box wall working -------------