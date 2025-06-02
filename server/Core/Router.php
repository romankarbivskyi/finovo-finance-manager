<?php

namespace server\core;

class Router
{
  private $routes = [];

  public function addRoute($method, $path, $callback)
  {
    if (is_string($path)) {
      $path = rtrim($path, '/');
      if (empty($path)) {
        $path = '/';
      }

      $path = preg_replace('/\{([a-zA-Z0-9_]+)\}/', '(?P<$1>[^/]+)', $path);
      $path = str_replace('/', '\/', $path);

      if ($path !== '\/') {
        $path = '/^' . $path . '\/?$/';
      } else {
        $path = '/^' . $path . '$/';
      }
    }
    $this->routes[] = [
      'method' => strtoupper($method),
      'path' => $path,
      'callback' => $callback,
    ];
  }

  public function getRoutes()
  {
    return $this->routes;
  }

  public function match($requestMethod, $requestPath)
  {
    $pathParts = explode('?', $requestPath, 2);
    $path = $pathParts[0];

    $path = rtrim($path, '/');
    if (empty($path)) {
      $path = '/';
    }

    $queryParams = [];
    if (isset($pathParts[1])) {
      parse_str($pathParts[1], $queryParams);
    }

    foreach ($this->routes as $route) {
      if ($route['method'] === strtoupper($requestMethod)) {
        $matches = [];
        if (preg_match($route['path'], $path, $matches)) {
          $params = array_filter($matches, function ($key) {
            return !is_numeric($key);
          }, ARRAY_FILTER_USE_KEY);

          return [
            'callback' => $route['callback'],
            'params' => $params,
            'query' => $queryParams
          ];
        }
      }
    }
    return null;
  }
}