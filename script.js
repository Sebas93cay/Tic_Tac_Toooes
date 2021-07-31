const cellElements = document.querySelectorAll('.cell');
const playButton = document.querySelector(".play-button");
const board = document.querySelector(".board");
const root = document.querySelector(':root');

cellElements.forEach(cell => {
	cell.addEventListener('click', cellClick, {once: true});
});

playButton.addEventListener('click', startGame);


function startGame(){
	let board_height_cells = document.getElementById('height-input').value;
	let board_width_cells = document.getElementById('width-input').value;
	insertCells(board_width_cells, board_height_cells);
}

function insertCells(board_width_cells, board_height_cells){
	console.log(`${board_width_cells} and ${board_height_cells}`);
	board.innerHTML='';
	let board_width = board.clientWidth;
	let cell_widht = board_width / board_width_cells;
	root.style.setProperty('--cell-size', `${cell_widht}px`);
	root.style.setProperty('--mark-size', `${cell_widht * 0.9}px`);
	console.log(`${board_width}`);
	console.log(cell_widht);
	board.style.gridTemplateColumns = `repeat(${board_width_cells}, auto)`;
	let fragmento = document.createDocumentFragment();
	for (i = 0; i < board_height_cells*board_width_cells; i++){
		let theCell = document.createElement("div");
		theCell.classList.add("cell");
		fragmento.appendChild(theCell);
	}
	board.appendChild(fragmento);
}
function cellClick(){
	console.log("click in cell");
}
