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

// Załadowanie postaci
const loader = new THREE.GLTFLoader();
let model;
let pants, shirt;

loader.load('models/model.glb?v=10', function (gltf) {
    console.log("✅ Model postaci załadowany!");
    model = gltf.scene;

    // Skalowanie i pozycja
    model.scale.set(0.4, 0.4, 0.4);
    model.position.set(0, -1, 0);
    
    scene.add(model);

    // Załaduj ubrania po modelu postaci
    loadClothes();
}, undefined, function (error) {
    console.error("❌ Błąd ładowania modelu:", error);
});

// Funkcja do ładowania ubrań
function loadClothes() {
    // Załaduj spodnie
    loader.load('models/pants.glb', function (gltf) {
        console.log("✅ Spodnie załadowane!");
        pants = gltf.scene;
        pants.scale.set(0.4, 0.4, 0.4);
        pants.position.set(0, -1, 0);
        scene.add(pants);
    });

    // Załaduj bluzkę
    loader.load('models/shirt.glb', function (gltf) {
        console.log("✅ Bluzka załadowana!");
        shirt = gltf.scene;
        shirt.scale.set(0.4, 0.4, 0.4);
        shirt.position.set(0, -1, 0);
        scene.add(shirt);
    });
}

// Funkcja do przełączania widoczności ubrań
function toggleClothes(type) {
    if (type === 'pants' && pants) {
        pants.visible = !pants.visible;
    } else if (type === 'shirt' && shirt) {
        shirt.visible = !shirt.visible;
    }
}

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
