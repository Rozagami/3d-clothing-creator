// Inicjalizacja sceny
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Dodanie światła
const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(2, 2, 5);
scene.add(directionalLight);

// Załadowanie modelu
const loader = new THREE.GLTFLoader();
let model;

loader.load('models/model.glb', function (gltf) {
    console.log("✅ Model załadowany! 🎉");
    model = gltf.scene;
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
    isDragging = true;
    previousMouseX = event.clientX;
});

document.addEventListener("mousemove", (event) => {
    if (isDragging && model) {
        let deltaX = event.clientX - previousMouseX;
        model.rotation.y += deltaX * 0.01;
        prev
