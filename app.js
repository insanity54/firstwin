var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);
var nconf = require('nconf');
var league = require('gnar');
var redis = require('redis');


nconf.env(['PORT', 'RIOTKEY'])
     .file({file: 'config.json'});

nconf.defaults({
    'PORT': '5000'
});

console.log('key: ' + nconf.get('RIOTKEY'));
port = nconf.get('PORT');

var gnar = league(nconf.get('RIOTKEY'), 'na');
var red = redis.createClient();


//
// FUNCTIONS
//

// que requests
// send them here
var queReq = function queReq(req) {
    
});

// find a new player
var getNoob = function getNoob() {
    red.get("constant/noobSearchId", function(err, id) {
	if (err) throw err;
	if (!id) id = 59000000;

	
	return gnar.summoner.by_id(id).pipe(process.stdout);
    });
};




//
// ROUTES
//
app.get('/', function(req, res) {
    res.send('root of roots');
    getNoob().pipe
});

app.get('/firstwin/:name', function(req, res) {
    // get summoner id
    // get match history using summoner id
    // get last win using match history
    // 24 hours from last win = firstwin available
    
    var name = req.params.name.replace(/\s/g, "").toLowerCase();
    console.log('name is ' + name);
    var summoner = gnar.summoner.by_name(name); //.pipe(process.stdout);

    var bod = '';
    summoner.on('data', function(chunk) {
	console.log('got %d B of data', chunk.length);
	bod += chunk;
    });

    summoner.on('end', function() {
	var summonerId = JSON.parse(bod)[name].id;

	var game = gnar.game.by_summoner(summonerId);

	var g = '';
	game.on('data', function(chunk) {
	    console.log('got some %dB of game data ', chunk.length);
	    g += chunk;
	});

	game.on('end', function() {
	    console.log('end of game');

	    var lastGame = JSON.parse(g).games[0];
	    //console.dir(g);

	    //console.log('ending game, here is the game: ' );
	    console.log('most recent game win status: ' + lastGame.stats.win);

	    // * get last 10 most recent games
	    // * get normal games
	    //   * get the winning games
	    //   * average = average ipEarned
	    // 
	    
	    //console.dir(lastGame.stats.win);
	    return res.send(g);
	});
	//return res.send(bod);
    });

		
    //console.log('summoner id is: ' + summoner.id);
    //console.dir(summoner);
//    var game = gnar.game.by_summoner(summoner[1].id).pipe(res);

//    
//    res.send(summoner);
//    var history = gnar.matchhistory(summoner.id).pipe(res);

    
//    res.send(history);
    
});

server.listen(port);
console.log('server listening on port ' + port);
