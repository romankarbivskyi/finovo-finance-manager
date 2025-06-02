<?php

$envPath = __DIR__ . '/.env';
if (file_exists($envPath)) {
  $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
  foreach ($lines as $line) {
    if (strpos(trim($line), '#') === 0 || strpos($line, '=') === false) {
      continue;
    }
    list($name, $value) = explode('=', $line, 2);
    $name = trim($name);
    $value = trim($value);

    if (
      (substr($value, 0, 1) === '"' && substr($value, -1) === '"') ||
      (substr($value, 0, 1) === "'" && substr($value, -1) === "'")
    ) {
      $value = substr($value, 1, -1);
    }

    putenv("$name=$value");
    $_ENV[$name] = $value;
    $_SERVER[$name] = $value;
  }
}

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

use server\core\Database;
use server\core\Response;
use server\core\Router;
use server\core\Session;
use server\core\Request;
use server\middlewares\AuthMiddleware;
use server\middlewares\AdminMiddleware;

Session::getInstance();

$router = new Router();
$db = Database::getInstance();
$request = new Request();

$router->addRoute('GET', '/', function () {
  echo "Welcome to the home page! Method: " . $_SERVER['REQUEST_METHOD'];
});

$router->addRoute('POST', '/users/register', 'UserController@register');
$router->addRoute('POST', '/users/login', 'UserController@login');
$router->addRoute('GET', '/users/profile', 'UserController@getUser', [AuthMiddleware::class]);
$router->addRoute('POST', '/users/profile', 'UserController@updateProfile', [AuthMiddleware::class]);
$router->addRoute('POST', '/users/logout', 'UserController@logout', [AuthMiddleware::class]);
$router->addRoute('DELETE', '/users/{id}', 'UserController@delete');
$router->addRoute('DELETE', '/users', 'UserController@delete', [AuthMiddleware::class]);
$router->addRoute('POST', '/users/password/forgot', 'UserController@sendRecoveryToken');
$router->addRoute('POST', '/users/password/reset', 'UserController@resetPassword');
$router->addRoute('POST', '/users/password/change', 'UserController@changePassword', [AuthMiddleware::class]);
$router->addRoute('GET', '/users', 'UserController@getAllUsers', [AdminMiddleware::class]);

$router->addRoute('POST', '/goals/{id}', 'GoalController@update', [AuthMiddleware::class]);
$router->addRoute('POST', '/goals', 'GoalController@create', [AuthMiddleware::class]);
$router->addRoute('GET', '/goals', 'GoalController@getAll', [AuthMiddleware::class]);
$router->addRoute('DELETE', '/goals/{id}', 'GoalController@delete', [AuthMiddleware::class]);
$router->addRoute('GET', '/goals/stats', 'GoalController@getStats', [AuthMiddleware::class]);
$router->addRoute('GET', '/goals/{id}', 'GoalController@getById', [AuthMiddleware::class]);
$router->addRoute('GET', '/goals/{id}/transactions', 'TransactionController@getAllForGoal', [AuthMiddleware::class]);

$router->addRoute('GET', '/transactions', 'TransactionController@getAllForUser', [AuthMiddleware::class]);
$router->addRoute('POST', '/transactions', 'TransactionController@create', [AuthMiddleware::class]);
$router->addRoute('DELETE', '/transactions/{id}', 'TransactionController@delete', [AuthMiddleware::class]);

$route = $router->match($_SERVER['REQUEST_METHOD'], $_SERVER['REQUEST_URI']);

if ($route) {
  $callback = $route['callback'];
  $routeParams = $route['params'];
  $queryParams = $route['query'] ?? [];
  $middlewares = $route['middlewares'] ?? [];

  $request->setQueryParams($queryParams);

  $actionParams = array_values($routeParams);
  $actionParams[] = $request;

  $finalCallback = function (Request $request) use ($callback, $actionParams) {
    if (is_callable($callback)) {
      return call_user_func_array($callback, $actionParams);
    } else {
      list($controllerName, $methodName) = explode('@', $callback);
      $controllerClass = "server\\controllers\\$controllerName";
      $controller = new $controllerClass();
      return call_user_func_array([$controller, $methodName], $actionParams);
    }
  };

  if (!empty($middlewares)) {
    $router->executeMiddlewares($middlewares, $request, $finalCallback);
  } else {
    $finalCallback($request);
  }
} else {
  Response::json(['error' => 'Route not found.'], 404);
}