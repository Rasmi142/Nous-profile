import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

console.log("Initializing scene and camera");

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

console.log("Initializing renderer");
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

console.log("Appending renderer to DOM");
document.getElementById("laptop").appendChild(renderer.domElement);

console.log("Initializing OrbitControls");
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;
controls.enablePan = false;
controls.enableRotate = false;
camera.position.set(0, 50, 100);

console.log("Adding lights to the scene");

// Add AmbientLight
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Ambient light with moderate intensity
scene.add(ambientLight);

// Add DirectionalLight
const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Directional light with high intensity
directionalLight.position.set(50, 50, 50); // Adjust position to illuminate the object well
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048; // High resolution shadow map
directionalLight.shadow.mapSize.height = 2048;
scene.add(directionalLight);

// Optional: Add a HemisphereLight
const hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 0.3); // Sky color, ground color, intensity
scene.add(hemisphereLight);

console.log("Loading 3D model");
const loader = new GLTFLoader();
let object;

loader.load(
  `models/voxel_web_development/scene.gltf`,
  function (gltf) {
    console.log("3D model loaded successfully");
    object = gltf.scene;
    object.scale.set(5, 5, 5);
    object.position.set(-22, 28, 0);

    object.traverse((child) => {
      if (child.isMesh) {
        console.log("Setting up shadows for child mesh");
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    scene.add(object);
    adjustScale();

    animate();
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  function (error) {
    console.error("Error loading 3D model", error);
  }
);

function animate() {
  requestAnimationFrame(animate);

  if (object) {
    object.rotation.y += 0.01;
  }

  renderer.render(scene, camera);
}

function adjustScale() {
  if (window.matchMedia("(min-width: 330px) and (max-width: 515px)").matches) {
    console.log("Adjusting scale for screens up to 515px");
    if (object) {
      object.scale.set(12.5, 12.5, 12.5);
      object.position.set(4, 60, 0); // Center the position
    }
  } else if (
    window.matchMedia("(min-width: 516px) and (max-width: 760px)").matches
  ) {
    console.log("Adjusting scale for small screens");
    if (object) {
      object.scale.set(15, 15, 15);
      object.position.set(-5, 50, 0);
    }
  } else if (
    window.matchMedia("(min-width: 761px) and (max-width: 830px)").matches
  ) {
    console.log("Adjusting scale for medium-small screens");
    if (object) {
      object.scale.set(12, 12, 12);
      object.position.set(-43, 50, 0);
    }
  } else if (
    window.matchMedia("(min-width: 831px) and (max-width: 1030px)").matches
  ) {
    console.log("Adjusting scale for medium screens");
    if (object) {
      object.scale.set(13, 13, 13);
      object.position.set(-55, 50, 0);
    }
  } else {
    console.log("Adjusting scale for large screens");
    if (object) {
      object.scale.set(9, 9, 9);
      object.position.set(-30, 15, 0);
    }
  }
}

// Initial adjustment
adjustScale();

// Adjust on window resize
window.addEventListener("resize", () => {
  console.log("Window resized");
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  adjustScale();
});
