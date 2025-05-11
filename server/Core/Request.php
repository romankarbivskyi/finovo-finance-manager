<?php

namespace server\Core;

class Request
{
  private $requestMethod;
  private $requestUri;
  private $requestHeaders;
  private $requestBody;
  private $queryParams;

  public function __construct()
  {
    $this->requestMethod = $_SERVER['REQUEST_METHOD'];
    $this->requestUri = $_SERVER['REQUEST_URI'];
    $this->requestHeaders = getallheaders();
    $this->requestBody = file_get_contents('php://input');
  }

  public function getRequestMethod()
  {
    return $this->requestMethod;
  }

  public function getRequestUri()
  {
    return $this->requestUri;
  }

  public function getRequestHeaders()
  {
    return $this->requestHeaders;
  }

  public function getRequestBody()
  {
    return $this->requestBody;
  }

  public function getHeader($headerName)
  {
    $headerName = str_replace('-', '_', strtoupper($headerName));
    return isset($this->requestHeaders[$headerName]) ? $this->requestHeaders[$headerName] : null;
  }

  public function getJsonBody()
  {
    return json_decode($this->requestBody, true);
  }

  public function setQueryParams(array $params)
  {
    $this->queryParams = $params;
  }

  public function query($key = null, $default = null)
  {
    if ($key === null) {
      return $this->queryParams;
    }

    return $this->queryParams[$key] ?? $default;
  }

}