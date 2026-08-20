const canvas = document.getElementById("canvas");
const context = canvas.getContext('2d');
const rubber = document.getElementById("rubber");
const send = document.getElementById("send");

let initialX;
let initialY;

let strokes = [];

// Method that allows us to start a new stroke
// To enable drawing on different parts of the canvas
function draw(cursorX, cursorY) {
  context.beginPath();
  // Start stroke
  context.moveTo(initialX, initialY);
  // Define brush properties
  context.lineWidth = 5;
  context.strokeStyle = "#000";
  context.lineCap = "round";
  context.lineJoin = "round";
  // Prepare stroke trajectory
  context.lineTo(cursorX, cursorY);
  // Draw stroke
  context.stroke();

  let currentStroke = strokes[strokes.length - 1];
  currentStroke.push([[cursorX, cursorY]]);

  initialX = cursorX;
  initialY = cursorY;
}

function mouseClick(evt) {
  initialX = evt.offsetX;
  initialY = evt.offsetY;
  strokes.push([initialX, initialY]);
  canvas.addEventListener('mousemove', mouseMoving);
}

function mouseMoving(evt) {
  draw(evt.offsetX, evt.offsetY);
}

function mouseUp(evt) {
  canvas.removeEventListener("mousemove", mouseMoving);
}

function erase() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

function send_to_server() {
  // Send strokes to server -> RNN
  fetch('http://127.0.0.1:8000/post', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(strokes)
  })
    .then(response => response.json())
    .then(data => console.log(data))
}

canvas.addEventListener('mousedown', mouseClick);
canvas.addEventListener('mouseup', mouseUp);
rubber.addEventListener('mousedown', erase);

send.addEventListener('mousedown', send_to_server);