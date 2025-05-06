<?php

namespace server\Core;

class Auth
{
  public static $instance = null;
  private $db;
  private $session;


  private function __construct()
  {
    $this->db = Database::getInstance();
    $this->session = Session::getInstance();
  }

  public static function getInstance()
  {
    if (self::$instance === null) {
      self::$instance = new self();
    }
    return self::$instance;
  }
}