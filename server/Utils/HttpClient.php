<?php

namespace server\Utils;

use CURLFile;

class HttpClient
{

  public static function post(string $url, $data, array $headers = [], bool $isJson = false): array
  {
    $ch = curl_init();

    $defaultHeaders = [];

    if ($isJson && is_array($data)) {
      $data = json_encode($data);
      $defaultHeaders[] = 'Content-Type: application/json';
    } elseif (is_array($data)) {
      $data = http_build_query($data);
      $defaultHeaders[] = 'Content-Type: application/x-www-form-urlencoded';
    }

    $finalHeaders = array_merge($defaultHeaders, $headers);

    curl_setopt_array($ch, [
      CURLOPT_URL => $url,
      CURLOPT_POST => true,
      CURLOPT_POSTFIELDS => $data,
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_HTTPHEADER => $finalHeaders,
      CURLOPT_TIMEOUT => 30
    ]);

    $response = curl_exec($ch);
    $statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);

    curl_close($ch);

    return [
      'statusCode' => $statusCode,
      'body' => $response,
      'error' => $error ?: null
    ];
  }


  public static function get(string $url, array $params = [], array $headers = []): array
  {
    if (!empty($params)) {
      $url .= (strpos($url, '?') === false ? '?' : '&') . http_build_query($params);
    }

    $ch = curl_init();

    curl_setopt_array($ch, [
      CURLOPT_URL => $url,
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_HTTPHEADER => $headers,
      CURLOPT_TIMEOUT => 30
    ]);

    $response = curl_exec($ch);
    $statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);

    curl_close($ch);

    return [
      'statusCode' => $statusCode,
      'body' => $response,
      'error' => $error ?: null
    ];
  }
}