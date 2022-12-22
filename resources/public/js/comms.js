const socket = new WebSocket("ws://" + window.location.host + "/chsk?client-id=" + document.getElementById("client-id").value)

function sendMessage(type, msgAsCLJ) {
	socket.send(`+[[:chsk/${type} ${msgAsCLJ}]]`)
	//socket.send("[[\"~:chsk/test\"," + JSON.stringify({"key": "value", "key2": 2}) + "]]") //for Transit\JSON
}

socket.onmessage = (ev) => {
	wsmsg = JSON.parse(ev.data.slice(1,));
	if (wsmsg[0] == '~:chsk/handshake' || wsmsg[0] == "~#'") {
		console.log(wsmsg)
	} else {
		console.log(JSON.parse(wsmsg[0][1]).message);
	}
}

// PAGE

$('#send').on('click', function () {
	socket.send("[[\"~:chsk/test\",{\"~:action\": \"click\"}]]");
	// sendMessage("test","{:action \"click\" :button \"send\"}");
})