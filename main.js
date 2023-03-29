var socket = null;

function connect() {
  console.log("Begin connect");
  var token = document.getElementById("token").value;

  var protocol = document.location.href.startsWith("https") ? "wss" : "ws";
  //    socket = new WebSocket(protocol + "://" + window.location.host + "/ws");
  socket = new WebSocket(
    protocol + "://" + "localhost:8080" + "/chat/agg-01?token=" + token
  );

  socket.onerror = function () {
    console.log("socket error");
  };

  socket.onopen = function () {
    var messagesDiv = document.getElementById("messages");
    messagesDiv.innerHTML = "";
    write("Connected");
  };

  socket.onclose = function () {
    write("Disconnected");
    setTimeout(connect, 5000);
  };

  socket.onmessage = function (event) {
    if (typeof event.data === "object") {
      console.log("its object");
    } else {
      received(event.data.toString());
    }
  };
}

function received(message) {
  var msg = JSON.parse(message);
  write(msg.sender + ":" + msg.message);
}

function write(message) {
  var line = document.createElement("p");
  line.className = "message";
  line.textContent = message;

  var messagesDiv = document.getElementById("messages");
  messagesDiv.appendChild(line);
  messagesDiv.scrollTop = line.offsetTop;
}

function onSend() {
  var input = document.getElementById("commandInput");
  if (input) {
    var text = input.value;
    let data = {
      message: text,
    };
    if (text && socket) {
      socket.send(JSON.stringify(data));
      input.value = "";
    }
  }
}

function start() {
  connect();

  document.getElementById("sendButton").onclick = onSend;
  document.getElementById("commandInput").onkeydown = function (e) {
    if (e.keyCode == 13) {
      onSend();
    }
  };
}

function initLoop() {
  if (document.getElementById("sendButton")) {
    start();
  } else {
    setTimeout(initLoop, 300);
  }
}

initLoop();
