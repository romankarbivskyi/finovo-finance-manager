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
      $json_payload = file_get_contents('php://input');
      if (empty($json_payload)) {
        throw new \Exception("Invalid JSON payload.");
      }
      $data = json_decode($json_payload, true);
      $user = $this->auth->register($data["username"], $data["email"], $data["password"]);
      JsonView::render($user, 201);
    } catch (\Exception $e) {
      JsonView::render(['error' => $e->getMessage()], 400);
    }
  }

  public function login()
  {
    try {
      $json_payload = file_get_contents('php://input');
      if (empty($json_payload)) {
        throw new \Exception("Invalid JSON payload.");
      }
      $data = json_decode($json_payload, true);
      $user = $this->auth->login($data["email"], $data["password"]);
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