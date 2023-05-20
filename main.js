import * as THREE from "three"
import { DirectionalLightHelper, GridHelper } from "three"
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from  'dat.gui'


const renderer = new THREE.WebGLRenderer()

renderer.shadowMap.enabled = true

renderer.setSize(window.innerWidth, window.innerHeight)

document.body.appendChild(renderer.domElement)

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
  75, window.innerWidth /window.innerHeight, 0.1, 1000
)

const orbit = new OrbitControls(camera, renderer.domElement)

const axesHelper = new THREE.AxesHelper(3)

scene.add(axesHelper)

camera.position.set(-10, 30, 30)
orbit.update()

const boxGeometry = new THREE.BoxGeometry()
const boxMaterial = new THREE.MeshBasicMaterial({color: 0x00FF00})
const box = new THREE.Mesh(boxGeometry, boxMaterial)
scene.add(box)

const planeGeometry = new THREE.PlaneGeometry(30,30)
const planeMaterial = new THREE.MeshStandardMaterial({
   color: 0xFFFFFF,
   side: THREE.DoubleSide
  })
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
scene.add(plane)
plane.rotation.x = -0.5 * Math.PI
plane.receiveShadow = true

const gridHelper = new THREE.GridHelper(30)
scene.add(gridHelper)

const sphereGeometry = new THREE.SphereGeometry(4, 100, 100)
const sphereMaterial = new THREE.MeshStandardMaterial({ 
  color : 0x0000FF,
  // wireframe: true
})
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
scene.add(sphere)

sphere.position.set(-10, 10, 0)
sphere.castShadow = true

const ambientLight = new THREE.AmbientLight(0x333333)
scene.add(ambientLight)

// const directionalLight = new THREE.DirectionalLight()
// scene.add(directionalLight)
// directionalLight.position.set(-30, 50, 0)
// directionalLight.castShadow = true
// directionalLight.shadow.camera.bottom = -12

// const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5)
// scene.add(directionalLightHelper)

// const directionalLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
// scene.add(directionalLightShadowHelper)

const spotLight = new THREE.SpotLight(0xFFFFFF)
scene.add(spotLight)
spotLight.position.set(-100, 100, 0)
spotLight.castShadow = true
spotLight.angle = 0.2

const spotLightHelper = new THREE.SpotLightHelper(spotLight)
scene.add(spotLightHelper)

// scene.fog =new THREE.Fog(0xFFFFFF, 0, 200)

scene.fog = new THREE.FogExp2(0xFFFFFF, 0.01)

// renderer.setClearColor(0xFFEA00)

const textureLoader = new THREE.TextureLoader()
// scene.background = textureLoader.load(stars)
const cubeTextureLoader = new THREE.CubeTextureLoader()
scene.background = cubeTextureLoader.load([
 
  'public/imgs/negx.jpg',
  'public/imgs/negx.jpg',
  'public/imgs/negx.jpg',
  'public/imgs/negx.jpg',
  'public/imgs/negx.jpg',
  'public/imgs/negx.jpg',
])

const box2Geometry = new THREE.BoxGeometry(4,4,4)
const box2Material = new THREE.MeshBasicMaterial({
  // color: 0x00FF00,
  // map: textureLoader.load('public/imgs/space-2560x1440-l122pd4lxyo3fug5.jpeg')
})
const box2MultiMaterial = [
  new THREE.MeshBasicMaterial({map: textureLoader.load('public/imgs/space-2560x1440-l122pd4lxyo3fug5.jpeg')}),
  new THREE.MeshBasicMaterial({map: textureLoader.load('public/imgs/Carina Nebula.jpeg')}),
  new THREE.MeshBasicMaterial({map: textureLoader.load('public/imgs/space-2560x1440-l122pd4lxyo3fug5.jpeg')}),
  new THREE.MeshBasicMaterial({map: textureLoader.load('public/imgs/Carina Nebula.jpeg')}),
  new THREE.MeshBasicMaterial({map: textureLoader.load('public/imgs/space-2560x1440-l122pd4lxyo3fug5.jpeg')}),
  new THREE.MeshBasicMaterial({map: textureLoader.load('public/imgs/Carina Nebula.jpeg')}),
]
const box2 = new THREE.Mesh(box2Geometry, box2MultiMaterial)
scene.add(box2)
box2.position.set(0,15,10)
// box2.material.map = textureLoader.load('public/imgs/space-2560x1440-l122pd4lxyo3fug5.jpeg')

const gui = new dat.GUI()

const options = {
  sphereColor: '#ffea00',
  wireframe: false,
  speed: 0.01,
  angle: 0.2,
  penumbra: 0,
  intensity: 1
}

gui.addColor(options, 'sphereColor').onChange(function(e){
  sphere.material.color.set(e);
})

gui.add(options, 'wireframe').onChange(function(e) {
  sphere.material.wireframe = e
})

gui.add(options, 'speed', 0, 0.1)
gui.add(options, 'angle', 0, 1)
gui.add(options, 'penumbra', 0, 1)
gui.add(options, 'intensity', 0, 1)

let step = 0

const mousePosition = new THREE.Vector2()

window.addEventListener('mousemove', function(e){
  mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1
  mousePosition.y = - (e.clientY / window.innerHeight) * 2 + 1
})

const rayCaster = new THREE.Raycaster()

function animate(time) {
  box.rotation.x = time / 1000
  box.rotation.y = time / 1000

  step += options.speed
  sphere.position.y = 10 * Math.abs(Math.sin(step))

  spotLight.angle = options.angle
  spotLight.penumbra = options.penumbra
  spotLight.intensity = options.intensity
  spotLightHelper.update()

  rayCaster.setFromCamera(mousePosition, camera)
  const intersects = rayCaster.intersectObjects(scene.children)
  console.log(intersects)

  renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)
