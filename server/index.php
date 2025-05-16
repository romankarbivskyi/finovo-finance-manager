<?php

$allowed_origins = [
  'http://localhost:5173',
];

$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

if (in_array($origin, $allowed_origins)) {
  header("Access-Control-Allow-Origin: " . $origin);
} else {
  header("Access-Control-Allow-Origin: 'http://localhost:5173'");
}

header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit();
}

require_once __DIR__ . '/autoload.php';

use server\Core\Database;
use server\Core\Response;
use server\Core\Router;
use server\Core\Session;
use server\Core\Request;

Session::getInstance();

$router = new Router();
$db = Database::getInstance();
$request = new Request();

$router->addRoute('GET', '/', function () {
  echo "Welcome to the home page! Method: " . $_SERVER['REQUEST_METHOD'];
});

$router->addRoute('POST', '/users/register', 'UserController@register');
$router->addRoute('POST', '/users/login', 'UserController@login');
$router->addRoute('GET', '/users/profile', 'UserController@getUser');
$router->addRoute('POST', '/users/logout', 'UserController@logout');
$router->addRoute('POST', '/users/password/forgot', 'UserController@sendRecoveryToken');
$router->addRoute('POST', '/users/password/reset', 'UserController@resetPassword');
$router->addRoute('POST', '/users/password/change', 'UserController@changePassword');

$router->addRoute('POST', '/goals/{id}', 'GoalController@update');
$router->addRoute('POST', '/goals', 'GoalController@create');
$router->addRoute('GET', '/goals', 'GoalController@getAll');
$router->addRoute('DELETE', '/goals/{id}', 'GoalController@delete');
$router->addRoute('GET', '/goals/{id}', 'GoalController@getById');
$router->addRoute('GET', '/goals/{id}/transactions', 'TransactionController@getAllForGoal');

$router->addRoute('GET', '/transactions', 'TransactionController@getAllForUser');
$router->addRoute('POST', '/transactions', 'TransactionController@create');
$router->addRoute('DELETE', '/transactions/{id}', 'TransactionController@delete');

$route = $router->match($_SERVER['REQUEST_METHOD'], $_SERVER['REQUEST_URI']);

if ($route) {
  $callback = $route['callback'];
  $routeParams = $route['params'];
  $queryParams = $route['query'] ?? [];

  $request->setQueryParams($queryParams);

  $actionParams = array_values($routeParams);
  $actionParams[] = $request;

  if (is_callable($callback)) {
    call_user_func_array($callback, $actionParams);
  } else if (is_string($callback) && strpos($callback, '@') !== false) {
    list($controller, $method) = explode('@', $callback);
    $controllerClass = "server\\Controllers\\{$controller}";
    if (class_exists($controllerClass)) {
      $controllerInstance = new $controllerClass();
      if (method_exists($controllerInstance, $method)) {
        call_user_func_array([$controllerInstance, $method], $actionParams);
      } else {
        Response::json(['error' => 'Method not found'], 404);
      }
    } else {
      Response::json(['error' => 'Controller not found'], 404);
    }
  }
} else {
  Response::json(['error' => 'Route not found'], 404);
}