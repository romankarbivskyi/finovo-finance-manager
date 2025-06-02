<?php

namespace server\core;

interface MiddlewareInterface
{
  public function handle(Request $request, callable $next);
}