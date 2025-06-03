<?php

namespace server\middlewares;

use server\core\MiddlewareInterface;
use server\core\Request;
use server\core\Response;
use server\core\Session;

class AuthMiddleware implements MiddlewareInterface
{
  public function handle(Request $request, callable $next)
  {
    $session = Session::getInstance();

    if (!$session->has('user_id')) {
      Response::json(['error' => 'User not authenticated.'], 401);
      return;
    }

    return $next($request);
  }
}