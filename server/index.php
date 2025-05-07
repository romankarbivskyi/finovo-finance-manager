<?php

require_once __DIR__ . '/autoload.php';

use server\Core\Database;
use server\Core\Response;
use server\Core\Router;
use server\Core\Session;

Session::getInstance();

$router = new Router();
$db = Database::getInstance();

$router->addRoute('GET', '/', function () {
  echo "Welcome to the home page! Method: " . $_SERVER['REQUEST_METHOD'];
});

$router->addRoute('POST', '/users/register', 'UserController@register');
$router->addRoute('POST', '/users/login', 'UserController@login');
$router->addRoute('GET', '/users/profile', 'UserController@getUser');
$router->addRoute('POST', '/users/logout', 'UserController@logout');
$router->addRoute('POST', '/users/password/forgot', 'UserController@sendRecoveryToken');
$router->addRoute('POST', '/users/password/reset', 'UserController@resetPassword');

$router->addRoute('POST', '/goals/{id}', 'GoalController@update');
$router->addRoute('POST', '/goals', 'GoalController@create');
$router->addRoute('GET', '/goals', 'GoalController@getAll');
$router->addRoute('DELETE', '/goals/{id}', 'GoalController@delete');
$router->addRoute('GET', '/goals/{id}', 'GoalController@getById');

$router->addRoute('POST', '/goals/{id}/transactions', 'TransactionController@create');
$router->addRoute('GET', '/goals/{id}/transactions', 'TransactionController@getAllForGoal');
$router->addRoute('DELETE', '/transactions/{id}', 'TransactionController@delete');

$route = $router->match($_SERVER['REQUEST_METHOD'], $_SERVER['REQUEST_URI']);

if ($route) {
  $callback = $route['callback'];
  $routeParams = $route['params'];

  if (is_callable($callback)) {
    call_user_func_array($callback, $routeParams);
  } else if (is_string($callback) && strpos($callback, '@') !== false) {
    list($controller, $method) = explode('@', $callback);
    $controllerClass = "server\\Controllers\\{$controller}";
    if (class_exists($controllerClass)) {
      $controllerInstance = new $controllerClass();
      if (method_exists($controllerInstance, $method)) {
        call_user_func_array([$controllerInstance, $method], $routeParams);
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