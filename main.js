import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';
import * as CANNON from 'cannon-es'




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
        renderer.domElement.requestPointerLock();
      }

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('click', lockPointer);

      // Animation loop
      function animate() {
        requestAnimationFrame(animate);

        // Move camera based on keyboard input
        const moveDirection = new THREE.Vector3();
        if (keyboard['ArrowUp'] || keyboard['KeyW']) {
          moveDirection.z = -1;
        }
        if (keyboard['ArrowDown'] || keyboard['KeyS']) {
          moveDirection.z = 1;
        }
        if (keyboard['ArrowLeft'] || keyboard['KeyA']) {
          moveDirection.x = -1;
        }
        if (keyboard['ArrowRight'] || keyboard['KeyD']) {
          moveDirection.x = 1;
        }
        moveDirection.normalize();
        moveDirection.applyQuaternion(camera.quaternion);

        const velocity = moveDirection.multiplyScalar(moveSpeed);
        cameraBody.velocity.x = velocity.x;
        cameraBody.velocity.z = velocity.z;

        // Prevent camera from falling through the plane
        const minY = 0.5;
        if (cameraBody.position.y < minY) {
          cameraBody.position.y = minY;
          cameraBody.velocity.y = 0;
        }

        // Check collision between camera and box
        const sweepSphere = new CANNON.Sphere(0.25);
        const sweepDirection = cameraBody.velocity.clone();
        const result = new CANNON.RaycastResult();
        world.raycastClosest(cameraBody.position, cameraBody.position.clone().add(sweepDirection), { skipBackfaces: true }, result);

        if (result.hasHit) {
          const distance = result.distance;
          if (distance < 0.35) {
            const separation = 0.35 - distance;
            const separationVector = result.normal.scale(separation);
            cameraBody.position.add(separationVector);
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