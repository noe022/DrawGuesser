const canvas = document.getElementById("canvas");
const context = canvas.getContext('2d');
const rubber = document.getElementById("rubber");
const send = document.getElementById("send");
const toDraw = document.getElementById("to_draw");
const pred = document.getElementById("prediction");
const reload = document.getElementById("reload");

let initialX;
let initialY;
let strokes = [];
categories = ['book', 'car', 'crown', 'flamingo', 'moon', 'rabbit', 'submarine', 'watermelon']
const MIN_DIST = 15;

canvas.width = 700;
canvas.height = 700;

function getLogicalCoords(evt) {
  const rect = canvas.getBoundingClientRect();
  const isTouch = evt.touches && evt.touches.length > 0;
  const clientX = isTouch ? evt.touches[0].clientX : evt.clientX;
  const clientY = isTouch ? evt.touches[0].clientY : evt.clientY;
  return {
    x: (clientX - rect.left) * (canvas.width / rect.width),
    y: (clientY - rect.top) * (canvas.height / rect.height),
  };
}

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
  const { x, y } = getLogicalCoords(evt);
  initialX = x;
  initialY = y;
  strokes.push([]);
  strokes[strokes.length - 1].push([initialX, initialY]);
  canvas.addEventListener('mousemove', mouseMoving);
}

function mouseMoving(evt) {
  const { x, y } = getLogicalCoords(evt);
  draw(x, y);
}

function mouseUp(evt) {
  canvas.removeEventListener("mousemove", mouseMoving);
}

function erase() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  strokes = [];
}

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
    const response = await fetch('http://192.168.1.42:8000/post_strokes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(strokes)
    });
  
    const data = await response.json();
    showPrediction(data.prediction);
  } catch (error) {
    console.error('Error:', error);
  }
  setInterval(() => location.reload(), 1000);
}

let zoom = 1;
function setZoom(delta) {
  zoom = Math.min(Math.max(zoom + delta, 1), 2.5);
  canvas.style.transform = `scale(${zoom})`;
}

function reloadWord() {
  toDraw.innerHTML = "<p>Draw:</p>";
  randomInput();
}

canvas.addEventListener('mousedown', mouseClick);
canvas.addEventListener('mouseup', mouseUp);
rubber.addEventListener('mousedown', erase);
send.addEventListener('mousedown', connect_server);   
reload.addEventListener('mousedown', reloadWord);

canvas.addEventListener('touchstart', mouseClick, { passive: false });
canvas.addEventListener('touchmove', mouseMoving, { passive: false });
canvas.addEventListener('touchend', mouseUp);