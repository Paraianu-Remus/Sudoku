import { CONSTANT } from "./constant.js";
import { sudokuGenerator, sudokuCheck } from "./sudoku.js";

// Dark mode toggle
document.querySelector("#dark-mode-toggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const darkMode = document.body.classList.contains("dark");
  localStorage.setItem("darkmode", darkMode);
  // Changes mobile status bar color
  document
    .querySelector('meta[name="theme-color"')
    .setAttribute("content", darkMode ? "#1a1a2e" : "#fff");
});
//

// Screen variables
const startScreen = document.querySelector("#start-screen");
const gameScreen = document.querySelector("#game-screen");
const pauseScreen = document.querySelector("#pause-screen");
const resultScreen = document.querySelector("#result-screen");
//
// Cells variables
const cells = document.querySelectorAll(".main-grid-cell");
//
// Input variables
const nameInput = document.querySelector("#input-name");
const numberInputs = document.querySelectorAll(".number");

// In-Game info variables
const playerName = document.querySelector("#player-name");
const gameLevel = document.querySelector("#game-level");
const gameTime = document.querySelector("#game-time");
const resultTime = document.querySelector("#result-time");
//

// Starting values
let levelIndex = 0;
let level = CONSTANT.LEVEL[levelIndex];
let timer = null;
let pause = false;
let seconds = 0;
let su = undefined;
let su_answer = undefined;
let selectedCell = -1;
//

const getGameInfo = () => JSON.parse(localStorage.getItem("game"));

// Creates spaces between cells (sudoku board 3x3 with 3x3)
const initGameGrid = () => {
  let index = 0;

  for (let i = 0; i < Math.pow(CONSTANT.GRID_SIZE, 2); i++) {
    let row = Math.floor(i / CONSTANT.GRID_SIZE);
    let col = i % CONSTANT.GRID_SIZE;
    if (row === 2 || row === 5) cells[index].style.marginBottom = "10px";
    if (col === 2 || col === 5) cells[index].style.marginRight = "10px";

    index++;
  }
};
//

// Local storage player name
const setPlayerName = (name) => localStorage.setItem("playerName", name);
const getPlayerName = () => localStorage.getItem("playerName");
//

// In-Game time counter
const showTime = (seconds) =>
  new Date(seconds * 1000).toISOString().substr(11, 8);
//

// Clears last sudoku puzzle when pressing New Game
const clearOldSudoku = () => {
  for (let i = 0; i < Math.pow(CONSTANT.GRID_SIZE, 2); i++) {
    cells[i].innerHTML = "";
    cells[i].classList.remove("filled");
    cells[i].classList.remove("selected");
  }
};
//

const initSudoku = () => {
  // Clears old sudoku puzzle
  clearOldSudoku();
  resetBg();
  //
  // Sudoku puzzle generation
  su = sudokuGenerator(level);
  su_answer = [...su.question];
  //
  seconds = 0;

  saveGameInfo();

  for (let i = 0; i < Math.pow(CONSTANT.GRID_SIZE, 2); i++) {
    let row = Math.floor(i / CONSTANT.GRID_SIZE);
    let col = i % CONSTANT.GRID_SIZE;

    cells[i].setAttribute("data-value", su.question[row][col]);

    if (su.question[row][col] !== 0) {
      cells[i].classList.add("filled");
      cells[i].innerHTML = su.question[row][col];
    }
  }
};

// Reloads last sudoku puzzle when pressing Continue
const loadSudoku = () => {
  let game = getGameInfo();
  gameLevel.innerHTML = CONSTANT.LEVEL_NAME[game.level];
  su = game.su;
  su_answer = su.answer;
  seconds = game.seconds;
  gameTime.innerHTML = showTime(seconds);
  levelIndex = game.level;

  for (let i = 0; i < Math.pow(CONSTANT.GRID_SIZE, 2); i++) {
    let row = Math.floor(i / CONSTANT.GRID_SIZE);
    let col = i % CONSTANT.GRID_SIZE;

    console.log(row, col);

    cells[i].setAttribute("data-value", su_answer[row][col]);
    cells[i].innerHTML = su_answer[row][col] !== 0 ? su_answer[row][col] : "";
    if (su.question[row][col] !== 0) {
      cells[i].classList.add("filled");
    }
  }
};
//

