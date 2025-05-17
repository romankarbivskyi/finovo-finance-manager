<?php

namespace server\Models;

use server\Core\Database;
use server\Models\Goal;

class Transaction
{
  private $db;

  public function __construct()
  {
    $this->db = Database::getInstance();
  }

  public function create($goalId, $userId, $data)
  {
    $goal = $this->db->fetchOne("SELECT * FROM goals WHERE id = ?", [$goalId]);

    if (!$goal) {
      throw new \Exception("Goal not found.");
    }

    if ($goal['user_id'] !== $userId) {
      throw new \Exception("Access denied.");
    }

    $amount = $data['transaction_type'] === 'withdrawal' ? -$data['amount'] : $data['amount'];
    if ($goal['current_amount'] + $amount < 0) {
      throw new \Exception("Insufficient funds.");
    }

    $this->db->getConnection()->beginTransaction();
    $goalModel = new Goal();

    $updatedGoal = $goalModel->updateCurrentAmount($goalId, $data['amount'], $data['transaction_type']);
    if (!$updatedGoal) {
      $this->db->getConnection()->rollBack();
      throw new \Exception("Failed to update goal amount.");
    }

    $transactionId = $this->db->insert(
      "INSERT INTO transactions (goal_id, user_id, amount, currency, description, transaction_type) 
             VALUES (?, ?, ?, ?, ?, ?)",
      [
        $goalId,
        $userId,
        $data['amount'],
        $goal['currency'],
        $data['description'],
        $data['transaction_type'],
      ]
    );

    if (!$transactionId) {
      $this->db->getConnection()->rollBack();
      throw new \Exception("Failed to create transaction.");
    }

    $this->db->getConnection()->commit();
    return $this->getById($transactionId);
  }

  public function getById($id)
  {
    return $this->db->fetchOne("SELECT * FROM transactions WHERE id = ?", [$id]);
  }

  public function getAllForUser($userId, $limit = 10, $offset = 0)
  {
    return $this->db->fetchAll(
      "SELECT * FROM transactions WHERE user_id = ? ORDER BY id DESC LIMIT ? OFFSET ?",
      [$userId, $limit, $offset]
    );
  }

  public function getTotalForUser($userId)
  {
    return $this->db->fetchOne("SELECT COUNT(*) as count FROM transactions WHERE user_id = ?", [$userId])['count'];
  }

  public function getAllForGoal($goalId, $limit = 10, $offset = 0)
  {
    return $this->db->fetchAll(
      "SELECT * FROM transactions WHERE goal_id = ? ORDER BY id DESC LIMIT ? OFFSET ?",
      [$goalId, $limit, $offset]
    );
  }

  public function getTotalForGoal($goalId)
  {
    return $this->db->fetchOne("SELECT COUNT(*) as count FROM transactions WHERE goal_id = ?", [$goalId])['count'];
  }

  public function delete($id, $userId)
  {
    $transaction = $this->getById($id);
    if (!$transaction || $transaction['user_id'] !== $userId) {
      throw new \Exception("Transaction not found or access denied.");
    }
    $this->db->getConnection()->beginTransaction();
    $goalModel = new Goal();
    $goalModel->updateCurrentAmount($transaction['goal_id'], -$transaction['amount'], $transaction['transaction_type']);

    $this->db->query("DELETE FROM transactions WHERE id = ?", [$id]);

    return $this->db->getConnection()->commit() ? true : false;
  }
}