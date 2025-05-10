<?php

namespace server\Core;

class Response
{
  static function json($data, $statusCode = 200)
  {
    http_response_code($statusCode);
    header('Content-Type: application/json');
    $data['success'] = $statusCode >= 200 && $statusCode < 300;
    echo json_encode($data, JSON_PRETTY_PRINT);
    exit;
  }
}