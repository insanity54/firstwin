var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);
var nconf = require('nconf');
var legends = require('legends');
//var league_api = require('league-api');


nconf.env(['PORT', 'RIOTKEY'])
     .file({file: 'config.json'});

nconf.defaults({
    'PORT': '5000'
});

console.log('key: ' + nconf.get('RIOTKEY'));
port = nconf.get('PORT');

//var league = new league_api('RIOTKEY');
var league = legends(nconf.get('RIOTKEY'), 'na');

app.get('/', function(req, res) {
    res.send('root of roots');
});


app.get('/firstwin/:summoner', function(req, res) {
    var summoner = req.params.summoner;

    league.getSummonerByName(summoner, function(err, data) {
	if (err) return console.error('error getting name: ' + err);

	    league.getRankedStats(data.id, function(err, stats) {
	    if (err) return console.error('error getting stats: ' + err);
	    console.log(stats);

	    res.send('summoner stats: ' + stats);	    
	});
    });
});

server.listen(port);
console.log('server listening on port ' + port);
