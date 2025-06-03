<?php

namespace server\controllers;

use server\core\Response;
use server\models\Transaction;
use server\core\Request;
use server\core\Session;

class TransactionController
{
  private $transactionModel;
  private $session;

  public function __construct()
  {
    $this->transactionModel = new Transaction();
    $this->session = Session::getInstance();
  }

  public function create(Request $request)
  {
    try {
      $data = $request->getJsonBody();
      $goalId = $data['goal_id'] ?? null;
      $userId = $this->session->get('user_id');

      $errors = $this->transactionModel->validate($data);
      if (!empty($errors)) {
        Response::json(['errors' => $errors], 400);
        return;
      }

      $transaction = $this->transactionModel->create($goalId, $userId, $data);

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
      $userId = $this->session->get('user_id');

      $result = $this->transactionModel->getAllForUserWithTotal($userId, $limit, $offset);

      Response::json(['data' => $result], 200);
    } catch (\Exception $e) {
      Response::json(['error' => $e->getMessage()], 400);
    }
  }

  public function getAllForGoal($goalId, Request $request)
  {
    try {
      $limit = $request->query('limit', 10);
      $offset = $request->query('offset', 0);

      $result = $this->transactionModel->getAllForGoalWithTotal($goalId, $limit, $offset);

      Response::json(['data' => $result], 200);
    } catch (\Exception $e) {
      Response::json(['error' => $e->getMessage()], 400);
    }
  }

  public function delete($id)
  {
    try {
      $userId = $this->session->get('user_id');

      $this->transactionModel->delete($id, $userId);

      Response::json(['message' => 'Transaction deleted successfully.'], 200);
    } catch (\Exception $e) {
      Response::json(['error' => $e->getMessage()], 400);
    }
  }

  public function getStats(Request $request)
  {
    try {
      $startDate = $request->query('start_date', date('Y-m-d', strtotime('-30 days')));
      $endDate = $request->query('end_date', date('Y-m-d'));
      $userId = $this->session->get('user_id');

      $stats = $this->transactionModel->getStats($userId, $startDate, $endDate);

      Response::json(['data' => $stats], 200);
    } catch (\Exception $e) {
      Response::json(['error' => $e->getMessage()], 400);
    }
  }
}