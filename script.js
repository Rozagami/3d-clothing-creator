// Inicjalizacja sceny
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Dodanie światła (zmniejszona intensywność)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2); // Bardzo delikatne światło
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8); // Zmniejszona moc światła
directionalLight.position.set(3, 4, 5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 20;
scene.add(directionalLight);

// Dodajemy podłoże do cieni
const floorGeometry = new THREE.PlaneGeometry(20, 20); // Powiększyliśmy podłoże, żeby pasowało do większego modelu
const floorMaterial = new THREE.ShadowMaterial({ opacity: 0.4 });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -2.5; // Przesunęliśmy podłoże niżej, żeby pasowało do większego modelu
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
    model.position.set(0, -2, 0); // Przesunięcie modelu w dół, żeby pasował do nowego podłoża
    model.scale.set(4, 4, 4); // **Powiększenie modelu 4x**

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

    camera.position.set(center.x, center.y, cameraZ * 2.5); // Lepsze dopasowanie kamery do większego modelu
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
        model.rotation.y += deltaX * 0.005; // Wolniejsze obracanie myszką
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
        model.rotation.y += 0.001; // Wolniejszy automatyczny obrót
    }
    renderer.render(scene, camera);
}

animate();
