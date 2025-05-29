<?php

namespace server\Core;

class Session
{
  private static $instance = null;

  private function __construct()
  {
    if (session_status() == PHP_SESSION_NONE) {
      ini_set('session.use_strict_mode', 1);
      ini_set('session.use_only_cookies', 1);
      ini_set('session.cookie_httponly', 1);
      ini_set('session.cookie_lifetime', 18000);

      if (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') {
        ini_set('session.cookie_secure', 1);
      }

      session_start();
    }
  }

  public static function getInstance()
  {
    if (self::$instance === null) {
      self::$instance = new self();
    }
    return self::$instance;
  }

  public function set($key, $value)
  {
    $_SESSION[$key] = $value;
  }

  public function get($key, $default = null)
  {
    return isset($_SESSION[$key]) ? $_SESSION[$key] : $default;
  }

  public function has($key)
  {
    return isset($_SESSION[$key]);
  }

  public function remove($key)
  {
    if (isset($_SESSION[$key])) {
      unset($_SESSION[$key]);
    }
  }

  public function clear()
  {
    session_unset();
  }

  public function destroy()
  {
    session_destroy();
    self::$instance = null;
  }

  public function regenerate($deleteOldSession = true)
  {
    session_regenerate_id($deleteOldSession);
  }

  public function getAll()
  {
    return $_SESSION;
  }
}