<?php

namespace server\Controllers;

class TestController
{
  public function index()
  {
    echo "This is the index method of TestController.";
  }

  public function show($id)
  {
    echo "This is the show method of TestController with ID: $id";
  }
}