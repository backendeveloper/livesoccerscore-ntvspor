var socket = io.connect('http://localhost:3300');
function connect() {
	socket.on('notification', function (data) {
		// get data as json format
		console.log('get data from client');
		translateData(data);

	});
}
function translateData(data) {

	var jsonData = JSON.parse(data);

	var game = jsonData.matches;
	//console.log(game);
	var divBody = document.getElementById('divTableBody');
	divBody.innerHTML = "";

	for (var i = 0, len = game.length; i < len; i++) {

		var row = document.createElement("row");
		row.setAttribute("class", "divTableRow");

		var cellTime = document.createElement("div");
		cellTime.appendChild(document.createTextNode(game[i].time + '\''));
		cellTime.setAttribute("class", "divTableCell time");

		var cellHome = document.createElement("div");
		cellHome.appendChild(document.createTextNode(game[i].home));
		cellHome.setAttribute("class", "divTableCell home");

		var cellScore = document.createElement("div");
		cellScore.appendChild(document.createTextNode(game[i].score));
		cellScore.setAttribute("class", "divTableCell score");

		var cellAway = document.createElement("div");
		cellAway.appendChild(document.createTextNode(game[i].away));
		cellAway.setAttribute("class", "divTableCell away");

		row.appendChild(cellTime);
		row.appendChild(cellHome);
		row.appendChild(cellScore);
		row.appendChild(cellAway);
		divBody.appendChild(row);
	}
}
