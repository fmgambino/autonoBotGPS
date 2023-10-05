<?php
// Conexión a la base de datos MySQL en Hostinger
$servername = "tu-servidor-mysql-en-hostinger.com";
$username = "tu-usuario";
$password = "tu-contraseña";
$dbname = "tu-base-de-datos";

$conn = new mysqli($servername, $username, $password, $dbname);

// Verifica la conexión
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
