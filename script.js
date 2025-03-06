// **Deklaracja loadera GLTF (MUSI BYĆ NA SAMEJ GÓRZE!)**
const loader = new THREE.GLTFLoader();

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

// Zmienne globalne
let model, pants, shirt;

// **Załadowanie modelu postaci**
loader.load('models/model.glb?v=17', function (gltf) {
    console.log("✅ Model postaci załadowany!");
    model = gltf.scene;

    // Ustawienie skali i pozycji
    model.scale.set(0.4, 0.4, 0.4);
    model.position.set(0, -1, 0);
    
    scene.add(model);

    // Załaduj ubrania dopiero po załadowaniu postaci
    loadClothes();
}, undefined, function (error) {
    console.error("❌ Błąd ładowania modelu:", error);
});

// **Funkcja do ładowania ubrań**
function loadClothes() {
    loader.load('models/pants.glb?v=17', function (gltf) {
        console.log("✅ Spodnie załadowane!");
        pants = gltf.scene;

        // Skopiowanie skali i pozycji z postaci
        pants.scale.copy(model.scale);
        pants.position.copy(model.position);

        scene.add(pants);
    });

    loader.load('models/shirt.glb?v=17', function (gltf) {
        console.log("✅ Bluzka załadowana!");
        shirt = gltf.scene;

        // Skopiowanie skali i pozycji z postaci
        shirt.scale.copy(model.scale);
        shirt.position.copy(model.position);

        scene.add(shirt);
    });
}

// **Funkcja do przełączania widoczności ubrań**
function toggleClothes(type) {
    if (type === 'pants' && pants) {
        pants.visible = !pants.visible;
    } else if (type === 'shirt' && shirt) {
        shirt.visible = !shirt.visible;
    }
}

// **Obracanie myszką**
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

// **Animacja**
function animate() {
    requestAnimationFrame(animate);
    if (model) {
        model.rotation.y += 0.001;
    }
    renderer.render(scene, camera);
}

animate();

// Wymuszenie aktualizacji v18

