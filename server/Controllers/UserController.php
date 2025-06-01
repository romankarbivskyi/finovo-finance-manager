<?php

namespace server\Controllers;

use server\Core\Auth;
use server\Core\Response;
use server\Models\User;
use server\Core\Request;
use server\Utils\HttpClient;

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

      $frontendUrl = getenv('FRONTEND_URL') ?: 'http://localhost:5173';

      $resp = HttpClient::post(
        'https://send.api.mailtrap.io/api/send',
        [
          'from' => [
            'email' => 'finovo@demomailtrap.co',
            'name' => 'Finovo'
          ],
          'to' => [
            [
              'email' => $email,
            ]
          ],
          'subject' => 'Password Recovery',
          'html' => "<p><a href=\"$frontendUrl/reset-password?token=$token\">Click here to reset your password</a>.</p>",
          'category' => 'Password Recovery'
        ],
        [
          'Authorization: Bearer 52510613516977ebc55ee48eb08a55cb'
        ],
        true
      );

      if ($resp['statusCode'] !== 200) {
        $this->userModel->deleteRecoveryToken($token);
        throw new \Exception("Failed to send recovery email.");
      }

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

  public function changePassword(Request $request)
  {
    try {
      $data = $request->getJsonBody();
      $currentPassword = isset($data['current_password']) ? $data['current_password'] : '';
      $newPassword = isset($data['new_password']) ? $data['new_password'] : '';

      if (empty($currentPassword) || empty($newPassword)) {
        throw new \Exception("Current and new passwords are required.");
      }

      $user = $this->auth->getUser();

      if (!$user) {
        throw new \Exception("User not authenticated.");
      }

      if (!$this->userModel->validateCredentials($user['email'], $currentPassword)) {
        throw new \Exception("Current password is incorrect.");
      }

      $this->userModel->updatePassword($user['id'], $newPassword);

      Response::json(['message' => 'Password changed successfully.'], 200);
    } catch (\Exception $e) {
      Response::json(['error' => $e->getMessage()], 400);
    }
  }

  public function updateProfile(Request $request)
  {
    try {
      $data = $request->getJsonBody();
      $user = $this->auth->getUser();

      if (!$user) {
        throw new \Exception("User not authenticated.");
      }

      $updatedData = [
        'username' => isset($data['username']) ? trim($data['username']) : '',
        'email' => isset($data['email']) ? trim($data['email']) : ''
      ];

      $errors = $this->userModel->validateProfileUpdate($updatedData);
      if (!empty($errors)) {
        Response::json(['errors' => $errors], 400);
        return;
      }

      $this->userModel->updateProfile($user['id'], $updatedData);

      Response::json(['message' => 'Profile updated successfully.'], 200);
    } catch (\Exception $e) {
      Response::json(['error' => $e->getMessage()], 400);
    }
  }

  public function delete($id)
  {
    try {
      $user = $this->auth->getUser();

      if (!$user) {
        throw new \Exception("User not authenticated.");
      }

      if (!$this->auth->isAdmin() && $user['id'] != ($id ?? null)) {
        Response::json(['error' => 'Unauthorized access.'], 403);
        return;
      }

      $this->userModel->deleteUser($id ?? $user['id']);

      if ($user['id'] == ($id ?? null)) {
        $this->auth->logout();
      }

      Response::json(['message' => 'Account deleted successfully.'], 200);
    } catch (\Exception $e) {
      Response::json(['error' => $e->getMessage()], 400);
    }
  }

  public function getAllUsers(Request $request)
  {
    try {
      $user = $this->auth->getUser();

      if (!$user) {
        throw new \Exception("User not authenticated.");
      }

      if (!$this->auth->isAdmin()) {
        Response::json(['error' => 'Unauthorized access.'], 403);
        return;
      }

      $limit = $request->query('limit', 10);
      $offset = $request->query('offset', 0);
      $sort = $request->query('sort', "new");

      $users = $this->userModel->getAll($limit, $offset, $sort);
      $total = $this->userModel->getTotalUsers();
      Response::json([
        'data' => [
          'users' => $users,
          'total' => $total,
        ]
      ], 200);
    } catch (\Exception $e) {
      Response::json(['error' => 'Failed to retrieve users.'], 500);
    }
  }
}