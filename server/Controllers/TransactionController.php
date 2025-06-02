<?php

namespace server\controllers;

use server\core\Response;
use server\core\Auth;
use server\models\Transaction;
use server\core\Request;

class TransactionController
{
  private $auth;
  private $transactionModel;

  public function __construct()
  {
    $this->auth = Auth::getInstance();
    $this->transactionModel = new Transaction();
  }

  public function create(Request $request)
  {
    try {
      $data = $request->getJsonBody();
      $goalId = $data['goal_id'] ?? null;
      $user = $this->auth->getUser();

      if (!$user) {
        throw new \Exception("User not authenticated.");
      }

      $errors = $this->transactionModel->validate($data);
      if (!empty($errors)) {
        Response::json(['errors' => $errors], 400);
        return;
      }

      $transaction = $this->transactionModel->create($goalId, $user['id'], $data);

      Response::json(['data' => $transaction], 201);
    } catch (\Exception $e) {
      Response::json(['error' => $e->getMessage()], 400);
    }
  }

  public function getAllForUser(Request $request)
  {
    try {
      $limit = $request->query('limit', 10);
      $offset = $request->query('offset', 0);
      $user = $this->auth->getUser();

      if (!$user) {
        throw new \Exception("User not authenticated.");
      }

      $transactions = $this->transactionModel->getAllForUser($user['id'], $limit, $offset);
      $total = $this->transactionModel->getTotalForUser($user['id']);

      Response::json(['data' => ['transactions' => $transactions, 'total' => $total]], 200);
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