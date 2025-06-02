<?php

namespace server\helpers;

use server\utils\HttpClient;

class ExchangeRate
{
  public static function getPair($baseCode, $targetCode)
  {
    $apiKey = getenv('EXCHANGE_RATE_API_KEY');

    if (empty($apiKey)) {
      throw new \Exception("Exchange rate API key is not configured. Please set EXCHANGE_RATE_API_KEY in your environment variables.");
    }

    $url = "https://v6.exchangerate-api.com/v6/$apiKey/pair/$baseCode/$targetCode";

    $response = HttpClient::get($url);

    if ($response['statusCode'] === 200) {
      $data = json_decode($response['body'], true);
      if (isset($data['conversion_rate'])) {
        return $data['conversion_rate'];
      } else {
        throw new \Exception("Invalid response from API: " . json_encode($data));
      }
    } else {
      throw new \Exception("Error fetching exchange rate: " . $response['body']);
    }
  }
}