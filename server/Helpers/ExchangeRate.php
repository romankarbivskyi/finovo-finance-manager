<?php

namespace server\helpers;

use server\utils\HttpClient;

class ExchangeRate
{
  public static function getPair($baseCode, $targetCode)
  {
    $startDate = date('Y-m-d', strtotime('-1 day'));
    $endDate = date('Y-m-d');
    $url = "https://fxds-public-exchange-rates-api.oanda.com/cc-api/currencies?base=$baseCode&quote=$targetCode&data_type=general_currency_pair&start_date=$startDate&end_date=$endDate";

    $response = HttpClient::get($url);

    if ($response['statusCode'] === 200) {
      $data = json_decode($response['body'], true);
      if (isset($data['response'][0]['average_bid'])) {
        return $data['response'][0]['average_bid'];
      } else {
        throw new \Exception("Invalid response from API: " . json_encode($data));
      }
    } else {
      throw new \Exception("Error fetching exchange rate: " . $response['body']);
    }
  }
}