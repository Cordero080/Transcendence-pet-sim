
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
console.log("✅ Three.js and FBXLoader loaded successfully!");

// Setup scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 1.5, 3);


// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(2, 4, 2);
scene.add(light);

// Helpers
scene.add(new THREE.GridHelper(5, 5));
scene.add(new THREE.AxesHelper(1));

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);

// Animation
let mixer;
const clock = new THREE.Clock();

// Load FBX
const loader = new FBXLoader();
loader.load(
  "./models/blue_cat_idle2.fbx",
  (fbx) => {
    console.log("✅ Model loaded:", fbx);
    fbx.scale.set(0.01, 0.01, 0.01);
    scene.add(fbx);

    mixer = new THREE.AnimationMixer(fbx);
    const action = mixer.clipAction(fbx.animations[0]);
    action.play();
  },
  undefined,
  (err) => console.error("❌ Failed to load model:", err)
);

// Animate
function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  if (mixer) mixer.update(delta);
  renderer.render(scene, camera);
}
animate();

