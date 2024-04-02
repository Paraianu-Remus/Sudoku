import { CONSTANT } from "./constant.js";

export const newGrid = (size) => {
  let arr = new Array(size);

  for (let i = 0; i < size; i++) {
    arr[i] = new Array(size);
  }

  for (let i = 0; i < Math.pow(size, 2); i++) {
    arr[Math.floor(i / size)][i % size] = CONSTANT.UNASSIGNED;
  }

  return arr;
};

// Checks for duplicate numbers in collumn
export const colDuplicate = (grid, col, value) => {
  for (let row = 0; row < CONSTANT.GRID_SIZE; row++) {
    if (grid[row][col] === value) {
      return false;
    }
  }
  return true;
};
//

// Checks for duplicate numbers in row
export const rowDuplicate = (grid, row, value) => {
  for (let col = 0; col < CONSTANT.GRID_SIZE; col++) {
    if (grid[row][col] === value) {
      return false;
    }
  }
  return true;
};
//

// Checks for duplicate numbers in 3x3 box
export const boxDuplicate = (grid, box_row, box_col, value) => {
  for (let row = 0; row < CONSTANT.BOX_SIZE; row++) {
    for (let col = 0; col < CONSTANT.BOX_SIZE; col++) {
      if (grid[row + box_row][col + box_col] === value) {
        return false;
      }
    }
  }
  return true;
};
//

// Checks duplicate number for row, col and 3x3 box
export const duplicate = (grid, row, col, value) => {
  return (
    colDuplicate(grid, col, value) &&
    rowDuplicate(grid, row, value) &&
    boxDuplicate(grid, row - (row % 3), col - (col % 3), value) &&
    value !== CONSTANT.UNASSIGNED
  );
};
//

// Finds unassigned cells
export const unassigned = (grid, pos) => {
  for (let row = 0; row < CONSTANT.GRID_SIZE; row++) {
    for (let col = 0; col < CONSTANT.GRID_SIZE; col++) {
      if (grid[row][col] === CONSTANT.UNASSIGNED) {
        pos.row = row;
        pos.col = col;
        return true;
      }
    }
  }
  return false;
};
//

// Shuffle array
export const shuffleArray = (arr) => {
  let currentIndex = arr.length;

  while (currentIndex !== 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    let temp = arr[currentIndex];
    arr[currentIndex] = arr[randomIndex];
    arr[randomIndex] = temp;
  }
  return arr;
};
//

// Checks if puzzle is complete
export const puzzleComplete = (grid) => {
  return grid.every((row, i) => {
    return row.every((value, j) => {
      return value !== CONSTANT.UNASSIGNED;
    });
  });
};
//

// Creates the sudoku game grid
export const sudokuCreate = (grid) => {
  let unassignedPos = {
    row: -1,
    col: -1,
  };
  if (!unassigned(grid, unassignedPos)) {
    return true;
  }
  let numberList = shuffleArray([...CONSTANT.NUMBERS]);
  let row = unassignedPos.row;
  let col = unassignedPos.col;

  numberList.forEach((num, i) => {
    if (duplicate(grid, row, col, num)) {
      grid[row][col] = num;
      if (puzzleComplete(grid)) {
        return true;
      } else {
        if (sudokuCreate(grid)) {
          return true;
        }
      }
      grid[row][col] = CONSTANT.UNASSIGNED;
    }
  });
  return puzzleComplete(grid);
};
//

export const sudokuCheck = (grid) => {
  let unassignedPos = {
    row: -1,
    col: -1,
  };
  if (!unassigned(grid, unassignedPos)) {
    return true;
  }

  grid.forEach((row, i) => {
    row.forEach((num, j) => {
      if (duplicate(grid, i, j, num)) {
        if (puzzleComplete(grid)) {
          return true;
        } else {
          if (sudokuCreate(grid)) {
            return true;
          }
        }
      }
    });
  });
  return puzzleComplete(grid);
};

export const random = () => Math.floor(Math.random() * CONSTANT.GRID_SIZE);

export const removeCells = (grid, level) => {
  let res = [...grid];
  let attempts = level;

  while (attempts > 0) {
    let row = random();
    let col = random();

    while (res[row][col] === 0) {
      row = random();
      col = random();
    }
    res[row][col] = CONSTANT.UNASSIGNED;
    attempts--;
  }
  return res;
};

// Creates sudoku based on level difficulty
export const sudokuGenerator = (level) => {
  let sudoku = newGrid(CONSTANT.GRID_SIZE);
  let check = sudokuCreate(sudoku);

  if (check) {
    let question = removeCells(sudoku, level);
    return {
      original: sudoku,
      question: question,
    };
  }
  return undefined;
};
//
