<?php

namespace server\middlewares;

use server\core\MiddlewareInterface;
use server\core\Request;
use server\core\Response;
use server\core\Session;
use server\models\User;

class AdminMiddleware implements MiddlewareInterface
{
  public function handle(Request $request, callable $next)
  {
    $session = Session::getInstance();
    $userModel = new User();

    if (!$session->has('user_id')) {
      Response::json(['error' => 'User not authenticated.'], 401);
      return;
    }

    $userId = $session->get('user_id');
    $user = $userModel->findById($userId);

    if (!$user || $user['role'] !== 'admin') {
      Response::json(['error' => 'Unauthorized access.'], 403);
      return;
    }

    return $next($request);
  }
}