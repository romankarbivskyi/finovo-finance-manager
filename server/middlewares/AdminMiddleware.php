<?php

namespace server\middlewares;

use server\core\MiddlewareInterface;
use server\core\Request;
use server\core\Response;
use server\core\Auth;

class AdminMiddleware implements MiddlewareInterface
{
  public function handle(Request $request, callable $next)
  {
    $auth = Auth::getInstance();

    if (!$auth->isAuthenticated()) {
      Response::json(['error' => 'User not authenticated.'], 401);
      return;
    }

    if (!$auth->isAdmin()) {
      Response::json(['error' => 'Unauthorized access.'], 403);
      return;
    }

    return $next($request);
  }
}