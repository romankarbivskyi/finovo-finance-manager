<?php

namespace server\models;

use server\core\Database;
use server\core\ImageHandler;

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
      $imageUrl = ImageHandler::getImageUrl($imageName);
    }

    $goalId = $this->db->insert(
      "INSERT INTO goals (name, description, target_date, current_amount, target_amount, currency, preview_image, user_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        $data['name'],
        $data['description'] ?? null,
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

  public function getAllForUser($userId, $limit = 10, $offset = 0, $currency = null, $status = null, $sort = null, $search = null)
  {
    $query = "SELECT * FROM goals WHERE user_id = ?";
    $params = [$userId];

    if ($currency !== null && strtolower($currency) !== 'all') {
      $query .= " AND currency = ?";
      $params[] = $currency;
    }

    if ($status !== null && strtolower($status) !== 'all') {
      $query .= " AND status = ?";
      $params[] = $status;
    }

    if ($search !== null && $search !== '') {
      $query .= " AND (LOWER(name) LIKE ? OR LOWER(description) LIKE ?)";
      $params[] = '%' . strtolower($search) . '%';
      $params[] = '%' . strtolower($search) . '%';
    }

    if ($sort !== null && strtolower($sort) === 'old') {
      $query .= " ORDER BY id ASC";
    } elseif ($sort !== null && strtolower($sort) === 'new') {
      $query .= " ORDER BY id DESC";
    } else {
      $query .= " ORDER BY id DESC";
    }

    $query .= " LIMIT ? OFFSET ?";
    $params[] = $limit;
    $params[] = $offset;

    return $this->db->fetchAll($query, $params);
  }

  public function getTotalForUser($userId, $currency = null, $status = null, $search = null)
  {
    $query = "SELECT COUNT(*) as count FROM goals WHERE user_id = ?";
    $params = [$userId];

    if ($currency !== null && strtolower($currency) !== 'all') {
      $query .= " AND currency = ?";
      $params[] = $currency;
    }

    if ($status !== null && strtolower($status) !== 'all') {
      $query .= " AND status = ?";
      $params[] = $status;
    }

    if ($search !== null && $search !== '') {
      $query .= " AND (LOWER(name) LIKE ? OR LOWER(description) LIKE ?)";
      $params[] = '%' . strtolower($search) . '%';
      $params[] = '%' . strtolower($search) . '%';
    }

    return $this->db->fetchOne($query, $params)['count'];
  }

  public function update($id, $userId, $data, $image = null, $preventImageDelete = false)
  {
    $goal = $this->db->fetchOne("SELECT * FROM goals WHERE id = ? AND user_id = ?", [$id, $userId]);
    if (!$goal) {
      return false;
    }

    $imageUrl = $goal['preview_image'];

    if ($image && $image['error'] === UPLOAD_ERR_OK) {
      if ($goal['preview_image']) {
        $imageName = basename(str_replace('\\', '/', $goal['preview_image']));
        ImageHandler::deleteImage($imageName);
      }
      $imageName = ImageHandler::uploadImage($image);
      $imageUrl = ImageHandler::getImageUrl($imageName);
    } elseif (isset($data['remove_image']) && $data['remove_image'] === 'true' && !$preventImageDelete) {
      if ($goal['preview_image']) {
        $imageName = basename(str_replace('\\', '/', $goal['preview_image']));
        ImageHandler::deleteImage($imageName);
      }
      $imageUrl = null;
    }

    $status = $data['status'] ?? $goal['status'] ?? 'active';

    $this->db->query(
      "UPDATE goals SET 
        name = ?, 
        description = ?, 
        target_date = ?, 
        current_amount = ?, 
        target_amount = ?, 
        currency = ?, 
        preview_image = ?,
        status = ?
      WHERE id = ? AND user_id = ?",
      [
        $data['name'],
        $data['description'] ?? $goal['description'],
        $data['target_date'],
        $data['current_amount'],
        $data['target_amount'],
        $data['currency'],
        $imageUrl,
        $status,
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

  public function validate($data)
  {
    $errors = [];

    $requiredFields = ['name', 'target_date', 'current_amount', 'target_amount', 'currency'];
    foreach ($requiredFields as $field) {
      if (!isset($data[$field]) || $data[$field] === '') {
        $errors[$field] = "Field '{$field}' is required.";
      }
    }

    if (isset($data['current_amount']) && (!is_numeric($data['current_amount']) || $data['current_amount'] < 0)) {
      $errors['current_amount'] = "Current amount must be zero or a positive number.";
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

  public function updateCurrentAmount($goalId, $amount, $transactionType)
  {
    $goal = $this->getById($goalId);

    if (!$goal) {
      throw new \Exception("Goal not found.");
    }

    if ($transactionType === 'contribution') {
      $goal['current_amount'] += $amount;
    } elseif ($transactionType === 'withdrawal') {
      $goal['current_amount'] -= $amount;
    } else {
      throw new \Exception("Invalid transaction type.");
    }

    $goal['current_amount'] = max(0, $goal['current_amount']);
    $goal['status'] = $goal['current_amount'] >= $goal['target_amount'] ? 'completed' : 'active';

    return $this->update($goalId, $goal['user_id'], $goal, null, true);
  }

  public function getStats($userId)
  {
    $totalGoals = $this->getTotalForUser($userId);
    $completedGoals = $this->db->fetchOne("SELECT COUNT(*) as count FROM goals WHERE user_id = ? AND status = 'completed'", [$userId])['count'];
    $activeGoals = $totalGoals - $completedGoals;

    return [
      'total' => $totalGoals,
      'completed' => $completedGoals,
      'active' => $activeGoals
    ];
  }
}