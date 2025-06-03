<?php

namespace server\controllers;

use server\core\Response;
use server\models\User;
use server\core\Request;
use server\utils\HttpClient;
use server\core\Session;

class UserController
{
  private $userModel;
  private $session;

  public function __construct()
  {
    $this->userModel = new User();
    $this->session = Session::getInstance();
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

      $existingUser = $this->userModel->findByEmail($userData['email']);
      if ($existingUser) {
        throw new \Exception("Email already exists.");
      }

      $user = $this->userModel->create($userData);

      $this->session->set('user_id', $user['id']);
      $this->session->regenerate();

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

      $this->session->set('user_id', $user['id']);
      $this->session->regenerate();

      unset($user['password']);

      Response::json(['data' => $user], 200);
    } catch (\Exception $e) {
      Response::json(['error' => $e->getMessage()], 401);
    }
  }

  public function getUser()
  {
    try {
      $userId = $this->session->get('user_id');
      $user = $this->userModel->findById($userId);

      if (!$user) {
        $this->session->remove('user_id');
        throw new \Exception("User not found.");
      }

      unset($user['password']);
      Response::json(['data' => $user], 200);
    } catch (\Exception $e) {
      Response::json(['error' => 'Failed to retrieve user.'], 500);
    }
  }

  public function logout()
  {
    try {
      $this->session->destroy();
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

      Response::json(['message' => 'Recovery email sent successfully.'], 200);
    } catch (\Exception $e) {
      Response::json(['error' => $e->getMessage()], 400);
    }
  }

  public function resetPassword(Request $request)
  {
    try {
      $data = $request->getJsonBody();
      $token = isset($data['token']) ? $data['token'] : '';
      $password = isset($data['password']) ? $data['password'] : '';

      if (empty($token) || empty($password)) {
        throw new \Exception("Token and password are required.");
      }

      if (strlen($password) < 6) {
        throw new \Exception("Password must be at least 6 characters long.");
      }

      $userId = $this->userModel->validateRecoveryToken($token);
      $this->userModel->updatePassword($userId, $password);

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

      $userId = $this->session->get('user_id');
      $user = $this->userModel->findById($userId);

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
      $userId = $this->session->get('user_id');

      $updatedData = [
        'username' => isset($data['username']) ? trim($data['username']) : '',
        'email' => isset($data['email']) ? trim($data['email']) : ''
      ];

      $errors = $this->userModel->validateProfileUpdate($updatedData);
      if (!empty($errors)) {
        Response::json(['errors' => $errors], 400);
        return;
      }

      $this->userModel->updateProfile($userId, $updatedData);

      Response::json(['message' => 'Profile updated successfully.'], 200);
    } catch (\Exception $e) {
      Response::json(['error' => $e->getMessage()], 400);
    }
  }

  public function delete($id)
  {
    try {
      $userId = $this->session->get('user_id');
      $user = $this->userModel->findById($userId);

      if ($user['role'] !== 'admin' && $user['id'] != ($id ?? null)) {
        Response::json(['error' => 'Unauthorized access.'], 403);
        return;
      }

      $this->userModel->deleteUser($id ?? $user['id']);

      if ($user['id'] == ($id ?? null)) {
        $this->session->destroy();
      }

      Response::json(['message' => 'Account deleted successfully.'], 200);
    } catch (\Exception $e) {
      Response::json(['error' => $e->getMessage()], 400);
    }
  }

  public function getAllUsers(Request $request)
  {
    try {
      $limit = $request->query('limit', 10);
      $offset = $request->query('offset', 0);
      $sortBy = $request->query('sort_by', 'id');
      $sortOrder = $request->query('sort_order', 'asc');
      $search = $request->query('search', '');

      $users = $this->userModel->getAll($limit, $offset, $sortBy, $sortOrder, $search);
      $total = $this->userModel->getTotalUsers($search);

      Response::json(['data' => ['users' => $users, 'total' => $total]], 200);
    } catch (\Exception $e) {
      Response::json(['error' => $e->getMessage()], 400);
    }
  }
}