const hoverBg = (index) => {
  let row = Math.floor(index / CONSTANT.GRID_SIZE);
  let col = index % CONSTANT.GRID_SIZE;

  let box_start_row = row - (row % 3);
  let box_start_col = col - (col % 3);

  for (let i = 0; i < CONSTANT.BOX_SIZE; i++) {
    for (let j = 0; j < CONSTANT.BOX_SIZE; j++) {
      let cell = cells[9 * (box_start_row + i) + (box_start_col + j)];
      cell.classList.add("hover");
    }
  }

  let step = 9;
  while (index - step >= 0) {
    cells[index - step].classList.add("hover");
    step += 9;
  }

  step = 9;
  while (index + step < 81) {
    cells[index + step].classList.add("hover");
    step += 9;
  }

  step = 1;
  while (index - step >= 9 * row) {
    cells[index - step].classList.add("hover");
    step += 1;
  }

  step = 1;
  while (index + step < 9 * row + 9) {
    cells[index + step].classList.add("hover");
    step += 1;
  }
};

const resetBg = () => {
  cells.forEach((e) => e.classList.remove("hover"));
};

// Checks if input number is in wrong place and styles it
const checkError = (value) => {
  const addError = (cell) => {
    if (parseInt(cell.getAttribute("data-value")) === value) {
      cell.classList.add("error");
      cell.classList.add("cell-error");
      setTimeout(() => {
        cell.classList.remove("cell-error");
      }, 500);
    }
  };

  let index = selectedCell;
  let row = Math.floor(index / CONSTANT.GRID_SIZE);
  let col = index % CONSTANT.GRID_SIZE;
  let box_start_row = row - (row % 3);
  let box_start_col = col - (col % 3);

  for (let i = 0; i < CONSTANT.BOX_SIZE; i++) {
    for (let j = 0; j < CONSTANT.BOX_SIZE; j++) {
      let cell = cells[9 * (box_start_row + i) + (box_start_col + j)];
      if (!cell.classList.contains("selected")) addError(cell);
    }
  }

  let step = 9;
  while (index - step >= 0) {
    addError(cells[index - step]);
    step += 9;
  }

  step = 9;
  while (index + step < 81) {
    addError(cells[index + step]);
    step += 9;
  }

  step = 1;
  while (index - step >= 9 * row) {
    addError(cells[index - step]);
    step += 1;
  }

  step = 1;
  while (index + step < 9 * row + 9) {
    addError(cells[index + step]);
    step += 1;
  }
};
//

const removeError = () => cells.forEach((e) => e.classList.remove("error"));

// Saves last sudoku puzzle modifications to local storage
const saveGameInfo = () => {
  let game = {
    level: levelIndex,
    seconds: seconds,
    su: {
      original: su.original,
      question: su.question,
      answer: su_answer,
    },
  };
  localStorage.setItem("game", JSON.stringify(game));
};
//

const removeGameInfo = () => {
  localStorage.removeItem("game");
  document.querySelector("#btn-continue").style.display = "none";
};

const gameWon = () => sudokuCheck(su_answer);

// Show final result
const showResult = () => {
  clearInterval(timer);
  resultScreen.classList.add("active");
  resultTime.innerHTML = showTime(seconds);
};
//

const initNumberInputEvent = () => {
  numberInputs.forEach((e, index) => {
    e.addEventListener("click", () => {
      if (!cells[selectedCell].classList.contains("filled")) {
        cells[selectedCell].innerHTML = index + 1;
        cells[selectedCell].setAttribute("data-value", index + 1);
        // Adds input number to sudoku answer
        let row = Math.floor(selectedCell / CONSTANT.GRID_SIZE);
        let col = selectedCell % CONSTANT.GRID_SIZE;
        su_answer[row][col] = index + 1;
        // Save game
        saveGameInfo();
        //
        removeError();
        checkError(index + 1);
        cells[selectedCell].classList.add("zoom-in");
        setTimeout(() => {
          cells[selectedCell].classList.remove("zoom-in");
        }, 500);

        // Checks if player won the game
        if (gameWon()) {
          removeGameInfo();
          showResult();
        }
        //
      }
    });
  });
};

