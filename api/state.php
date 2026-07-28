<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$dataDir = dirname(__DIR__) . '/data';
$stateFile = $dataDir . '/presupuesto-state.json';

if (!is_dir($dataDir)) {
    mkdir($dataDir, 0755, true);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!file_exists($stateFile)) {
        echo json_encode(['state' => null]);
        exit;
    }
    $raw = file_get_contents($stateFile);
    $parsed = json_decode($raw, true);
    echo json_encode(['state' => $parsed['state'] ?? null]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body = file_get_contents('php://input');
    $payload = json_decode($body, true);
    if (!is_array($payload)) {
        http_response_code(400);
        echo json_encode(['error' => 'JSON inválido']);
        exit;
    }
    file_put_contents($stateFile, json_encode(['state' => $payload['state'] ?? null, 'updated' => date('c')], JSON_UNESCAPED_UNICODE));
    echo json_encode(['ok' => true]);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Método no permitido']);
