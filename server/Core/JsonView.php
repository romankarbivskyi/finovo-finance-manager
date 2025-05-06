<?php

namespace server\Core;

class JsonView
{
  static function render($data, $statusCode = 200)
  {
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode($data, JSON_PRETTY_PRINT);
  }
}