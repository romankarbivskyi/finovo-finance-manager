<?php

namespace server\Models;

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

  public function validateCredentials($email, $password)
  {
    $user = $this->findByEmail($email);

    if (!$user || !password_verify($password, $user['password'])) {
      return false;
    }

    return $user;
  }

  public static function validateRegistration($data)
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
}