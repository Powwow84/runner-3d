// import * as THREE from 'three'
// import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
// import * as CANNON from 'cannon-es'
// import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';


// const renderer = new THREE.WebGLRenderer()
// renderer.setSize(window.innerWidth, window.innerHeight)
// document.body.appendChild(renderer.domElement)

// const scene = new THREE.Scene()

// const camera = new THREE.PerspectiveCamera(
//   45, window.innerWidth /window.innerHeight, 0.1, 1000
// )

// const orbit = new OrbitControls(camera, renderer.domElement)

// // camera.position.set(0, 20, -30)
// // orbit.update()

// const controls = new PointerLockControls(camera, document.body)
// scene.add(controls.getObject())

// document.body.addEventListener('click', () => {
//   controls.lock();
// });


// document.addEventListener('mousemove', (event) => {
//   if(controls.isLocked) {
//     const movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0
//     const movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0

//     controls.updateRotation(movementX, movementY)
//   }
// })

// function handleKeyDown(event) {
//   switch (event.code) {
//     case 'KeyW':
//       controls.moveForward(.5)
//       break;
//     case 'KeyS':
//       controls.moveForward(-.5)
//       break;
//     case 'KeyA':
//       controls.moveRight(-.5)
//       break;
//     case 'KeyD':
//       controls.moveRight(.5)
//       break;
//   }
// }

// document.addEventListener('keydown', handleKeyDown)

// const boxGeo = new THREE.BoxGeometry(2 ,2 ,2)
// const boxMat = new THREE.MeshBasicMaterial({
//   color: 0x00ff00,
//   wireframe: true
// })
// const boxMesh = new THREE.Mesh(boxGeo, boxMat)
// scene.add(boxMesh)

// const sphereGeo = new THREE.SphereGeometry(2)
// const sphereMat = new THREE.MeshBasicMaterial({
//   color: 0xff0000,
//   wireframe: true,
// })
// const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat)
// scene.add(sphereMesh)





// const groundGeo = new THREE.PlaneGeometry(30,30)
// const groundMat = new THREE.MeshBasicMaterial({
//   color: 0xffffff,
//   side: THREE.DoubleSide,
//   wireframe: true
// })
// const groundMesh = new THREE.Mesh(groundGeo, groundMat)
// scene.add(groundMesh)

// // declares a new instance of cannon
// const world = new CANNON.World({
//   gravity: new CANNON.Vec3(0 , -9.81, 0)
// })


// const cameraPhyMat = new CANNON.Material()

// const cameraBody = new CANNON.Body({
//   mass: 10,
//   shape: new CANNON.Box(new CANNON.Vec3(1,1,1)),
//   material: cameraPhyMat
// })
// world.addBody(cameraBody)
// cameraBody.position.set(0, 0, 1)

// const groundPhysMat = new CANNON.Material()

// const groundBody = new CANNON.Body({
//   // shape: new CANNON.Plane(),
//   // mass: 10 // giving this mass sends it falling down the y axis  since in our vec 3 we set it to -9.81
//   shape: new CANNON.Box(new CANNON.Vec3(100 ,100 , 0.1)),
//   type: CANNON.Body.STATIC,//static is the same as setting mass to 0
//   material: groundPhysMat
// })
// world.addBody(groundBody)
// groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0) //change angle of the plane on body because the mesh copies the body, unlike if we had no physics where you wouls change it on the object

// const boxPhysMat = new CANNON.Material()

// const boxBody = new CANNON.Body({
//   mass: 1,
//   shape: new CANNON.Box(new CANNON.Vec3(1,1,1)),
//   position: new CANNON.Vec3(1, 20, 0),
//   material: boxPhysMat
// })
// world.addBody(boxBody)

// boxBody.angularVelocity.set(0 ,10 ,0)
// boxBody.angularDamping = 0.5

// const groundBoxContactMat = new CANNON.ContactMaterial(
//   groundPhysMat,
//   boxPhysMat,
//   {friction : 10}
// )

// world.addContactMaterial(groundBoxContactMat)

// const spherePhysMat = new CANNON.Material()

// const sphereBody = new CANNON.Body({
//   mass: 1,
//   shape: new CANNON.Sphere(2),
//   position: new CANNON.Vec3(0, 15, 0),
//   material: spherePhysMat,
// })
// world.addBody(sphereBody)

// sphereBody.linearDamping = 0.31

// const groundSphereContactMat = new CANNON.ContactMaterial(
//   groundPhysMat,
//   spherePhysMat,
//   {restitution : 0.9}
// )

// world.addContactMaterial(groundSphereContactMat)

// // const cameraSphereContactMat = new CANNON.ContactMaterial(
// //   spherePhysMat,
// //   cameraPhyMat,
// //   {restitution : 0.9}
// // )

// // world.addContactMaterial(cameraSphereContactMat)

// const timeStep = 1/60.0


// function animate() {
//   world.step(timeStep)

//   // controls.update(); // Update the controls
//   // camera.position.copy(controls.getObject().position);
//   // camera.quaternion.copy(controls.getObject().quaternion);
  
//   camera.position.copy(controls.getObject().position);
//   camera.quaternion.copy(controls.getObject().quaternion);


//   controls.getObject().position.copy(cameraBody.position);
//   controls.getObject().quaternion.copy(cameraBody.quaternion);

//   // camera.position.copy(cameraBody.position)
//   // camera.quaternion.copy(cameraBody.quaternion)

//   groundMesh.position.copy(groundBody.position)
//   groundMesh.quaternion.copy(groundBody.quaternion)

//   boxMesh.position.copy(boxBody.position)
//   boxMesh.quaternion.copy(boxBody.quaternion)

//   sphereMesh.position.copy(sphereBody.position)
//   sphereMesh.quaternion.copy(sphereBody.quaternion)

//   renderer.render(scene, camera)
// }

// renderer.setAnimationLoop(animate)

// window.addEventListener('resize', function() {
//   camera.aspect = window.innerWidth / this.window.innerHeight
//   camera.updateProjectionMatrix()
//   renderer.setSize(window.innerWidth, window.innerHeight)
// })