var http = require('http'),
fs = require('fs');

var serverDate;

var options = {
	host : 'livescore.ntvspor.net',
	path : '/LiveScore/GetFullData?sportId=1&languageId=1&timezone=2&orderType=1&date=' + getScriptDate(),
	method : 'GET'
}

function getData() {
	var request = http.request(options, function (res) {
			var data = '';
			res.on('data', function (chunk) {
				data += chunk;
			});
			res.on('end', function () {
				parseHTMLData(data);

			});
		});
	request.on('error', function (e) {
		console.log(e.message);
	});
	request.end();
}

setInterval(getData, 20000);

function getScriptDate() {
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth() + 1; //January is 0!

	var yyyy = today.getFullYear();
	if (dd < 10) {
		dd = '0' + dd
	}
	if (mm < 10) {
		mm = '0' + mm
	}
	var today = yyyy + '-' + mm + '-' + dd;
	return today;
}

function parseHTMLData(data) {

	var json = JSON.parse(data);
	var game = new Array();
	setServerDate(json.ServerDate);
	for (var i = 0, len = json.MatchList.length; i < len; i++) {

		var matchTime = json.MatchList[i].StatusShortName;
		var matchHome = json.MatchList[i].HomeTeamName;
		var matchAway = json.MatchList[i].AwayTeamName;
		var matchScore = json.MatchList[i].HomeTeamScore_FT + "-" + json.MatchList[i].AwayTeamScore_FT;
		var match = {
			time : getMinute(json.MatchList[i].StatusId, json.MatchList[i].PeriodStartDate, json.MatchList[i].StatusShortName),
			home : matchHome,
			away : matchAway,
			score : matchScore
		}
		game.push(match);
		//console.log('NTVSPOR data-->'+matchTime+':'+matchHome+" " + matchScore+ " " +matchAway);
	}

	if (game && game !== "null" && game !== 'undefined') {
		//just to save json structure same as xml file in previous project
		var matches = {
			"matches" : game
		};
		writeDataToFile(matches);
	}
}

function writeDataToFile(data) {
	var myJsonData = JSON.stringify(data);
	//console.log(data);
	var filePath = __dirname + '/livescore.json';
	fs.writeFile(filePath, myJsonData, function (err) {
		if (err)
			return console.log(err);
	});

}

function getMinute(statusId, matchStartDate, StatusShortName) {
	var matchTime = 1,
	newDate,
	resultDate;
	/*
	 statusId = 1 = not started
	 statusId = 2 = first half
	 statusId = 3 = second half
	 statusId = 4 = half time
	 statusId = 5 = end
	 statusId = 6 = extra time 1. half
	 
	*/
	if (statusId == 1 || statusId == 5 || statusId == 4) {
		return StatusShortName;
	}
	if (matchStartDate != null && matchStartDate != "") {

		newDate = parseDate(matchStartDate);
		resultDate = (serverDate - newDate) / 1e3;
		matchTime = parseInt(Math.floor(resultDate / 60) + 1);

		if (statusId == 2) {
			if (matchTime > 45) {
				matchTime = 45;
			} else {
				matchTime < 1 && (matchTime = 1)
			}
		} else if (statusId == 3) {
			matchTime = matchTime + 45;
			if (matchTime > 90) {
				matchTime = 90
			} else {
				matchTime < 46 && (matchTime = 46)
			}
		} else if (statusId == 6) {
			matchTime = matchTime + 90;
			if (matchTime > 105) {
				matchTime = 105
			} else {
				matchTime < 91 && (matchTime = 91)
			}
		} else if (statusId == 8) {
			if (matchTime > 120) {
				matchTime = 120
			} else {
				matchTime < 106 && (matchTime = 106)
			}
		}
	}
	return matchTime;
}

function parseDate(matchStartDate) {
	var t = matchStartDate.match(/(\d+)/g);
	return new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5])
}

function setServerDate(n) {
	serverDate || (serverDate = new parseDate(n), timeZone = serverDate.getTimezoneOffset() / 60, dateDelta = (serverDate - new Date) / 1e3, UpdateServerTime(serverDate))
}

function UpdateServerTime() {
	serverDate.setSeconds(serverDate.getSeconds() + 1);
	setTimeout(function () {
		UpdateServerTime()
	}, 1e3)
}
