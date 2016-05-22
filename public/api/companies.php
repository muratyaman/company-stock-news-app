<?php
/**
 * prepare data for frontend company stock news app
 */
 
$companyList = <<<JSON
[
  { "name": "Microsoft Inc", "tickerCode": "MSFT" },
  { "name": "Google Inc",    "tickerCode": "GOOG" },
  { "name": "Apple Inc",     "tickerCode": "AAPL" },
  { "name": "Facebook Inc",  "tickerCode": "FB"   }
]
JSON;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header('Content-Type: application/json; charset=UTF-8');
echo $companyList;
