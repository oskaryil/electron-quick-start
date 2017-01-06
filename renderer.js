// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const weather = require('openweathermap');
const instagramAnalytics = require('instagram-analytics');
const cache = require('memory-cache');
const cacheTime = 1000 * 300; // 300 sec

weather.defaults = {
  units: 'metric',
  mode: 'json',
  lang: 'en'
};


weather.now({
  id: 2673730,
  APPID: '931c6d7de465d9508cd249f5eb74b3ae',
  units: 'metric'
}, function(err, json) {
  console.log(json);
  $('#weather').html(json.main.temp + '°C <em>in</em> <span><b>'+json.name +'</b></span>')
});

$(function() {
  get('oskaryil', function(data) {
    console.log(data);
    $(".ig-name").text("@" + data.username);
    $("#instagram-stats").html("Followers: <span class='ig-followers'>"+data.followers + "</span> <span class='ig-likes-per-post'>Likes per post: "+ Math.round(data.likesPerPost) +"</span>");
  });
});

function get(handle, completion) {
  var cachedValue = cache.get(handle);
  if (cachedValue) {
    console.log('Found follower stats for ' + handle + ' in cache');
    completion(cachedValue);
  } else {
    console.log('Will query ' + handle + ' for stats');

    // The "count" option refers to the number of posts to analyze (default is 20)
    instagramAnalytics.users([handle], {count : 60}).then(stats => {
      cache.put(handle, stats[0], cacheTime, function(key, value) {
        console.log(key + ' was cleared from cache (had value ' + value + ')');
      });
      completion(stats[0]);
    });
  }
}