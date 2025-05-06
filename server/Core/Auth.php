<?php

namespace server\Core;

class Auth
{
  public static $instance = null;
  private $db;
  private $session;


  private function __construct()
  {
    $this->db = Database::getInstance();
    $this->session = Session::getInstance();
  }

  public static function getInstance()
  {
    if (self::$instance === null) {
      self::$instance = new self();
    }
    return self::$instance;
  }

  public function register($username, $password)
  {
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
    $userId = $this->db->insert("INSERT INTO users (username, password) VALUES (?, ?)", [$username, $hashedPassword]);

    if (!$userId) {
      throw new \Exception("User registration failed.");
    }

    $user = $this->db->fetchOne("SELECT * FROM users WHERE id = ?", [$userId]);

    $this->session->set('user_id', $user['id']);

    return $user;
  }

  public function login($username, $password)
  {
    $user = $this->db->fetchOne("SELECT * FROM users WHERE username = ?", [$username]);

    if (!$user || !password_verify($password, $user['password'])) {
      throw new \Exception("Invalid username or password.");
    }

    $this->session->set('user_id', $user['id']);
    $this->session->regenerate();
    return $user;
  }

  public function logout()
  {
    $this->session->destroy();
  }

  public function isAuthenticated()
  {
    return $this->session->has('user_id');
  }
}