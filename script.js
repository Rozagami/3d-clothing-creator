// Sprawdzamy, czy Three.js jest poprawnie załadowane
console.log("✅ Three.js działa!", THREE);

// Inicjalizacja sceny
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Dodanie światła (bardzo silne, żeby model był widoczny)
const ambientLight = new THREE.AmbientLight(0xffffff, 3); // Mocniejsze światło otoczenia
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Sprawdzenie, czy GLTFLoader działa
console.log("✅ Próba załadowania modelu...");

// Loader do wczytania modelu 3D
const loader = new THREE.GLTFLoader();
loader.load('models/model.glb', function (gltf) {
    console.log("✅ Model załadowany! 🎉");  // Potwierdzenie, że model się wczytał
    const model = gltf.scene;
    scene.add(model);

    // Ustawienie pozycji modelu na środku sceny
    model.position.set(0, -1, 0);

    // Dopasowanie skali modelu, jeśli jest za duży lub za mały
    model.scale.set(1, 1, 1);

    // Automatyczne dostosowanie kamery
    fitCameraToObject(camera, model);

    animate();
}, undefined, function (error) {
    console.error("❌ Błąd ładowania modelu:", error);
});

// Funkcja automatycznego dostosowania kamery do modelu
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

// Animacja (obracamy model wokół własnej osi)
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();
