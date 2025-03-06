// Inicjalizacja sceny
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Dodanie światła
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(5, 5, 5);
directionalLight.castShadow = true;
scene.add(directionalLight);

// Załadowanie modelu z wymuszoną aktualizacją
const loader = new THREE.GLTFLoader();
let model;

loader.load('models/model.glb?v=6', function (gltf) { // Nowa wersja modelu
    console.log("✅ Model załadowany! 🎉");
    model = gltf.scene;

    // **Zmniejszamy model do odpowiedniej wielkości**
    model.scale.set(0.4, 0.4, 0.4); // Jeśli nadal za duży, zmień na (0.25, 0.25, 0.25)
    model.position.set(0, -1, 0); // Przesunięcie w dół, żeby był na środku ekranu
    
    scene.add(model);

    // **Przybliżamy kamerę, żeby model był większy na ekranie**
    camera.position.set(0, 1.5, 4); // Kamerę ustawiamy tak, żeby objęła całą postać
    camera.lookAt(0, 1, 0); // Kierujemy kamerę na model

    animate();
}, undefined, function (error) {
    console.error("❌ Błąd ładowania modelu:", error);
});

// Obracanie modelem myszką
let isDragging = false;
let previousMouseX = 0;

document.addEventListener("mousedown", (event) => {
    isDragging = true;
    previousMouseX = event.clientX;
});

document.addEventListener("mousemove", (event) => {
    if (isDragging && model) {
        let deltaX = event.clientX - previousMouseX;
        model.rotation.y += deltaX * 0.005;
        previousMouseX = event.clientX;
    }
});

document.addEventListener("mouseup", () => {
    isDragging = false;
});

// Animacja
function animate() {
    requestAnimationFrame(animate);
    if (model) {
        model.rotation.y += 0.001; // Wolniejszy obrót
    }
    renderer.render(scene, camera);
}

animate();

// Wymuszenie aktualizacji

