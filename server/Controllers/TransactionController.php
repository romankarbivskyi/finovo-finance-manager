<?php

namespace server\Controllers;

use server\Core\Response;
use server\Core\Auth;
use server\Models\Transaction;
use server\Core\Request;

class TransactionController
{
  private $auth;
  private $transactionModel;

  public function __construct()
  {
    $this->auth = Auth::getInstance();
    $this->transactionModel = new Transaction();
  }

  public function create($id, Request $request)
  {
    try {
      $data = $request->getJsonBody();
      $user = $this->auth->getUser();

      if (!$user) {
        throw new \Exception("User not authenticated.");
      }

      $transaction = $this->transactionModel->create($id, $user['id'], $data);

      Response::json(['data' => $transaction], 201);
    } catch (\Exception $e) {
      Response::json(['error' => $e->getMessage()], 400);
    }
  }

  public function getAllForGoal($goalId, Request $request)
  {
    try {
      $limit = $request->query('limit', 10);
      $offset = $request->query('offset', 0);
      $user = $this->auth->getUser();
      if (!$user) {
        throw new \Exception("User not authenticated.");
      }

      $transactions = $this->transactionModel->getAllForGoal($goalId, $limit, $offset);
      $total = $this->transactionModel->getTotalForGoal($goalId);

      Response::json(['data' => ['transactions' => $transactions, 'total' => $total]], 200);
      statusCode:
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