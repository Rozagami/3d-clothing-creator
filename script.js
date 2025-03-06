// **Deklaracja loadera GLTF (MUSI BYĆ TYLKO JEDNA!)**
const loader = new THREE.GLTFLoader();

// Inicjalizacja sceny
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// **Poprawienie kamery - oddalenie, żeby widać było całą postać**
camera.position.set(0, 3, 10);
camera.lookAt(0, 1, 0);

// Dodanie światła
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(5, 5, 5);
directionalLight.castShadow = true;
scene.add(directionalLight);

// **Tworzymy grupę dla modelu i ubrań**
let modelGroup = new THREE.Group();
scene.add(modelGroup);

// Zmienne globalne
let model, pants, shirt; // Zmienione nazwy!

// **Załadowanie modelu postaci**
loader.load('models/model.glb?v=28', function (gltf) {
    console.log("✅ Model postaci załadowany!");
    model = gltf.scene;

    // **Powiększamy postać**
    model.scale.set(1.2, 1.2, 1.2);
    model.position.set(0, -1.3, 0); // Podnosimy postać

    modelGroup.add(model); // Dodajemy postać do grupy

    // **Załaduj ubrania dopiero po załadowaniu postaci**
    loadClothes();
}, undefined, function (error) {
    console.error("❌ Błąd ładowania modelu:", error);
});

// **Funkcja do ładowania ubrań**
function loadClothes() {
    loader.load('models/shirt.glb?v=28', function (gltf) { // Teraz "shirt" to spodnie
        console.log("✅ Spodnie (shirt) załadowane!");
        shirt = gltf.scene;

        // **Dopasowanie skali i pozycji do postaci**
        shirt.scale.set(1.2, 1.2, 1.2);
        shirt.position.set(0, -1.3, 0);

        // **Poprawienie sposobu renderowania materiału**
        shirt.traverse((child) => {
            if (child.isMesh) {
                child.material.needsUpdate = true;
                child.material.side = THREE.DoubleSide; // Jeśli tekstura znika, renderuj dwie strony
                child.material.transparent = false;
                child.material.depthTest = true;
                child.material.depthWrite = true;
            }
        });

        modelGroup.add(shirt); // Dodajemy do grupy
    });

    loader.load('models/pants.glb?v=28', function (gltf) { // Teraz "pants" to bluzka
        console.log("✅ Bluzka (pants) załadowana!");
        pants = gltf.scene;

        // **Dopasowanie skali i pozycji do postaci**
        pants.scale.set(1.2, 1.2, 1.2);
        pants.position.set(0, -1.3, 0);

        modelGroup.add(pants); // Dodajemy do grupy
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

// **Obracanie myszką - obracamy całą grupę**
let isDragging = false;
let previousMouseX = 0;

document.addEventListener("mousedown", (event) => {
    isDragging = true;
    previousMouseX = event.clientX;
});

document.addEventListener("mousemove", (event) => {
    if (isDragging && modelGroup) { // Obracamy modelGroup zamiast samego modelu
        let deltaX = event.clientX - previousMouseX;
        modelGroup.rotation.y += deltaX * 0.005;
        previousMouseX = event.clientX;
    }
});

document.addEventListener("mouseup", () => {
    isDragging = false;
});

// **Animacja**
function animate() {
    requestAnimationFrame(animate);
    if (modelGroup) {
        modelGroup.rotation.y += 0.001; // Powolne obracanie całości
    }
    renderer.render(scene, camera);
}

animate();

// **Wymuszenie aktualizacji v28**
