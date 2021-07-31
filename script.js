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
let line_lenght = 0;

main();

/**
 * main - load all the code into the page
 */
function main(){
	line_input.addEventListener('change', freeWidhtHeight);
	playButton.addEventListener('click', startGame);
	window.onresize = windowResized;
}

/**
 * freeWidhtHeight - free or disable the inputs for width and height
 * of the board depending on the input for the line lenght
 */
function freeWidhtHeight(){
	let line = line_input.value;
	if (line != 5){
		width_input_label.classList.add("input-off");
		height_input_label.classList.add("input-off");
		width_input.disabled = true;
		height_input.disabled = true;
	}else{
		width_input_label.classList.remove("input-off");
		height_input_label.classList.remove("input-off");
		width_input.disabled = false;
		height_input.disabled = false;

	}
}

function startGame(){
	line_lenght = line_input.value;
	let board_height_cells = height_input.value;
	let board_width_cells = document.getElementById('width-input').value;
	insertCells(board_width_cells, board_height_cells);
}

function insertCells(board_width_cells, board_height_cells){
	let expected_cell_width = 0
	if (line_lenght == 3){
		expected_cell_width = 150;
		board_width_cells = 3;
		board_height_cells = 3;
	}else if (line_lenght == 4){
		expected_cell_width = 150;
		board_width_cells = 4;
		board_height_cells = 4;
	}else{
		expected_cell_width = 50;
	}
	root.style.setProperty('--cell-size', `${expected_cell_width}px`);
	board.innerHTML='';
	board.style.gridTemplateColumns = `repeat(${board_width_cells}, 1fr)`;
	let fragmento = document.createDocumentFragment();
	for (i = 0; i < board_height_cells*board_width_cells; i++){
		let theCell = document.createElement("div");
		theCell.classList.add("cell");
		fragmento.appendChild(theCell);
	}
	let board_width = container.clientWidth * 0.9 - 4;
	console.log(`board widht: ${board_width}`);
	if (expected_cell_width * board_width_cells > board_width){
		let cell_widht = board_width / board_width_cells;
		root.style.setProperty('--cell-size', `${cell_widht}px`);
		//root.style.setProperty('--mark-size', `${cell_widht * 0.9}px`);
	}
	board.appendChild(fragmento);
}

/**
 * windowResized resize cells to keep them sqare sized
 */
function windowResized(){
	let expected_cell_width = 0;
	let cell_widht = 0;
	if (line_lenght == 5){
		expected_cell_width = 50;
		board_width_cells = width_input.value;
	}else{
		board_width_cells = line_lenght;
		expected_cell_width = 150;
	}
	let board_width = container.clientWidth * 0.9 - 4;
	console.log(`board widht: ${board_width}`);
	if (expected_cell_width * board_width_cells > board_width){
		cell_widht = board_width / board_width_cells;
	}else{
		cell_widht = expected_cell_width;
	}
	root.style.setProperty('--cell-size', `${cell_widht}px`);
}
function cellClick(){
	console.log("click in cell");
}
