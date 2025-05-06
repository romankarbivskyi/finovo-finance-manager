<?php

namespace server\Controllers;

use server\Core\JsonView;

class TestController
{
  public function index()
  {
    JsonView::render([
      'message' => 'This is the index method of TestController',
      'data' => [
        'item1' => 'value1',
        'item2' => 'value2',
      ],
    ]);
  }

  public function show($id)
  {
    JsonView::render([
      'message' => 'This is the show method of TestController',
      'data' => [
        'id' => $id,
        'item' => 'value' . $id,
      ],
    ]);
  }
}