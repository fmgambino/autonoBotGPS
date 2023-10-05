let map;
let markers = [];
let coordinates = [];
let polyline;

function initMap() {
    map = L.map("map").setView([0, 0], 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const locationInput = document.getElementById("locationInput");
    const searchButton = document.getElementById("searchButton");
    const crearPuntoButton = document.getElementById("crearPunto");
    const crearRutaButton = document.getElementById("crearRuta");
    const resetRutaButton = document.getElementById("resetRuta");

    searchButton.addEventListener("click", function() {
        searchLocation(locationInput.value);
    });

    map.on("click", function(event) {
        placeMarker(event.latlng);
    });

    crearPuntoButton.addEventListener("click", function() {
        placeMarker(map.getCenter());
    });

    crearRutaButton.addEventListener("click", function() {
        createRoute();
    });

    resetRutaButton.addEventListener("click", function() {
        resetRoute();
    });
}

function searchLocation(locationName) {
    fetch(`https://nominatim.openstreetmap.org/search?q=${locationName}&format=json`)
        .then(response => response.json())
        .then(data => {
            if (data && data[0]) {
                const lat = parseFloat(data[0].lat);
                const lon = parseFloat(data[0].lon);
                map.setView([lat, lon], 12);
            } else {
                alert("Ubicación no encontrada");
            }
        })
        .catch(error => {
            console.error("Error al buscar la ubicación:", error);
        });
}

function placeMarker(location) {
    const marker = L.marker(location, {
        icon: L.icon({
            iconUrl: 'marker-icon.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41]
        })
    }).addTo(map);

    markers.push(marker);
    coordinates.push([location.lat, location.lng]);

    if (coordinates.length > 1) {
        if (polyline) {
            map.removeLayer(polyline);
        }
        polyline = L.polyline(coordinates, { color: "red" }).addTo(map);
    }
}

function createRoute() {
    if (coordinates.length > 0) {
        const jsonData = JSON.stringify(coordinates);

        // Enviar los datos JSON al servidor PHP a través de una solicitud AJAX
        fetch('https://autonobot.midemo.tech/guardar_coordenadas.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: jsonData
        })
        .then(response => response.json())
        .then(data => {
            console.log(data); // Puedes manejar la respuesta del servidor aquí
        })
        .catch(error => {
            console.error("Error al enviar coordenadas al servidor:", error);
        });
    } else {
        alert("No hay coordenadas para enviar.");
    }
}

function resetRoute() {
    if (polyline) {
        map.removeLayer(polyline);
    }

    for (const marker of markers) {
        map.removeLayer(marker);
    }

    markers = [];
    coordinates = [];
}

document.addEventListener("DOMContentLoaded", function() {
    initMap();
});
