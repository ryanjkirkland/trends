console.log("sup dawg");

var fs = require('fs');

//Screenshot API
var request = require("request");

//NodeMailer for sending email from app


//Google Trends npm module
const googleTrends = require('google-trends-api');


//Variables for storing arguments from command line
var keyword = process.argv[2];
var start = process.argv[3];
var measure = process.argv[4];


//Begin function
var curcumin = googleTrends.interestOverTime({keyword: keyword, startTime: new Date(start)})
.then(function(results){

  console.log (results);
	//Parse JSON so object key value pairs return defined
  var stuff = JSON.parse(results);

  //Loop through trend values over specified timeframe
  var timeline = stuff["default"]["timelineData"];

  var base = 0;
  var testArray = [];
  var stream = fs.createWriteStream(keyword + ".csv", {flags: 'a'});

  	for (var i=0; i < timeline.length; i++) {
  		base = base + timeline[i]["value"][0];
  		console.log(timeline[i]["value"][0]);
      testArray.push(timeline[i]["value"][0]);
  	}

  testArray.forEach( function (item, index) {
      stream.write(item + '\n');
  });

  console.log("The array is " + testArray.length + " items long");

  //Get average over full timeframe for comparison
  var average = base/timeline.length;


  //Loop through last seven days to compare vs timeline
  var last_week = timeline.reverse();
  var seven = 0;
  
  for (var i = 0; i < 7; i++) {
  	seven = seven + last_week[i]["value"][0];
  }

  var last_week_average = seven/7;
  console.log(last_week_average);

  var keyword_array = keyword.split(" ");
  console.log(keyword_array);

  if (keyword_array.length > 1) {
  	keyword = keyword_array.join("%20");
  	console.log(keyword);
  }

  //Compare total timeline average against last week's average to determine "trending status"
  if ((average - last_week_average) < -5)  {
  	console.log("We aren't trending right now");
  } else {

  //Screenshot API call to capture the corresponding Google Trend's page for the passed keyword
  	var options = { method: 'POST',
	  url: 'https://restpack.io/api/screenshot/v4/capture',
	  headers: { 'x-access-token': '8p9D8s6OUlIdbjFhDSfcreA6fkzBPKin8YRKSdCl2ocUgfQq' },
	  form: { url: 'https://trends.google.com/trends/explore?q=' + keyword, json: true } };

	request(options, function (error, response, body) {
	  if (error) throw new Error(error);

	  var image = JSON.parse(body)["image"];
	  console.log(image);

	});


  }

  console.log(average - last_week_average);

})
.catch(function(err){
  console.error(err);
});