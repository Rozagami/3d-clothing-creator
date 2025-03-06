// Importujemy Three.js oraz GLTFLoader poprawnie jako moduły
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/jsm/loaders/GLTFLoader.js';

// Inicjalizacja sceny
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Dodanie światła
const light = new THREE.AmbientLight(0xffffff);
scene.add(light);

// Sprawdzenie, czy Three.js działa
console.log("✅ Three.js działa!");

// Ustawienie kamery
camera.position.z = 3;

// Loader do wczytania modelu 3D
const loader = new GLTFLoader();
loader.load('./models/model.glb', function (gltf) {
    console.log("✅ Model załadowany!");  // Potwierdzenie, że model się wczytał
    scene.add(gltf.scene);
    gltf.scene.position.set(0, -1, 0);
    animate();
}, undefined, function (error) {
    console.error("❌ Błąd ładowania modelu:", error);
});

// Animacja
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();
