import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  200
);
camera.position.set(-4, 3, 6);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  preserveDrawingBuffer: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("canvas-container").appendChild(renderer.domElement);

// Load the Earth model
const loader = new GLTFLoader();
loader.load(
  "models/planet/scene.gltf",
  (gltf) => {
    console.log("Model loaded:", gltf); // Log the loaded model
    const earth = gltf.scene;
    earth.scale.set(2.5, 2.5, 2.5);
    scene.add(earth);
  },
  undefined,
  (error) => {
    console.error("Error loading model:", error); // Log any errors
  }
);

// Set up OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.autoRotate = true;
controls.enableZoom = false;
controls.maxPolarAngle = Math.PI / 2;
controls.minPolarAngle = Math.PI / 2;

// Set up lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// Animation loop
const animate = () => {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
};

animate();

// Handle window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
