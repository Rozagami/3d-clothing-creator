// Inicjalizacja sceny
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // Włączamy cienie
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Miękkie cienie
document.body.appendChild(renderer.domElement);

// Dodanie światła (zmniejszona jasność i lepsze cienie)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4); // Bardziej stonowane światło otoczenia
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
directionalLight.position.set(2, 4, 6);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 20;
scene.add(directionalLight);

// Dodajemy płaszczyznę, żeby cienie były widoczne
const floorGeometry = new THREE.PlaneGeometry(10, 10);
const floorMaterial = new THREE.ShadowMaterial({ opacity: 0.5 });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -1.1;
floor.receiveShadow = true;
scene.add(floor);

// Załadowanie modelu
const loader = new THREE.GLTFLoader();
let model;

loader.load('models/model.glb', function (gltf) {
    console.log("✅ Model załadowany! 🎉");
    model = gltf.scene;
    model.traverse((node) => {
        if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
        }
    });
    scene.add(model);

    // Ustawienie pozycji modelu
    model.position.set(0, -1, 0);
    model.scale.set(1, 1, 1);

    fitCameraToObject(camera, model);
    animate();
}, undefined, function (error) {
    console.error("❌ Błąd ładowania modelu:", error);
});

// Automatyczne dopasowanie kamery do modelu
function fitCameraToObject(camera, object) {
    const boundingBox = new THREE.Box3().setFromObject(object);
    const center = boundingBox.getCenter(new THREE.Vector3());
    const size = boundingBox.getSize(new THREE.Vector3());

    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180);
    let cameraZ = Math.abs(maxDim / Math.sin(fov / 2));

    camera.position.set(center.x, center.y, cameraZ * 1.5);
    camera.lookAt(center);
}

// Obracanie modelem myszką
let isDragging = false;
let previousMouseX = 0;

document.addEventListener("mousedown", (event) => {
    console.log("🖱️ Mysz wciśnięta!");
    isDragging = true;
    previousMouseX = event.clientX;
});

document.addEventListener("mousemove", (event) => {
    if (isDragging && model) {
        let deltaX = event.clientX - previousMouseX;
        model.rotation.y += deltaX * 0.01;
        console.log("🔄 Model obracany! Delta:", deltaX);
        previousMouseX = event.clientX;
    }
});

document.addEventListener("mouseup", () => {
    console.log("🖱️ Mysz puszczona!");
    isDragging = false;
});

// Animacja
function animate() {
    requestAnimationFrame(animate);
    if (model) {
        model.rotation.y += 0.002; // Wolniejszy obrót
    }
    renderer.render(scene, camera);
}

animate();
