<?php

namespace server\Controllers;

use server\Core\Auth;
use server\Core\Response;
use server\Models\User;
use server\Core\Request;

class UserController
{
  private $auth;
  private $userModel;

  public function __construct()
  {
    $this->auth = Auth::getInstance();
    $this->userModel = new User();
  }

  public function register(Request $request)
  {
    try {
      $data = $request->getJsonBody();
      $userData = [
        'username' => isset($data['username']) ? trim($data['username']) : '',
        'email' => isset($data['email']) ? trim($data['email']) : '',
        'password' => isset($data['password']) ? $data['password'] : ''
      ];

      $errors = $this->userModel->validateRegistration($userData);
      if (!empty($errors)) {
        Response::json(['errors' => $errors], 400);
        return;
      }

      $user = $this->auth->register($userData['username'], $userData['email'], $userData['password']);

      unset($user['password']);

      Response::json(['data' => $user], 201);
    } catch (\Exception $e) {
      Response::json(['error' => $e->getMessage()], 400);
    }
  }

  public function login(Request $request)
  {
    try {
      $data = $request->getJsonBody();
      $email = isset($data['email']) ? trim($data['email']) : '';
      $password = isset($data['password']) ? $data['password'] : '';

      if (empty($email) || empty($password)) {
        throw new \Exception("Email and password are required.");
      }

      $user = $this->userModel->validateCredentials($email, $password);

      if (!$user) {
        throw new \Exception("Invalid email or password.");
      }

      $this->auth->login($email, $password);

      unset($user['password']);

      Response::json(['data' => $user], 200);
    } catch (\Exception $e) {
      Response::json(['error' => $e->getMessage()], 401);
    }
  }


  public function getUser()
  {
    try {
      $user = $this->auth->getUser();
      if ($user) {
        Response::json(['data' => $user], 200);
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

  public function sendRecoveryToken(Request $request)
  {
    try {
      $data = $request->getJsonBody();
      $email = isset($data['email']) ? trim($data['email']) : '';

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

  public function resetPassword(Request $request)
  {
    try {
      $data = $request->getJsonBody();
      $token = isset($data['token']) ? trim($data['token']) : '';
      $newPassword = isset($data['password']) ? $data['password'] : '';

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