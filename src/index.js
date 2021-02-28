import { makeObservable, observable, observer, computed, autorun } from "mobx";

class TimerStore {
  isRunning = false;
  intervalId = null;
  time = 0;

  constructor() {
    makeObservable(this, {
      time: observable,
      isRunning: observable,
      formattedTime: computed,
    });
  }

  get formattedTime() {
    const { min, sec, ms } = this.getTimeParts(this.time);
    return `${min.toString().padStart(2, "0")}:${sec
      .toString()
      .padStart(2, "0")}:${ms.toString().padStart(3, "0")}`;
  }

  startTimer() {
    this.isRunning = true;
    const INTERVAL = 10;
    this.intervalId = setInterval(() => this.tick(INTERVAL), INTERVAL);
  }

  tick(interval) {
    this.time += interval;
  }

  reset() {
    this.time = 0;
  }

  stop() {
    this.isRunning = false;
    clearInterval(this.intervalId);
  }

  getTimeParts(ms) {
    const seconds = ms / 1000;
    return {
      min: Math.floor(seconds / 60),
      sec: Math.floor(seconds % 60),
      ms: ms % 1000,
    };
  }
}

class TimerHistoryStore {
  history = [];
  constructor() {
    makeObservable(this, {
      history: observable,
    });
  }
  addHistory(time) {
    this.history = [...this.history, time];
  }
  clearHistory() {
    this.history = [];
  }
}

const timerStore = new TimerStore();
const timerHistoryStore = new TimerHistoryStore();
const startStopButton = document.querySelector("#start-stop");
const lapResetButton = document.querySelector("#lap-reset");
const timeLabel = document.querySelector("#time");
const historyList = document.querySelector("#history");

startStopButton.addEventListener("click", () =>
  timerStore.isRunning ? timerStore.stop() : timerStore.startTimer()
);
lapResetButton.addEventListener("click", () =>
  timerStore.isRunning
    ? timerHistoryStore.addHistory(timerStore.formattedTime)
    : timerHistoryStore.clearHistory()
);

autorun(() => renderTimer(timeLabel, timerStore.formattedTime));
autorun(() =>
  renderButtons(startStopButton, lapResetButton, timerStore.isRunning)
);
autorun(() => renderHistory(historyList, timerHistoryStore.history));

// Render to UI
function renderTimer(timeLbl, formattedTime) {
  timeLbl.textContent = formattedTime;
}

function renderButtons(startStopBtn, lapResetBtn, isRunning) {
  startStopBtn.textContent = isRunning ? "Stop" : "Start";
  lapResetBtn.textContent = isRunning ? "Lap" : "Reset";
}

function renderHistory(historyLst, history) {
  historyLst.innerHTML = "";
  if (history && history.length) {
    history.forEach((entry) => {
      const child = document.createElement("li");
      child.textContent = entry;
      historyLst.appendChild(child);
    });
  } else {
    const child = document.createElement("li");
    child.textContent = "No Entries";
    historyLst.appendChild(child);
  }
}