const initCellsEvent = () => {
  cells.forEach((e, index) => {
    e.addEventListener("click", () => {
      if (!e.classList.contains("filled")) {
        cells.forEach((e) => e.classList.remove("selected"));

        selectedCell = index;
        e.classList.remove("error");
        e.classList.add("selected");
        resetBg();
        hoverBg(index);
      }
    });
  });
};

// In-game name, difficulty and timer initialization
const startGame = () => {
  startScreen.classList.remove("active");
  gameScreen.classList.add("active");

  playerName.innerHTML = nameInput.value.trim();
  setPlayerName(nameInput.value.trim());

  gameLevel.innerHTML = CONSTANT.LEVEL_NAME[levelIndex];

  showTime(seconds);

  timer = setInterval(() => {
    if (!pause) {
      seconds = seconds + 1;
      gameTime.innerHTML = showTime(seconds);
    }
  }, 1000);
};
//

// Main Menu button (when paused)
const returnStartScreen = () => {
  clearInterval(timer);
  pause = false;
  seconds = 0;
  startScreen.classList.add("active");
  gameScreen.classList.remove("active");
  pauseScreen.classList.remove("active");
  resultScreen.classList.remove("active");
};
//

// Buttons Event
document.querySelector("#btn-level").addEventListener("click", (e) => {
  levelIndex = levelIndex + 1 > CONSTANT.LEVEL.length - 1 ? 0 : levelIndex + 1;
  level = CONSTANT.LEVEL[levelIndex];
  e.target.innerHTML = CONSTANT.LEVEL_NAME[levelIndex];
});

document.querySelector("#btn-play").addEventListener("click", () => {
  if (nameInput.value.trim().length > 0) {
    removeGameInfo();
    initSudoku();
    startGame();
  } else {
    nameInput.classList.add("input-error");
    setTimeout(() => {
      nameInput.classList.remove("input-error");
      nameInput.focus();
    }, 500);
  }
});

document.querySelector("#btn-continue").addEventListener("click", () => {
  if (nameInput.value.trim().length > 0) {
    loadSudoku();
    startGame();
  } else {
    nameInput.classList.add("input-error");
    setTimeout(() => {
      nameInput.classList.remove("input-error");
      nameInput.focus();
    }, 500);
  }
});

document.querySelector("#btn-pause").addEventListener("click", () => {
  pauseScreen.classList.add("active");
  pause = true;
});

document.querySelector("#btn-resume").addEventListener("click", () => {
  pauseScreen.classList.remove("active");
  pause = false;
});

document.querySelector("#btn-main-menu").addEventListener("click", () => {
  returnStartScreen();
  window.location.reload();
});

document.querySelector("#btn-new-game").addEventListener("click", () => {
  returnStartScreen();
});

document.querySelector("#btn-delete").addEventListener("click", () => {
  cells[selectedCell].innerHTML = "";
  cells[selectedCell].setAttribute("data-value", 0);

  let row = Math.floor(selectedCell / CONSTANT.GRID_SIZE);
  let col = selectedCell % CONSTANT.GRID_SIZE;

  su_answer[row][col] = 0;

  removeError();
});
//

// Game initialization
const init = () => {
  const darkmode = JSON.parse(localStorage.getItem("darkmode"));
  document.body.classList.add(darkmode ? "dark" : "light");
  document
    .querySelector('meta[name="theme-color"')
    .setAttribute("content", darkmode ? "#1a1a2e" : "#fff");

  const game = getGameInfo();

  document.querySelector("#btn-continue").style.display = game
    ? "grid"
    : "none";

  initGameGrid();
  initCellsEvent();
  initNumberInputEvent();

  if (getPlayerName()) {
    nameInput.value = getPlayerName();
  } else {
    nameInput.focus();
  }
};

init();
