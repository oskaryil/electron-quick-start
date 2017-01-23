// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const weather = require('openweathermap');
const instagramAnalytics = require('instagram-analytics');
const cache = require('memory-cache');
const cacheTime = 1000 * 300; // 300 sec
const InstaFeed = require('instafeed.js');
const moment = require('moment');

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
  get('fullstack_dev', function(data) {
    console.log(data);
    $(".ig-name").text("@" + data.username);
    $("#instagram-stats").html("Followers: <span class='ig-followers'>"+data.followers + "</span> <span class='ig-likes-per-post'>Likes per post: "+ Math.round(data.likesPerPost) +"</span>");
    $(".description").text("Description: " + data.description);
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
  // clientId: '70f50636cc57477aaa5f3fb61afee2e7'

const feed = new InstaFeed({
  get: 'user',
  userId: '4312264050',
  accessToken: '4312264050.1677ed0.186e37c622184003a9387314abffb006',
  sortBy: 'most-liked',
  template: '<div class="insta-post"><a class="instagram-post-link" href="{{link}}"><img src="{{image}}" /></a><p class="text-center ig-post-like-count"><i class="fa fa-heart"></i> {{likes}}</p><pre class="time-posted">{{model.created_time}}</pre><span class="post-time"></span></div>'
});
feed.run();

const postTime = $(".time-posted").text();
console.log(postTime);

setTimeout(function() {
  console.log(postTime);
$(".post-time").text(moment.unix(parseInt(postTime)).format('MM/DD/YYYY hh:mm a'));
}, 3000);
