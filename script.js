const O_CLASS = 'o';
const X_CLASS = 'x';
const cellElements = document.querySelectorAll('.cell');
const playButton = document.querySelector(".play-button");
const board = document.querySelector(".board");
const root = document.querySelector(':root');
const line_input = document.querySelector('#n-line-input');
const width_input_label = document.querySelector('[for="width-input"]');
const height_input_label = document.querySelector('[for="height-input"]');
const width_input = document.querySelector('#width-input');
const height_input = document.querySelector('#height-input');
const container = document.querySelector('.container');
let allCells;
let line_lenght = 0;
let board_height_cells;
let board_width_cells;

main();

/**
 * main - load all the code into the page
 */
function main() {
	line_input.addEventListener('change', freeWidhtHeight);
	playButton.addEventListener('click', startGame);
	window.onresize = windowResized;
	startGame();
}

/**
 * freeWidhtHeight - free or disable the inputs for width and height
 * of the board depending on the input for the line lenght
 */
function freeWidhtHeight() {
	let line = line_input.value;
	if (line != 5) {
		width_input_label.classList.add("input-off");
		height_input_label.classList.add("input-off");
		width_input.disabled = true;
		height_input.disabled = true;
	} else {
		width_input_label.classList.remove("input-off");
		height_input_label.classList.remove("input-off");
		width_input.disabled = false;
		height_input.disabled = false;

	}
}

/**
 * startGame - sets the cells in the board according to the options
 */
function startGame() {
	line_lenght = line_input.value;
	board_height_cells = height_input.value;
	board_width_cells = width_input.value;
	insertCells();
	allCells = document.querySelectorAll('.cell');
	allCells.forEach(cell => {
		cell.addEventListener('click', cellClick, {
			once: true
		});
	})
}
/**
 * insertCells - insert the cells in the board
 */
function insertCells() {
	let expected_cell_width = 0
	if (line_lenght == 3) {
		expected_cell_width = 150;
		board_width_cells = 3;
		board_height_cells = 3;
	} else if (line_lenght == 4) {
		expected_cell_width = 150;
		board_width_cells = 4;
		board_height_cells = 4;
	} else {
		expected_cell_width = 50;
	}
	root.style.setProperty('--cell-size', `${expected_cell_width}px`);
	board.innerHTML = '';
	board.style.gridTemplateColumns = `repeat(${board_width_cells}, 1fr)`;
	let fragmento = document.createDocumentFragment();
	for (i = 0; i < board_height_cells * board_width_cells; i++) {
		let theCell = document.createElement("div");
		theCell.classList.add("cell");
		fragmento.appendChild(theCell);
	}
	let board_width = container.clientWidth * 0.95 - 4;
	if (expected_cell_width * board_width_cells > board_width) {
		let cell_widht = board_width / board_width_cells;
		root.style.setProperty('--cell-size', `${cell_widht}px`);
		//root.style.setProperty('--mark-size', `${cell_widht * 0.9}px`);
	}
	board.appendChild(fragmento);
}

/**
 * windowResized resize cells to keep them sqare sized
 */
function windowResized() {
	let expected_cell_width = 0;
	let cell_widht = 0;
	if (line_lenght == 5) {
		expected_cell_width = 50;
		board_width_cells = width_input.value;
	} else {
		board_width_cells = line_lenght;
		expected_cell_width = 150;
	}
	let board_width = container.clientWidth * 0.95 - 4;
	if (expected_cell_width * board_width_cells > board_width) {
		cell_widht = board_width / board_width_cells;
	} else {
		cell_widht = expected_cell_width;
	}
	root.style.setProperty('--cell-size', `${cell_widht}px`);
}

function cellClick(e) {
	let cell = e.target;
	let currentTurn;
	if (board.classList.contains(X_CLASS))
		currentTurn = X_CLASS;
	else
		currentTurn = O_CLASS;
	cell.classList.add(currentTurn);
	//console.log(allCells);
	if (checkForWin(cell, currentTurn)) {}
	swapTurns(currentTurn);
}

function checkForWin(cell, currentTurn) {
	let cell_index = [...allCells].indexOf(cell);
	for (i = -1; i <= 1; i++) {
		for (j = -1; j <= 1; j++) {
			if (i == 0 && j == 0) {
				continue;
			}
			let indx_to_check = cell_index + i + board_width_cells * j;
			try {
				if (allCells[indx_to_check].classList.contains(currentTurn)) {
					console.log(`cell ${indx_to_check} has ${currentTurn}`);
					if (checkForLine(indx_to_check, i, j, currentTurn)) {
						console.log("tenemos linea");
					}
				}
			} catch (e) {
				console.log(e);
			}
		}
	}
}


function checkForLine(cell_index, i, j, currentTurn) {
	var cell_count = [2];
	var cell_index = [cell_index];
	console.log(`cell index at beggining = ${cell_index}`);
	if (checkForLineDiretion(cell_index, i, j, currentTurn, cell_count))
		return true;
	console.log(`cell_count = ${cell_count}`)
	console.log(cell_count);
	console.log(cell_count - 1);
	i = -i;
	j = -j;
	cell_index[0] += (cell_count - 1) * (i + j * board_width_cells);
	console.log(`cell index at end = ${cell_index}`);
	return checkForLineDiretion(cell_index, i, j, currentTurn, cell_count);
}

function checkForLineDiretion(cell_index, i, j, currentTurn, cell_count_array) {
	while (allCells[cell_index[0] + i + j * board_width_cells].classList.contains(currentTurn)) {
		cell_count_array[0]++;
		if (cell_count_array[0] == line_lenght)
			return true;
		else {
			console.log(`in cell ${cell_index}`);
			console.log(`line_lenght is ${line_lenght} and cell_count_array[0] is ${cell_count_array}`);
		}
		cell_index[0] += i + j * board_width_cells;
	}
	return false;
}

function swapTurns(currentTurn) {
	if (currentTurn == X_CLASS) {
		board.classList.remove(X_CLASS);
		board.classList.add(O_CLASS);
		currentTurn = O_CLASS;
	} else {
		board.classList.remove(O_CLASS);
		board.classList.add(X_CLASS);
		currentTurn = X_CLASS;
	}
}
