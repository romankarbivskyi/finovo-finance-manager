<?php

namespace server\Controllers;

use server\Core\Auth;
use server\Core\Database;
use server\Core\JsonView;
use server\Core\ImageHandler;

class GoalController
{
  private $auth;
  private $db;

  public function __construct()
  {
    $this->auth = Auth::getInstance();
    $this->db = Database::getInstance();
  }

  public function createGoal()
  {
    try {
      $user = $this->auth->getUser();
      if (!$user) {
        throw new \Exception('User not authenticated.', 401);
      }

      $requiredFields = ['name', 'description', 'target_date', 'current_amount', 'target_amount', 'currency'];
      foreach ($requiredFields as $field) {
        if (empty($_POST[$field])) {
          throw new \Exception("Field '{$field}' is required.", 400);
        }
      }

      $name = trim($_POST["name"]);
      $description = trim($_POST["description"]);
      $targetDate = $_POST["target_date"];
      $currentAmount = filter_var($_POST["current_amount"], FILTER_VALIDATE_FLOAT);
      $targetAmount = filter_var($_POST["target_amount"], FILTER_VALIDATE_FLOAT);
      $currency = $_POST["currency"];
      $userId = $user["id"];

      if ($currentAmount === false || $currentAmount < 0) {
        throw new \Exception("Invalid current_amount.", 400);
      }
      if ($targetAmount === false || $targetAmount <= 0) {
        throw new \Exception("Invalid target_amount.", 400);
      }
      if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $targetDate)) {
        throw new \Exception("Invalid target_date format. Use YYYY-MM-DD.", 400);
      }
      $allowedCurrencies = ['USD', 'UAH', 'EUR'];
      if (!in_array(strtoupper($currency), $allowedCurrencies, true)) {
        throw new \Exception("Invalid currency. Allowed values: USD, UAH, EUR.", 400);
      }

      $imageName = ImageHandler::uploadImage($_FILES["image"]);
      $imageUrl = ImageHandler::getImageUrl($imageName);

      $goalId = $this->db->insert("INSERT INTO goals (name, description, target_date, current_amount, target_amount, currency, preview_image, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [
        $name,
        $description,
        $targetDate,
        $currentAmount,
        $targetAmount,
        $currency,
        $imageUrl,
        $userId,
      ]);

      if (!$goalId) {
        throw new \Exception('Goal was not created.', 400);
      }

      $goal = $this->db->fetchOne("SELECT * FROM goals WHERE id = ?", [$goalId]);
      JsonView::render($goal, 201);
    } catch (\Exception $e) {
      JsonView::render(['error' => $e->getMessage()], 400);
    }
  }
}