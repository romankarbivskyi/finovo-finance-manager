<?php

namespace server\controllers;

use server\core\Response;
use server\models\Goal;
use server\core\Request;
use server\core\Session;
use server\models\User;

class GoalController
{
  private $goalModel;
  private $session;
  private $userModel;

  public function __construct()
  {
    $this->goalModel = new Goal();
    $this->session = Session::getInstance();
    $this->userModel = new User();
  }

  public function create()
  {
    try {
      $userId = $this->session->get('user_id');

      $imageFile = isset($_FILES['image']) ? $_FILES['image'] : null;

      if ($imageFile && $imageFile['error'] === UPLOAD_ERR_OK) {
        $maxFileSize = 10 * 1024 * 1024;
        if ($imageFile['size'] > $maxFileSize) {
          Response::json(['errors' => ['image' => 'File size exceeds the limit of 10MB.']], 400);
          return;
        }
      }

      $errors = $this->goalModel->validate($_POST);
      if (!empty($errors)) {
        Response::json(['errors' => $errors], 400);
        return;
      }

      $goal = $this->goalModel->create(
        $userId,
        $_POST,
        isset($_FILES['image']) ? $_FILES['image'] : null
      );

      Response::json(['data' => $goal], 201);
    } catch (\Exception $e) {
      Response::json(['error' => $e->getMessage()], 400);
    }
  }

  public function update($id)
  {
    try {
      $userId = $this->session->get('user_id');

      $imageFile = isset($_FILES['image']) ? $_FILES['image'] : null;

      if ($imageFile && $imageFile['error'] === UPLOAD_ERR_OK) {
        $maxFileSize = 10 * 1024 * 1024;
        if ($imageFile['size'] > $maxFileSize) {
          Response::json(['errors' => ['image' => 'File size exceeds the limit of 10MB.']], 400);
          return;
        }
      }

      $errors = $this->goalModel->validate($_POST);
      if (!empty($errors)) {
        Response::json(['errors' => $errors], 400);
        return;
      }

      $updatedGoal = $this->goalModel->update(
        $id,
        $userId,
        $_POST,
        $imageFile
      );

      if ($updatedGoal === false) {
        Response::json(['error' => 'Goal not found or update failed.'], 404);
        return;
      }

      Response::json(['data' => $updatedGoal], 200);
    } catch (\Exception $e) {
      $statusCode = $e->getCode();
      if (!is_int($statusCode) || $statusCode < 400 || $statusCode >= 600) {
        $statusCode = 400;
      }
      if ($e->getMessage() === 'User not authenticated.') {
        $statusCode = 401;
      }
      Response::json(['error' => $e->getMessage()], $statusCode);
    }
  }

  public function delete($id)
  {
    try {
      $userId = $this->session->get('user_id');

      $goal = $this->goalModel->getById($id);
      if (!$goal) {
        Response::json(['error' => 'Goal not found.'], 404);
        return;
      }
      if ($goal['user_id'] !== $userId) {
        Response::json(['error' => 'Unauthorized action.'], 403);
        return;
      }

      $deleted = $this->goalModel->delete($id, $userId);

      if ($deleted) {
        Response::json(['message' => 'Goal deleted successfully.'], 200);
      } else {
        Response::json(['error' => 'Goal not found or deletion failed.'], 404);
      }
    } catch (\Exception $e) {
      Response::json(['error' => $e->getMessage()], 400);
    }
  }

  public function getAll(Request $request)
  {
    try {
      $limit = $request->query('limit', 10);
      $offset = $request->query('offset', 0);
      $currency = $request->query('currency', 'all');
      $status = $request->query('status', 'all');
      $sort = $request->query('sort', 'new');
      $search = $request->query('search', '');

      $userId = $this->session->get('user_id');

      $goals = $this->goalModel->getAllForUser($userId, $limit, $offset, $currency, $status, $sort, $search);
      $total = $this->goalModel->getTotalForUser($userId, $currency, $status, $search);
      Response::json(['data' => ['goals' => $goals, 'total' => $total]], 200);
    } catch (\Exception $e) {
      Response::json(['error' => $e->getMessage()], 400);
    }
  }

  public function getById($id)
  {
    try {
      $userId = $this->session->get('user_id');

      $goal = $this->goalModel->getById($id);
      if (!$goal) {
        Response::json(['error' => 'Goal not found.'], 404);
        return;
      }
      if ($goal['user_id'] !== $userId) {
        Response::json(['error' => 'Unauthorized action.'], 403);
        return;
      }

      Response::json(['data' => $goal], 200);
    } catch (\Exception $e) {
      Response::json(['error' => $e->getMessage()], 400);
    }
  }

  public function getStats()
  {
    try {
      $userId = $this->session->get('user_id');
      $stats = $this->goalModel->getStats($userId);
      Response::json(['data' => $stats], 200);
    } catch (\Exception $e) {
      Response::json(['error' => $e->getMessage()], 400);
    }
  }
}
