const O_CLASS = 'o';
const X_CLASS = 'x';
const cellElements = document.querySelectorAll('.cell');
const playButton = document.querySelector('.play-button');
const board = document.querySelector('.board');
const root = document.querySelector(':root');
const lineInput = document.querySelector('#n-line-input');
const width_input_label = document.querySelector('[for="width-input"]');
const height_input_label = document.querySelector('[for="height-input"]');
const width_input = document.querySelector('#width-input');
const height_input = document.querySelector('#height-input');
const container = document.querySelector('.container');
let allCells;
let lineLenght = 0;
let board_height_cells;
let boardWidthCells;
const min_cell_size = 25;
const finalMessage = document.querySelector('.end-message');
const restartButton = document.querySelector('.end-message button');
const winner = document.querySelector('.end-message p');

main();

/**
 * main - load all the code into the page
 */
function main () {
  lineInput.addEventListener('change', freeWidhtHeight);
  playButton.addEventListener('click', startGame);
  window.onresize = windowResized;
  restartButton.addEventListener('click', startGame);
  startGame();
}

/**
 * freeWidhtHeight - free or disable the inputs for width and height
 * of the board depending on the input for the line lenght
 */
function freeWidhtHeight () {
  const line = lineInput.value;
  if (line !== 5) {
    width_input_label.classList.add('input-off');
    height_input_label.classList.add('input-off');
    width_input.disabled = true;
    height_input.disabled = true;
  } else {
    width_input_label.classList.remove('input-off');
    height_input_label.classList.remove('input-off');
    width_input.disabled = false;
    height_input.disabled = false;
  }
}

/**
 * startGame - sets the cells in the board according to the options
 */
function startGame () {
  finalMessage.classList.remove('show-message');
  lineLenght = lineInput.value;
  board_height_cells = height_input.value;
  boardWidthCells = width_input.value;
  insertCells();
  allCells = document.querySelectorAll('.cell');
  allCells.forEach(cell => {
    cell.addEventListener('click', cellClick, {
      once: true
    });
  });
}

/**
 * insertCells - insert the cells in the board
 */
function insertCells () {
  let expected_cell_width = 0;
  if (lineLenght == 3) {
    expected_cell_width = 150;
    boardWidthCells = 3;
    board_height_cells = 3;
  } else if (lineLenght == 4) {
    expected_cell_width = 150;
    boardWidthCells = 4;
    board_height_cells = 4;
  } else {
    expected_cell_width = 50;
  }
  root.style.setProperty('--cell-size', `${expected_cell_width}px`);
  board.innerHTML = '';
  board.style.gridTemplateColumns = `repeat(${boardWidthCells}, 1fr)`;
  const fragmento = document.createDocumentFragment();
  for (i = 0; i < board_height_cells * boardWidthCells; i++) {
    const theCell = document.createElement('div');
    theCell.classList.add('cell');
    fragmento.appendChild(theCell);
  }
  const board_width = container.clientWidth * 0.95 - 4;
  if (expected_cell_width * boardWidthCells > board_width) {
    // let cell_widht = board_width / boardWidthCells;
    root.style.setProperty('--cell-size', `${min_cell_size}px`);
    // root.style.setProperty('--mark-size', `${cell_widht * 0.9}px`);
  }
  board.appendChild(fragmento);
}

/**
 * windowResized resize cells to keep them sqare sized
 */
function windowResized () {
  let expected_cell_width = 0;
  let cell_widht = 0;
  if (lineLenght == 5) {
    expected_cell_width = 50;
    boardWidthCells = width_input.value;
  } else {
    boardWidthCells = lineLenght;
    expected_cell_width = 150;
  }
  const board_width = container.clientWidth * 0.95 - 4;
  if (expected_cell_width * boardWidthCells > board_width) {
    // cell_widht = board_width / boardWidthCells;
    cell_widht = min_cell_size;
  } else {
    cell_widht = expected_cell_width;
  }
  root.style.setProperty('--cell-size', `${cell_widht}px`);
}

function cellClick (e) {
  const cell = e.target;
  let currentTurn;
  if (board.classList.contains(X_CLASS)) { currentTurn = X_CLASS; } else { currentTurn = O_CLASS; }
  cell.classList.add(currentTurn);
  // console.log(allCells);
  if (checkForWin(cell, currentTurn)) {
    console.log('Alguien gano');
  }
  swapTurns(currentTurn);
}

function checkForWin (cell, currentTurn) {
  const cellIndex = [...allCells].indexOf(cell);
  console.log(`cellIndex = ${cellIndex}`);
  console.log(`currenTurn =${currentTurn}`);
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) {
        continue;
      }
      const indx_to_check = cellIndex + i + boardWidthCells * j;
      // console.log(`index to check = ${indx_to_check}`);
      try {
        if (allCells[indx_to_check].classList.contains(currentTurn)) {
          console.log(`cell ${indx_to_check} has ${currentTurn}`);
          if (checkForLine(indx_to_check, i, j, currentTurn)) {
            console.log('tenemos linea');
            showWinMessage(currentTurn);
            return true;
          }
        }
      } catch (e) {
        // console.log(e);
      }
    }
  }
}

function showWinMessage (currentTurn) {
  console.log('in showWinner');
  finalMessage.classList.add('show-message');
  console.log(winner);
  winner.innerHTML = (currentTurn === X_CLASS) ? 'X WINS!' : 'O WINS!';
  console.log(finalMessage);
}

function checkForLine (cellIndex, i, j, currentTurn) {
  const cellCount = [2];
  cellIndex = [cellIndex];
  console.log(`cell index at beggining = ${cellIndex}`);
  if (checkForLineDiretion(cellIndex, i, j, currentTurn, cellCount)) {
    console.log('we found line right away');
    return true;
  }
  // console.log(`cellCount = ${cellCount}`);
  // console.log(cellCount);
  // console.log(cellCount - 1);
  i = -i;
  j = -j;
  cellIndex[0] += (cellCount - 1) * (i + j * boardWidthCells);
  // console.log(`cell index at end = ${cellIndex}`);
  return checkForLineDiretion(cellIndex, i, j, currentTurn, cellCount);
}

function checkForLineDiretion (cellIndex, i, j, currentTurn, cellCountArray) {
  while (allCells[cellIndex[0] + i + j * boardWidthCells] && allCells[cellIndex[0] + i + j * boardWidthCells].classList.contains(currentTurn)) {
    cellCountArray[0]++;
    // console.log(`estamos checando ${cellIndex[0] + i + j * boardWidthCells}, cellcount is ${cellCountArray}`);
    // console.log(`lineLenght = ${lineLenght}`);
    // console.log(`tipos: ${typeof lineLenght} and ${typeof cellCountArray[0]}`);
    if (cellCountArray[0] == lineLenght) {
      return true;
    } else {
      // console.log(`in cell ${cellIndex}`);
      // console.log(`lineLenght is ${lineLenght} and cellCountArray[0] is ${cellCountArray}`);
    }
    cellIndex[0] += i + j * boardWidthCells;
  }
  // console.log("no line right away");
  return false;
}

function swapTurns (currentTurn) {
  if (currentTurn === X_CLASS) {
    board.classList.remove(X_CLASS);
    board.classList.add(O_CLASS);
    currentTurn = O_CLASS;
  } else {
    board.classList.remove(O_CLASS);
    board.classList.add(X_CLASS);
    currentTurn = X_CLASS;
  }
}
