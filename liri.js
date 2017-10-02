// importing in authentication keys from keys.js file
var keys = require("./keys.js");
//twitter authentication
var Twitter = require("twitter");

// fs for reading and writing to random.txt
var fs = require("fs");

// dependency for inquirer npm package
var inquirer = require("inquirer");

// inquiring what the user wants to do
inquirer.prompt([
  {
    type: "list",
    message: "What would you like to do today?",
    choices: ["Read my Tweets", "Get some info on a song", "Get some info on a movie", "Do something random!"],
    name: "command"
  },
])
.then(function(answer) {
  
  // log command to log.txt
  fs.appendFile("log.txt", answer.command, function(err) {
    if (err) {
      return console.log(err);
    }
  });

  // processing choice
  if (answer.command === "Read my Tweets"){

    twitter();

    // formatting log.txt
    fs.appendFile("log.txt", "\n", function(err) {
      if (err) {
        return console.log(err);
      }
    });
  }
  else if (answer.command === "Get some info on a song"){
    // new inquirer to get song name
    inquirer.prompt([
      {
        name: "songName",
        message: "Please type in a song you want to know more about:"
      },
    ])
    .then(function(answer){

      spotify(answer.songName);
      
      // add song name to log.txt
      fs.appendFile("log.txt",": " + answer.songName + "\n", function(err) {
        if (err) {
          return console.log(err);
        }
      });
    });
  }
  else if (answer.command === "Get some info on a movie"){
    // new inquirer to get movie name
    inquirer.prompt([
      {
        name: "movieName",
        message: "Please type in a movie you want to know more about:"
      },
    ])
    .then(function(answer){
      
      movie(answer.movieName);
      // add movie name to log.txt
      fs.appendFile("log.txt", ": " + answer.movieName + "\n", function(err) {
        if (err) {
          return console.log(err);
        }
      });
    });
  }
  else if (answer.command === "Do something random!"){
    doIt();
  }
});


// twitter function
function twitter(){

  //twitter authentication
  var Twitter = require("twitter");
  var client = new Twitter({
    consumer_key: keys.consumer_key,
    consumer_secret: keys.consumer_secret,
    access_token_key: keys.access_token_key,
    access_token_secret: keys.access_token_secret
  });
  // console.log(client);

  // calling twitter api to get tweets from my account
  var params = {screen_name: "jrgquotes"}
  client.get("statuses/user_timeline", params, function(error, tweets, response){
    if(!error) {
      console.log("");
      console.log("These are the last 20 tweets of "+ tweets[0].user.name);
      console.log("");
      console.log(tweets[1].user.description);
      console.log("");
      console.log("");
      console.log("===============================");
    
      for(i=0; i < tweets.length; i++){
        console.log("");
        console.log("");
        console.log("Created on " + tweets[i].created_at);
        console.log(tweets[i].text);
        console.log("");
        console.log("");
        console.log("===============================");
      }
    }
    else {
      console.log(error);
    }
  });
}


// spotify function
function spotify(name){
  var Spotify = require('node-spotify-api');

  // if user does not input name, automatically search for The Sign by Ace of Butts
  if(!name){
    name = "The Sign Ace of Base";
  }

  // getting keys from exported object
  var spotify = new Spotify ({
    id: keys.spotify_id,
    secret: keys.spotify_secret
  });
  // searching spotify: limit to one and hope you searched the right song buddy
  spotify.search({ type: "track", query: name, limit: 1}, function(err, data){
    if (err) {
      return console.log("Error occured: " + err);
    }
    console.log("<==========Getting Song Data==========>");
    console.log("Artist Name: " + data.tracks.items[0].artists[0].name);
    console.log("Song Name: " + data.tracks.items[0].name);
    console.log("Link to the song: " + data.tracks.items[0].external_urls.spotify);
    console.log("Album Name : " + data.tracks.items[0].album.name);



  });
}


// movie function
function movie(name){
  var request = require("request");

  // if user does not input name, automatically search for Mr. Nobody
  if(!name){
    name = "Mr. Nobody";
  }

  request("http://www.omdbapi.com/?t=" + name + "&y=&plot=short&apikey=40e9cece", function(error, response, body){
    if(error){
    console.log('error:', error); // Print the error if one occurred
    }
    else{
    // parsing the movie object
    var mbody = JSON.parse(body);
    // console.log(body);
    // console.log(mBody);
    console.log("==========Getting Movie Data==========");
    console.log("Title: " + mbody.Title);
    console.log("Year: " + mbody.Year);
    console.log("IMDB Rating: " + mbody.imdbRating);
    console.log("Rotten Tomatoes Rating: " + mbody.Ratings[1].Value);
    console.log("Country :" + mbody.Country);
    console.log("Language: " + mbody.Language);
    console.log("Plot: " + mbody.Plot);
    console.log("Actors: " + mbody.Actors);
    }
  });
}


// random text function
function doIt(){
  // fs for reading and writing to random.txt
  var fs = require("fs");

 
  // read text file
  fs.readFile("random.txt", "utf8", function read(err, data) {
  if (err){
    throw err;
  }

  // split data between command and search item
  data = data.split(": ");

  
  // if spotify is in first word in text file
  if (data[0] === "Spotify") {
    console.log("Searching for " + data[1] + " with Spotify");
    spotify(data[1]);
  }

  // if movie is in first word
  else if(data[0] === "Movie") {
    console.log("Searching for " + data[1] + " with the Open Movie Data Base");
    movie(data[1]);
  }

  // if twitter is first word
  else if(data[0] === "Twitter") {
    console.log("Retrieving your last 20 tweets");
    twitter();
  }

 });
}