import { observable, autorun } from "../node_modules/mobx/dist/index.js"; // Timer State

const state = observable({
  timer: 0,
  isRunning: false
});
const history = observable([]); // Timer API
// ref to interval cancelation

let intervalId = null;

function tick(interval) {
  state.timer += interval;
}

function start() {
  const INTERVAL = 10;
  state.isRunning = true;
  intervalId = setInterval(() => tick(INTERVAL), INTERVAL);
}

function stop() {
  state.isRunning = false;
  clearInterval(intervalId);
}

function lap() {
  history.push(state.timer);
}

function reset() {
  history.clear();
  state.timer = 0;
} // UI stuff


const minNode = document.querySelector("#min");
const secNode = document.querySelector("#sec");
const msNode = document.querySelector("#ms");
const startBtn = document.querySelector("#start-stop");
const lapBtn = document.querySelector("#lap-reset");
const container = document.getElementById("history");

function handleStartStop() {
  state.isRunning ? stop() : start();
}

function handleLapReset() {
  state.isRunning ? lap() : reset();
} // Magic happens here


autorun(() => {
  renderTimer(state.timer);
});
autorun(() => {
  renderButtons(state.isRunning);
});
autorun(() => {
  renderHistory(history);
});

function renderTimer(timer) {
  const {
    min,
    sec,
    ms
  } = getFormattedTime(timer);
  minNode.textContent = min;
  secNode.textContent = sec;
  msNode.textContent = ms;
}

function renderButtons(isRunning) {
  startBtn.textContent = isRunning ? "Stop" : "Start";
  lapBtn.textContent = isRunning ? "Lap" : "Reset";
}

function renderHistory(history) {
  container.innerHTML = ""; // wipe all existing stuff

  history.forEach(entry => {
    const child = document.createElement("li");
    const {
      min,
      sec,
      ms
    } = getFormattedTime(entry);
    child.textContent = `${min}:${sec}:${ms}`;
    container.appendChild(child);
  });
} // Helper functions


function getFormattedTime(ms) {
  const seconds = ms / 1000;
  return {
    min: Math.floor(seconds / 60),
    sec: Math.floor(seconds % 60),
    ms: ms % 1000
  };
}

startBtn.on('onclick', handleStartStop);
lapBtn.on('onclick', handleLapReset);