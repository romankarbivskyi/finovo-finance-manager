<?php

namespace server\core;

class Router
{
  private $routes = [];

  public function addRoute($method, $path, $callback)
  {
    if (is_string($path)) {
      $path = preg_replace('/\{([a-zA-Z0-9_]+)\}/', '(?P<$1>[^/]+)', $path);
      $path = str_replace('/', '\/', $path);
      $path = '/^' . $path . '$/';
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
    foreach ($this->routes as $route) {
      if ($route['method'] === strtoupper($requestMethod)) {
        $matches = [];
        if (preg_match($route['path'], $requestPath, $matches)) {
          $params = array_filter($matches, function ($key) {
            return !is_numeric($key);
          }, ARRAY_FILTER_USE_KEY);

          return [
            'callback' => $route['callback'],
            'params' => $params
          ];
        }
      }
    }
    return null;
  }
}