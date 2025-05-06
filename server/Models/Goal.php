<?php

namespace server\Models;

use server\Core\Database;
use server\Core\ImageHandler;

class Goal
{
  private $db;

  public function __construct()
  {
    $this->db = Database::getInstance();
  }

  public function create($userId, $data, $image = null)
  {
    $imageUrl = null;
    if ($image && $image['error'] === UPLOAD_ERR_OK) {
      $imageName = ImageHandler::uploadImage($image);
      $imageUrl = $imageName;
    }

    $goalId = $this->db->insert(
      "INSERT INTO goals (name, description, target_date, current_amount, target_amount, currency, preview_image, user_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        $data['name'],
        $data['description'],
        $data['target_date'],
        $data['current_amount'],
        $data['target_amount'],
        $data['currency'],
        $imageUrl,
        $userId
      ]
    );

    return $this->getById($goalId);
  }

  public function getById($id)
  {
    return $this->db->fetchOne("SELECT * FROM goals WHERE id = ?", [$id]);
  }

  public function getAllForUser($userId)
  {
    return $this->db->fetchAll("SELECT * FROM goals WHERE user_id = ? ORDER BY created_at DESC", [$userId]);
  }

  public function update($id, $userId, $data, $image = null)
  {
    $goal = $this->db->fetchOne("SELECT * FROM goals WHERE id = ? AND user_id = ?", [$id, $userId]);
    if (!$goal) {
      return false;
    }

    $imageUrl = $goal['preview_image'];
    if ($image && $image['error'] === UPLOAD_ERR_OK) {
      if ($goal['preview_image']) {
        ImageHandler::deleteImage($goal['preview_image']);
      }
      $imageName = ImageHandler::uploadImage($image);
      $imageUrl = $imageName;
    }

    $this->db->query(
      "UPDATE goals SET 
        name = ?, 
        description = ?, 
        target_date = ?, 
        current_amount = ?, 
        target_amount = ?, 
        currency = ?, 
        preview_image = ? 
      WHERE id = ? AND user_id = ?",
      [
        $data['name'],
        $data['description'],
        $data['target_date'],
        $data['current_amount'],
        $data['target_amount'],
        $data['currency'],
        $imageUrl,
        $id,
        $userId
      ]
    );

    return $this->getById($id);
  }

  public function delete($id, $userId)
  {
    $goal = $this->db->fetchOne("SELECT * FROM goals WHERE id = ? AND user_id = ?", [$id, $userId]);
    if (!$goal) {
      return false;
    }

    if ($goal['preview_image']) {
      ImageHandler::deleteImage($goal['preview_image']);
    }

    $this->db->query("DELETE FROM goals WHERE id = ? AND user_id = ?", [$id, $userId]);
    return true;
  }

  public static function validate($data)
  {
    $errors = [];

    $requiredFields = ['name', 'description', 'target_date', 'current_amount', 'target_amount', 'currency'];
    foreach ($requiredFields as $field) {
      if (empty($data[$field])) {
        $errors[$field] = "Field '{$field}' is required.";
      }
    }

    if (isset($data['current_amount']) && (!is_numeric($data['current_amount']) || $data['current_amount'] < 0)) {
      $errors['current_amount'] = "Current amount must be a positive number.";
    }

    if (isset($data['target_amount']) && (!is_numeric($data['target_amount']) || $data['target_amount'] <= 0)) {
      $errors['target_amount'] = "Target amount must be a positive number greater than zero.";
    }

    if (isset($data['target_date']) && !preg_match('/^\d{4}-\d{2}-\d{2}$/', $data['target_date'])) {
      $errors['target_date'] = "Target date must be in YYYY-MM-DD format.";
    }

    $allowedCurrencies = ['USD', 'UAH', 'EUR'];
    if (isset($data['currency']) && !in_array(strtoupper($data['currency']), $allowedCurrencies, true)) {
      $errors['currency'] = "Invalid currency. Allowed values: USD, UAH, EUR.";
    }

    return $errors;
  }
}