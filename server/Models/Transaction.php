<?php

namespace server\models;

use server\core\Database;
use server\helpers\ExchangeRate;
use server\models\Goal;

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

    $conversionRate = ExchangeRate::getPair($data['currency'], $goal['currency']);
    $convertedAmount = $data['amount'] * $conversionRate;

    $amount = $data['transaction_type'] === 'withdrawal' ? -$convertedAmount : $convertedAmount;
    if ($goal['current_amount'] + $amount < 0) {
      throw new \Exception("Insufficient funds.");
    }

    $this->db->getConnection()->beginTransaction();
    $goalModel = new Goal();

    $updatedGoal = $goalModel->updateCurrentAmount($goalId, $convertedAmount, $data['transaction_type']);
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
        $data['currency'],
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

  public function getAllForUserWithTotal($userId, $limit = 10, $offset = 0)
  {
    $baseQuery = "FROM transactions 
                  JOIN goals ON transactions.goal_id = goals.id 
                  WHERE transactions.user_id = ?";
    $params = [$userId];

    $countQuery = "SELECT COUNT(*) as count " . $baseQuery;
    $total = $this->db->fetchOne($countQuery, $params)['count'];

    $selectQuery = "SELECT transactions.*, goals.name AS goal_name " . $baseQuery .
      " ORDER BY transactions.id DESC LIMIT ? OFFSET ?";
    $selectParams = array_merge($params, [$limit, $offset]);

    $transactions = $this->db->fetchAll($selectQuery, $selectParams);

    return [
      'transactions' => $transactions,
      'total' => $total
    ];
  }

  public function getAllForGoalWithTotal($goalId, $limit = 10, $offset = 0)
  {
    $baseQuery = "FROM transactions 
                  JOIN goals ON transactions.goal_id = goals.id 
                  WHERE transactions.goal_id = ?";
    $params = [$goalId];

    $countQuery = "SELECT COUNT(*) as count " . $baseQuery;
    $total = $this->db->fetchOne($countQuery, $params)['count'];

    $selectQuery = "SELECT transactions.*, goals.name AS goal_name " . $baseQuery .
      " ORDER BY transactions.id DESC LIMIT ? OFFSET ?";
    $selectParams = array_merge($params, [$limit, $offset]);

    $transactions = $this->db->fetchAll($selectQuery, $selectParams);

    return [
      'transactions' => $transactions,
      'total' => $total
    ];
  }

  public function delete($id, $userId)
  {
    $transaction = $this->getById($id);
    if (!$transaction || $transaction['user_id'] !== $userId) {
      throw new \Exception("Transaction not found or access denied.");
    }

    $goalModel = new Goal();
    $goal = $goalModel->getById($transaction['goal_id']);

    $conversionRate = ExchangeRate::getPair($transaction['currency'], $goal['currency']);
    $convertedAmount = $transaction['amount'] * $conversionRate;

    $this->db->getConnection()->beginTransaction();
    $goalModel->updateCurrentAmount($transaction['goal_id'], -$convertedAmount, $transaction['transaction_type']);

    $this->db->query("DELETE FROM transactions WHERE id = ?", [$id]);

    return $this->db->getConnection()->commit() ? true : false;
  }

  public function validate($data)
  {
    $errors = [];

    if (empty($data['amount'])) {
      $errors["amount"] = "Amount is required.";
    } elseif (!is_numeric($data['amount'])) {
      $errors["amount"] = "Amount must be a number.";
    } elseif ($data['amount'] <= 0) {
      $errors["amount"] = "Amount must be greater than zero.";
    }
    if (empty($data['currency'])) {
      $errors["currency"] = "Currency is required.";
    } elseif (!in_array($data['currency'], ['USD', 'UAH', 'EUR'])) {
      $errors["currency"] = "Invalid currency.";
    }
    if (empty($data['transaction_type'])) {
      $errors["transaction_type"] = "Transaction type is required.";
    } elseif (!in_array($data['transaction_type'], ['contribution', 'withdrawal'])) {
      $errors["transaction_type"] = "Invalid transaction type.";
    }

    return $errors;
  }

  public function getStats($userId, $startDate, $endDate)
  {
    $query = "SELECT 
                SUM(CASE WHEN transaction_type = 'contribution' THEN amount ELSE 0 END) AS total_contributions,
                SUM(CASE WHEN transaction_type = 'withdrawal' THEN amount ELSE 0 END) AS total_withdrawals,
                COUNT(*) AS total_transactions,
                DATE(created_at) AS created_at
              FROM transactions
              WHERE user_id = ? AND created_at 
              BETWEEN ? AND ?
              GROUP BY DATE(created_at)
              ORDER BY created_at";

    return $this->db->fetchAll($query, [$userId, $startDate, $endDate]);
  }
}