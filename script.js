// Załaduj postać
loader.load('models/model.glb?v=15', function (gltf) {
    console.log("✅ Model postaci załadowany!");
    model = gltf.scene;

    // Wymuszenie tej samej skali dla postaci i ubrań
    model.scale.set(0.4, 0.4, 0.4);
    model.position.set(0, -1, 0); // Jeśli postać jest za wysoko/za nisko, zmień wartość Y

    scene.add(model);

    // Dopiero po załadowaniu postaci ładujemy ubrania
    loadClothes();
}, undefined, function (error) {
    console.error("❌ Błąd ładowania modelu:", error);
});

// Funkcja do ładowania ubrań
function loadClothes() {
    // Załaduj spodnie
    loader.load('models/pants.glb?v=15', function (gltf) {
        console.log("✅ Spodnie załadowane!");
        pants = gltf.scene;

        // Ustawienie TEJ SAMEJ skali i pozycji co postać
        pants.scale.copy(model.scale);  // Skopiowanie skali z postaci
        pants.position.copy(model.position); // Skopiowanie pozycji z postaci

        scene.add(pants);
    });

    // Załaduj bluzkę
    loader.load('models/shirt.glb?v=15', function (gltf) {
        console.log("✅ Bluzka załadowana!");
        shirt = gltf.scene;

        // Ustawienie TEJ SAMEJ skali i pozycji co postać
        shirt.scale.copy(model.scale);
        shirt.position.copy(model.position);

        scene.add(shirt);
    });
}
