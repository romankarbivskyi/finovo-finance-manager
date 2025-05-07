<?php

namespace server\Controllers;

use server\Core\Auth;
use server\Core\Response;
use server\Models\Goal;

class GoalController
{
  private $auth;
  private $goalModel;

  public function __construct()
  {
    $this->auth = Auth::getInstance();
    $this->goalModel = new Goal();
  }

  public function create()
  {
    try {
      $user = $this->auth->getUser();
      if (!$user) {
        throw new \Exception('User not authenticated.', 401);
      }

      $errors = Goal::validate($_POST);
      if (!empty($errors)) {
        Response::json(['errors' => $errors], 400);
        return;
      }

      $goal = $this->goalModel->create(
        $user['id'],
        $_POST,
        isset($_FILES['image']) ? $_FILES['image'] : null
      );

      Response::json($goal, 201);
    } catch (\Exception $e) {
      Response::json(['error' => $e->getMessage()], 400);
    }
  }

  public function update($id)
  {
    try {
      $user = $this->auth->getUser();
      if (!$user) {
        Response::json(['error' => 'User not authenticated.'], 401);
        return;
      }
      $imageFile = isset($_FILES['image']) ? $_FILES['image'] : null;

      $errors = Goal::validate($_POST);
      if (!empty($errors)) {
        Response::json(['errors' => $errors], 400);
        return;
      }

      $updatedGoal = $this->goalModel->update(
        $id,
        $user['id'],
        $_POST,
        $imageFile
      );

      if ($updatedGoal === false) {
        Response::json(['error' => 'Goal not found or update failed.'], 404);
        return;
      }

      Response::json($updatedGoal, 200);
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
      $user = $this->auth->getUser();
      if (!$user) {
        Response::json(['error' => 'User not authenticated.'], 401);
        return;
      }

      $goal = $this->goalModel->getById($id);
      if (!$goal) {
        Response::json(['error' => 'Goal not found.'], 404);
        return;
      }
      if ($goal['user_id'] !== $user['id']) {
        Response::json(['error' => 'Unauthorized action.'], 403);
        return;
      }

      $deleted = $this->goalModel->delete($id, $user['id']);

      if ($deleted) {
        Response::json(['message' => 'Goal deleted successfully.'], 200);
      } else {
        Response::json(['error' => 'Goal not found or deletion failed.'], 404);
      }
    } catch (\Exception $e) {
      Response::json(['error' => $e->getMessage()], 400);
    }
  }

  public function getAll()
  {
    try {
      $user = $this->auth->getUser();
      if (!$user) {
        Response::json(['error' => 'User not authenticated.'], 401);
        return;
      }

      $goals = $this->goalModel->getAllForUser($user['id']);
      Response::json($goals, 200);
    } catch (\Exception $e) {
      Response::json(['error' => $e->getMessage()], 400);
    }
  }

  public function getById($id)
  {
    try {
      $user = $this->auth->getUser();
      if (!$user) {
        Response::json(['error' => 'User not authenticated.'], 401);
        return;
      }

      $goal = $this->goalModel->getById($id);
      if (!$goal) {
        Response::json(['error' => 'Goal not found.'], 404);
        return;
      }
      if ($goal['user_id'] !== $user['id']) {
        Response::json(['error' => 'Unauthorized action.'], 403);
        return;
      }

      Response::json($goal, 200);
    } catch (\Exception $e) {
      Response::json(['error' => $e->getMessage()], 400);
    }
  }
}
