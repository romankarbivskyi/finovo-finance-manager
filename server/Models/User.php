<?php

namespace server\models;

use server\Core\Database;

class User
{
  private $db;

  public function __construct()
  {
    $this->db = Database::getInstance();
  }

  public function findByEmail($email)
  {
    return $this->db->fetchOne("SELECT * FROM users WHERE email = ?", [$email]);
  }

  public function findById($id)
  {
    return $this->db->fetchOne("SELECT * FROM users WHERE id = ?", [$id]);
  }

  public function create($data)
  {
    $existingUser = $this->findByEmail($data['email']);
    if ($existingUser) {
      throw new \Exception("Email already exists.");
    }

    $hashedPassword = password_hash($data['password'], PASSWORD_BCRYPT);

    $userId = $this->db->insert(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [$data['username'], $data['email'], $hashedPassword]
    );

    return $this->findById($userId);
  }

  public function getAllWithTotal($limit = 10, $offset = 0, $sortBy = null, $sortOrder = "asc", $search = null)
  {
    if ($limit < 1 || $offset < 0) {
      throw new \InvalidArgumentException("Invalid limit or offset.");
    }

    $baseQuery = "FROM users";
    $params = [];

    if ($search) {
      $baseQuery .= " WHERE LOWER(username) LIKE ? OR LOWER(email) LIKE ?";
      $params[] = "%" . strtolower($search) . "%";
      $params[] = "%" . strtolower($search) . "%";
    }

    $countQuery = "SELECT COUNT(*) as total " . $baseQuery;
    $total = $this->db->fetchOne($countQuery, $params)['total'];

    $sortBy = in_array($sortBy, ['username', 'email', 'role', 'created_at']) ? $sortBy : 'created_at';
    $sortOrder = strtolower($sortOrder) === 'desc' ? 'DESC' : 'ASC';

    $selectQuery = "SELECT id, username, email, role, created_at " . $baseQuery .
      " ORDER BY $sortBy $sortOrder LIMIT ? OFFSET ?";
    $selectParams = array_merge($params, [$limit, $offset]);

    $users = $this->db->fetchAll($selectQuery, $selectParams);

    return [
      'users' => $users,
      'total' => $total
    ];
  }

  public function validateCredentials($email, $password)
  {
    $user = $this->findByEmail($email);

    if (!$user || !password_verify($password, $user['password'])) {
      return false;
    }

    return $user;
  }

  public function validateRegistration($data)
  {
    $errors = [];

    if (empty($data['username'])) {
      $errors['username'] = "Username is required.";
    }

    if (empty($data['email'])) {
      $errors['email'] = "Email is required.";
    } elseif (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
      $errors['email'] = "Invalid email format.";
    }

    if (empty($data['password'])) {
      $errors['password'] = "Password is required.";
    } elseif (strlen($data['password']) < 6) {
      $errors['password'] = "Password must be at least 6 characters long.";
    }

    return $errors;
  }

  public function generateRecoveryToken($userId)
  {
    $user = $this->findById($userId);
    if (!$user) {
      throw new \Exception("User not found.");
    }

    $this->db->query(
      "DELETE FROM password_resets WHERE user_id = ?",
      [$userId]
    );

    $token = bin2hex(random_bytes(16));
    $createdAt = date('Y-m-d H:i:s');
    $expiresAt = date('Y-m-d H:i:s', strtotime('+15 minutes'));

    $this->db->insert(
      "INSERT INTO password_resets (user_id, token, created_at, expires_at) VALUES (?, ?, ?, ?)",
      [
        $userId,
        $token,
        $createdAt,
        $expiresAt,
      ]
    );
    return $token;
  }

  public function validateRecoveryToken($token)
  {
    $reset = $this->db->fetchOne(
      "SELECT * FROM password_resets WHERE token = ?",
      [$token]
    );

    if (!$reset) {
      throw new \Exception("Invalid or expired token.");
    }

    if ($reset['expires_at'] < date('Y-m-d H:i:s')) {
      $this->deleteRecoveryToken($token);
      throw new \Exception("Token has expired.");
    }

    return $reset['user_id'];
  }

  public function updatePassword($userId, $newPassword)
  {
    try {
      $hashedPassword = password_hash($newPassword, PASSWORD_BCRYPT);
      $this->db->getConnection()->beginTransaction();
      $this->db->query(
        "UPDATE users SET password = ? WHERE id = ?",
        [$hashedPassword, $userId]
      );
      $this->db->query(
        "DELETE FROM password_resets WHERE user_id = ?",
        [$userId]
      );
      $this->db->getConnection()->commit();
    } catch (\Exception $e) {
      $this->db->getConnection()->rollBack();
      throw new \Exception("Failed to update password: " . $e->getMessage());
    }
  }

  public function deleteRecoveryToken($token)
  {
    $this->db->query(
      "DELETE FROM password_resets WHERE token = ?",
      [$token]
    );
  }

  public function validateProfileUpdate($data)
  {
    $errors = [];

    if (empty($data['username'])) {
      $errors['username'] = "Username is required.";
    }

    if (empty($data['email'])) {
      $errors['email'] = "Email is required.";
    } elseif (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
      $errors['email'] = "Invalid email format.";
    }

    return $errors;
  }

  public function updateProfile($userId, $data)
  {
    try {
      $existingUser = $this->findByEmail($data['email']);
      if ($existingUser && $existingUser['id'] != $userId) {
        throw new \Exception("Email already exists.");
      }

      $this->db->query(
        "UPDATE users SET username = ?, email = ? WHERE id = ?",
        [$data['username'], $data['email'], $userId]
      );
    } catch (\Exception $e) {
      throw new \Exception("Failed to update user: " . $e->getMessage());
    }
  }

  public function deleteUser($userId)
  {
    try {
      $this->db->query(
        "DELETE FROM users WHERE id = ?",
        [$userId]
      );
    } catch (\Exception $e) {
      throw new \Exception("Failed to delete user: " . $e->getMessage());
    }
  }
}