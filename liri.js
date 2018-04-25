


var fs = require("fs");
var keys = require("./keys.js");
var request = require("request");
var Spotify = require("node-spotify-api");
var Twitter = require("twitter");
var spotify = new Spotify(keys.spotify);


var harvestTwitter = function () {
  var client = new Twitter(keys.twitterKeys);

  var params = {
    screen_name: "billcarverdev"
  };
  client.get("statuses/user_timeline", params, function (error, tweets, response) {
    if (!error) {
      for (var i = 0; i < tweets.length; i++) {
        console.log(tweets[i].created_at);
        // console.log("TEST");
        console.log(tweets[i].text);
      }
    }
  });
};


var getArtistNames = function (artist) {
  return artist.name;
};

var harvestSpotify = function (songName) {
  if (songName === undefined) {
    songName = "Big In Japan";
  }

  spotify.search({
    type: "track",
    query: songName
  }, function (err, data) {
    if (err) {
      console.log(err);
      return;
    }

    var songs = data.tracks.items;
    for (var i = 0; i < songs.length; i++) {
      console.log(i);
      console.log("artists: " + songs[i].artists.map(getArtistNames));
      console.log("song name: " + songs[i].name);
      console.log("preview song: " + songs[i].preview_url);
      console.log("album: " + songs[i].album.name);
    }
  });
};


var harvestMovie = function (movieName) {
  if (movieName === undefined) {
    movieName = "Mr. Nobody";
  }

  var urlHit = "http://www.omdbapi.com/?i=" + movieName + "trilogy";

  request(urlHit, function (error, response, body) {
    if (!error && response.statusCode === 200) {

      var jsonData = JSON.parse(body);

      console.log("Title: " + jsonData.Title);
      console.log("Year: " + jsonData.Year);
      console.log("Rated: " + jsonData.Rated);
      console.log("IMDB Rating: " + jsonData.imdbRating);
      console.log("Actors: " + jsonData.Actors);
      console.log("Rotton Tomatoes Rating: " + jsonData.Ratings[1].Value);
      console.log("Rotton Tomatoes URL: " + jsonData.tamatoURL);
    }
  });
};


var doWhatItSays = function () {
  fs.readFile("random.txt", "utf8", function (error, data) {
    console.log(data);

    var dataArr = data.split(",");

    if (dataArr.length === 2) {
      action(dataArr[0], dataArr[1]);
    } else if (dataArr.length === 1) {
      action(dataArr[0]);
    }
  });
};

var action = function (caseData, functionData) {
  switch (caseData) {
    case "my-tweets": harvestTwitter(); break;
    case "spotify-this-song": harvestSpotify(functionData); break;
    case "movie-this": harvestMovie(functionData); break;
    case "do-what-it-says": doWhatItSays(); break;
    default: console.log("LIRI doesn't know that one");
  }
}

var runThis = function (argOne, argTwo) {
  action(argOne, argTwo);
};
runThis(process.argv[2], process.argv[3]);