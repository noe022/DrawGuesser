const canvas = document.getElementById("canvas");
const context = canvas.getContext('2d');
const rubber = document.getElementById("rubber");
const send = document.getElementById("send");
const toDraw = document.getElementById("to_draw");
const pred = document.getElementById("prediction");

let initialX;
let initialY;
let strokes = [];
categories = ['book', 'car', 'crown', 'flamingo', 'moon', 'rabbit', 'submarine', 'watermelon']
const MIN_DIST = 15;

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

  // Dataset has a smaller amount of points, we 
  // set a min distance to add a point
  let currentStroke = strokes[strokes.length - 1];
  let lastPoint = currentStroke[currentStroke.length - 1];
  let dist = Math.hypot(cursorX - lastPoint[0], cursorY - lastPoint[1]);

  if (dist >= MIN_DIST) {
    currentStroke.push([cursorX, cursorY]);
  }

  initialX = cursorX;
  initialY = cursorY;
}

function mouseClick(evt) {
  initialX = evt.offsetX;
  initialY = evt.offsetY;
  strokes.push([]);
  strokes[strokes.length - 1].push([initialX, initialY]);
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

// Generate random word to draw
function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function randomInput() {
  let rand = randomNumber(0, categories.length - 1);
  let category = categories[rand];
  const word = document.createElement('p');
  word.textContent = category;
  toDraw.appendChild(word);
}

randomInput();

function showPrediction(input_pred) {
  const element_pred = document.createElement('p');
  element_pred.textContent = input_pred;
  pred.appendChild(element_pred);
}

async function connect_server() {
  try {
    const response = await fetch('http://127.0.0.1:8000/post_strokes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(strokes)
    });
  
    const data = await response.json();
    showPrediction(data.prediction);
  } catch (error) {
    console.error('Error'. error);
  }
}

canvas.addEventListener('mousedown', mouseClick);
canvas.addEventListener('mouseup', mouseUp);
rubber.addEventListener('mousedown', erase);
send.addEventListener('mousedown', connect_server);