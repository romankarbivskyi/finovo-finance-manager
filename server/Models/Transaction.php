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

    $this->db->getConnection()->beginTransaction();
    $goalModel = new Goal();

    $updatedGoal = $goalModel->updateCurrentAmount($goalId, $data['amount'], $data['transaction_type']);
    if (!$updatedGoal) {
      $this->db->getConnection()->rollBack();
      throw new \Exception("Failed to update goal amount.");
    }

    $transactionId = $this->db->insert(
      "INSERT INTO transactions (goal_id, user_id, amount, description, transaction_type) 
             VALUES (?, ?, ?, ?, ?)",
      [
        $goalId,
        $userId,
        $data['amount'],
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

  public function getAllForGoal($goalId)
  {
    return $this->db->fetchAll("SELECT * FROM transactions WHERE goal_id = ? ORDER BY transaction_date DESC", [$goalId]);
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