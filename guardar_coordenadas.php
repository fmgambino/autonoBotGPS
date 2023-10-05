<?php
// Conexión a la base de datos MySQL en Hostinger
$servername = "localhost"; // Cambia esto a "localhost" si la base de datos está en el mismo servidor web
$username = "u197809344_eg0381";
$password = "Jamboree0381$$";
$dbname = "u197809344_autonobot";

// Crear una conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar la conexión
if ($conn->connect_error) {
    die("Error de conexión a la base de datos: " . $conn->connect_error);
}

// Obtiene los datos JSON enviados desde la página web
$data = file_get_contents("php://input");
$coordenadas = json_decode($data);

// Inserta las coordenadas en la base de datos
if ($coordenadas) {
    $stmt = $conn->prepare("INSERT INTO coordenadas (latitud, longitud) VALUES (?, ?)");
    $stmt->bind_param("dd", $latitud, $longitud);

    foreach ($coordenadas as $coord) {
        $latitud = $coord[0];
        $longitud = $coord[1];
        $stmt->execute();
    }

    $stmt->close();
    $conn->close();

    $response = ['status' => 'success', 'message' => 'Coordenadas guardadas correctamente.'];
    echo json_encode($response);
} else {
    $response = ['status' => 'error', 'message' => 'No se recibieron coordenadas válidas.'];
    echo json_encode($response);
}
?>
