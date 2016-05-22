<?php

$url = $_GET['url'];// e.g. 'http://mm-recruitment-story-feed-api.herokuapp.com/8271'

if (! strpos(strtolower($url), 'http://') === false) return '[]';//security

$json = file_get_contents($url);

// example here:
/*
[
  {
    "id":74,
    "headline":"Google going strong, but maybe not for long.",
    "body":"Google has some concerns to address the balance ..."
  },
  {
    "id":141,
    "headline":"Ad revenues still primary source of Google revenue.",
    "body":"Investors were encouraged by a healthy gain in the ..."
  }
]
*/

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header('Content-Type: application/json; charset=UTF-8');
echo $json;
