<?php

namespace server\Controllers;

use server\Core\Auth;
use server\Core\JsonView;

class UserController
{
  private $auth;

  public function __construct()
  {
    $this->auth = Auth::getInstance();
  }

  public function register()
  {
    try {
      $username = isset($_POST['username']) ? trim($_POST['username']) : '';
      $email = isset($_POST['email']) ? trim($_POST['email']) : '';
      $password = isset($_POST['password']) ? $_POST['password'] : '';

      if (empty($username) || empty($email) || empty($password)) {
        throw new \Exception("Username, email, and password are required.");
      }

      if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new \Exception("Invalid email format.");
      }

      if (strlen($password) < 6) {
        throw new \Exception("Password must be at least 6 characters long.");
      }

      $user = $this->auth->register($username, $email, $password);
      JsonView::render($user, 201);
    } catch (\Exception $e) {
      JsonView::render(['error' => $e->getMessage()], 400);
    }
  }

  public function login()
  {
    try {
      $email = isset($_POST['email']) ? trim($_POST['email']) : '';
      $password = isset($_POST['password']) ? $_POST['password'] : '';

      if (empty($email) || empty($password)) {
        throw new \Exception("Email and password are required.");
      }

      if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new \Exception("Invalid email format.");
      }

      $user = $this->auth->login($email, $password);
      JsonView::render($user, 200);
    } catch (\Exception $e) {
      JsonView::render(['error' => $e->getMessage()], 401);
    }
  }

  public function getUser()
  {
    try {
      $user = $this->auth->getUser();
      if ($user) {
        JsonView::render($user, 200);
      } else {
        JsonView::render(['error' => 'User not authenticated.'], 401);
      }
    } catch (\Exception $e) {
      JsonView::render(['error' => 'Failed to retrieve user.'], 500);
    }
  }

  public function logout()
  {
    try {
      $this->auth->logout();
      JsonView::render(['message' => 'Logged out successfully.'], 200);
    } catch (\Exception $e) {
      JsonView::render(['error' => 'Logout failed.'], 500);
    }
  }
}