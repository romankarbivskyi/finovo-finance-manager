<?php

namespace server\Core;

use server\Models\User;

class Auth
{
  public static $instance = null;
  private $userModel;
  private $session;

  private function __construct()
  {
    $this->userModel = new User();
    $this->session = Session::getInstance();
  }

  public static function getInstance()
  {
    if (self::$instance === null) {
      self::$instance = new self();
    }
    return self::$instance;
  }

  public function register($username, $email, $password)
  {
    $existingUser = $this->userModel->findByEmail($email);
    if ($existingUser) {
      throw new \Exception("Email already exists.");
    }

    $userData = [
      'username' => $username,
      'email' => $email,
      'password' => $password
    ];

    $user = $this->userModel->create($userData);

    $this->session->set('user_id', $user['id']);
    $this->session->regenerate();

    unset($user['password']);
    return $user;
  }

  public function login($email, $password)
  {
    $user = $this->userModel->validateCredentials($email, $password);

    if (!$user) {
      throw new \Exception("Invalid email or password.");
    }

    $this->session->set('user_id', $user['id']);
    $this->session->regenerate();

    unset($user['password']);
    return $user;
  }

  public function getUser()
  {
    if (!$this->isAuthenticated()) {
      return null;
    }

    $userId = $this->session->get('user_id');
    $user = $this->userModel->findById($userId);

    if (!$user) {
      $this->session->remove('user_id');
      return null;
    }

    unset($user['password']);
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