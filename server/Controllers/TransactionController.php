<?php

namespace server\Controllers;

use server\Core\Response;
use server\Core\Auth;
use server\Models\Transaction;

class TransactionController
{
  private $auth;
  private $transactionModel;

  public function __construct()
  {
    $this->auth = Auth::getInstance();
    $this->transactionModel = new Transaction();
  }

  public function create($id)
  {
    try {
      $user = $this->auth->getUser();

      if (!$user) {
        throw new \Exception("User not authenticated.");
      }

      $transaction = $this->transactionModel->create($id, $user['id'], $_POST);

      Response::json($transaction, 201);
    } catch (\Exception $e) {
      Response::json(['error' => $e->getMessage()], 400);
    }
  }

  public function getAllForGoal($goalId)
  {
    try {
      $user = $this->auth->getUser();

      if (!$user) {
        throw new \Exception("User not authenticated.");
      }

      $transactions = $this->transactionModel->getAllForGoal($goalId);

      Response::json($transactions, 200);
    } catch (\Exception $e) {
      Response::json(['error' => $e->getMessage()], 400);
    }
  }

  public function delete($transactionId)
  {
    try {
      $user = $this->auth->getUser();

      if (!$user) {
        throw new \Exception("User not authenticated.");
      }

      $transaction = $this->transactionModel->delete($transactionId, $user['id']);

      if (!$transaction) {
        throw new \Exception("Transaction not found or access denied.");
      }

      Response::json(['message' => 'Transaction deleted successfully.'], 200);
    } catch (\Exception $e) {
      Response::json(['error' => $e->getMessage()], 400);
    }
  }
}