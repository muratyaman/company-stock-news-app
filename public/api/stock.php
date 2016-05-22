<?php


trait Hydrator
{
  function hydrate(array $data = [], $obj = null)
  {
    if (is_null($obj)) {
      $obj = $this;
    }
    foreach($data as $k => $v) {
      if (property_exists($obj, $k)) {
        $obj->$k = $v;
      }
    }
  }
}

class Stock
{
  use Hydrator;
  
  public $tickerCode;//"GOOG",
  public $latestPrice;//54407,
  public $latestPriceFormatted;
  public $priceUnits;//"GBP:pence",
  public $asOf;//"2016-05-21T17:20:28.515Z",
  public $asOfFormatted;
  public $storyFeedUrl;//"http://mm-recruitment-story-feed-api.herokuapp.com/8271"
  public $storyFeed = [];
  
  function __construct(array $data = [])
  {
    $this->hydrate($data);
    
    if (isset($this->latestPrice)) {
      $price = floatval($data['latestPrice']) / 100.0;
      $this->latestPriceFormatted = $price;
    }
    if (isset($this->asOf)) {
      $dt = new DateTime($this->asOf);
      $this->asOfFormatted = $dt->format('d/m/y H:i');
    }
    if (isset($this->storyFeedUrl)) {
      $storyJson  = file_get_contents($this->storyFeedUrl);// get recent 2 stories * * *
      $storiesArr = json_decode($storyJson, $assoc = true);
      foreach($storiesArr as $storyArr) {
        $this->storyFeed[] = new Story($storyArr);
      }
    }
  }
  
}

class Story
{
  use Hydrator;
  
  public $id;//74,
  public $headline;//"Google going strong, but maybe not for long.",
  public $body;//"Google has some concerns to address the balance ..."
  
  public $sentiment;
  
  function __construct(array $data = [])
  {
    $this->hydrate($data);
    
    $this->sentiment = SentimentCalculator::calculateSentiment($this->body);
  }
}

class SentimentCalculator
{
  /*
    positivity = positive_word_count - negative_word_count

    positive_word_count is the number of times a positive word appears in the article body
    negative_word_count is the number of times a negative word appears in the article body
    
    If the value of positivity is less than 2, the sentiment analysis is neutral.
    If positivity is positive, the sentiment analysis is positive.
    If positivity is negative, the sentiment analysis is negative.
  */
  
  const POSITIVE_WORDS = 'positive,success,grow,gains,happy,healthy';
  const NEGATIVE_WORDS = 'disappointing,concerns,decline,drag,slump,feared';
  
  /**
   * Calculate sentiment
   * Result is -1, 0 or 1
   * @return int 
   */
  static function calculateSentiment($text)
  {
    $positiveWordCount = static::countWordsInText($text, static::POSITIVE_WORDS);
    $negativeWordCount = static::countWordsInText($text, static::NEGATIVE_WORDS);
    $positivity = $positiveWordCount - $negativeWordCount;
    if ($positivity < 0) {
      $result = -1;
    } elseif($positivity < 2) {
      $result = 0;
    } else {// 2+
      $result = 1;
    }
    
    return $result;
  }
  
  private static function countWordsInText($text, $words)
  {
    $count = 0;
    
    $wordsInText = preg_split("/[\s,]+/", strtolower($text));
    $wordsArr    = explode(',', $words);
    foreach($wordsArr as $word) {
      $word = trim($word);
      if (in_array($word, $wordsInText)) {
        $count++;
      }
    }
    
    return $count;
  }
}


//=============================================================================

$code = $_GET['code'];// e.g. 'GOOG'

$url  = 'http://mm-recruitment-stock-price-api.herokuapp.com/company/' . $code;

$stockJson = file_get_contents($url);

// example here:
/*
{
  "tickerCode":"GOOG",
  "latestPrice":54407,
  "priceUnits":"GBP:pence",
  "asOf":"2016-05-21T17:20:28.515Z",
  "storyFeedUrl":"http://mm-recruitment-story-feed-api.herokuapp.com/8271"
}
*/

$stockArr = json_decode($stockJson, $assoc = true);

if ($stockArr) {
  $stockObj = new Stock($stockArr);
  $stockJson = json_encode($stockObj);
}

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header('Content-Type: application/json; charset=UTF-8');
echo $stockJson;

