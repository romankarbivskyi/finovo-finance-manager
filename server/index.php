<?php

require_once __DIR__ . '/autoload.php';

use server\Core\Database;
use server\Core\Router;

$router = new Router();
$db = Database::getInstance();

$router->addRoute('GET', '/', function () {
  echo "Welcome to the home page!";
});

$router->addRoute('POST', '/register', 'UserController@register');
$router->addRoute('POST', '/login', 'UserController@login');
$router->addRoute('GET', '/users/profile', 'UserController@getUser');
$router->addRoute('POST', '/logout', 'UserController@logout');

$router->addRoute('POST', '/goals/{id}', 'GoalController@update');
$router->addRoute('POST', '/goals', 'GoalController@create');

$route = $router->match($_SERVER['REQUEST_METHOD'], $_SERVER['REQUEST_URI']);

if ($route) {
  $callback = $route['callback'];
  $params = $route['params'];

  if (is_callable($callback)) {
    call_user_func_array($callback, $params);
  } else if (is_string($callback) && strpos($callback, '@') !== false) {
    list($controller, $method) = explode('@', $callback);
    $controller = "server\\Controllers\\{$controller}";
    $controllerInstance = new $controller();
    call_user_func_array([$controllerInstance, $method], $params);
  }
} else {
  header("HTTP/1.0 404 Not Found");
  echo "404 Not Found";
}