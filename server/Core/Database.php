<?php

namespace server\Core;

use PDO;
use PDOException;

class Database
{
  private static $instance = null;
  private $connection;

  private function __construct()
  {
    try {
      $host = 'localhost';
      $port = '5432';
      $dbname = 'finance_manager';
      $username = 'postgres';
      $password = 'root';
      $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
      ];

      $this->connection = new PDO(
        "pgsql:host=$host;port=$port;dbname=$dbname",
        $username,
        $password,
        $options
      );
    } catch (PDOException $e) {
      die("Database connection failed: " . $e->getMessage());
    }
  }

  public static function getInstance()
  {
    if (self::$instance === null) {
      self::$instance = new self();
    }
    return self::$instance;
  }

  public function getConnection()
  {
    return $this->connection;
  }

  public function query($sql, $params = [])
  {
    try {
      $stmt = $this->connection->prepare($sql);
      $stmt->execute($params);
      return $stmt;
    } catch (PDOException $e) {
      die("Query failed: " . $e->getMessage());
    }
  }

  public function fetchOne($sql, $params = [])
  {
    $stmt = $this->query($sql, $params);
    return $stmt->fetch();
  }

  public function fetchAll($sql, $params = [])
  {
    $stmt = $this->query($sql, $params);
    return $stmt->fetchAll();
  }

  public function insert($sql, $params = [])
  {
    $this->query($sql, $params);
    return $this->connection->lastInsertId();
  }
}