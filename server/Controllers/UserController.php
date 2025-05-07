<?php

namespace server\Controllers;

use server\Core\Auth;
use server\Core\Response;
use server\Models\User;

class UserController
{
  private $auth;
  private $userModel;

  public function __construct()
  {
    $this->auth = Auth::getInstance();
    $this->userModel = new User();
  }

  public function register()
  {
    try {
      $userData = [
        'username' => isset($_POST['username']) ? trim($_POST['username']) : '',
        'email' => isset($_POST['email']) ? trim($_POST['email']) : '',
        'password' => isset($_POST['password']) ? $_POST['password'] : ''
      ];

      $errors = $this->userModel->validateRegistration($userData);
      if (!empty($errors)) {
        Response::json(['errors' => $errors], 400);
        return;
      }

      $user = $this->auth->register($userData['username'], $userData['email'], $userData['password']);

      unset($user['password']);

      Response::json($user, 201);
    } catch (\Exception $e) {
      Response::json(['error' => $e->getMessage()], 400);
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

      $user = $this->userModel->validateCredentials($email, $password);

      if (!$user) {
        throw new \Exception("Invalid email or password.");
      }

      $this->auth->login($email, $password);

      unset($user['password']);

      Response::json($user, 200);
    } catch (\Exception $e) {
      Response::json(['error' => $e->getMessage()], 401);
    }
  }

  public function getUser()
  {
    try {
      $user = $this->auth->getUser();
      if ($user) {
        unset($user['password']);
        Response::json($user, 200);
      } else {
        Response::json(['error' => 'User not authenticated.'], 401);
      }
    } catch (\Exception $e) {
      Response::json(['error' => 'Failed to retrieve user.'], 500);
    }
  }

  public function logout()
  {
    try {
      $this->auth->logout();
      Response::json(['message' => 'Logged out successfully.'], 200);
    } catch (\Exception $e) {
      Response::json(['error' => 'Logout failed.'], 500);
    }
  }

  public function sendRecoveryToken()
  {
    try {
      $email = isset($_POST['email']) ? trim($_POST['email']) : '';

      if (empty($email)) {
        throw new \Exception("Email is required.");
      }

      $user = $this->userModel->findByEmail($email);

      if (!$user) {
        throw new \Exception("Email not found.");
      }

      $token = $this->userModel->generateRecoveryToken($user['id']);

      Response::json(['message' => 'Recovery token sent.'], 200);
    } catch (\Exception $e) {
      Response::json(['error' => $e->getMessage()], 400);
    }
  }

  public function resetPassword()
  {
    try {
      $token = isset($_POST['token']) ? trim($_POST['token']) : '';
      $newPassword = isset($_POST['password']) ? $_POST['password'] : '';

      if (empty($token) || empty($newPassword)) {
        throw new \Exception("Token and new password are required.");
      }

      $userId = $this->userModel->validateRecoveryToken($token);

      if (!$userId) {
        throw new \Exception("Invalid or expired token.");
      }

      $this->userModel->updatePassword($userId, $newPassword);

      Response::json(['message' => 'Password reset successfully.'], 200);
    } catch (\Exception $e) {
      Response::json(['error' => $e->getMessage()], 400);
    }
  }
}