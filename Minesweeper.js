document.addEventListener("DOMContentLoaded", function(event) {
  let grid = document.getElementById("grid");
  createGrid();
});

let seconds, minute, timer, checkedCells = 0;
let gameEnded = false;

function createGrid() {
  for (let i = 0; i < 9; ++i) {
    let row = grid.insertRow(i);
    for (let j = 0; j < 9; ++j) {
      let cell = row.insertCell(j);
      cell.onclick = function() {leftClick(i, j);};
      cell.addEventListener('contextmenu', function(ev) {rightClick(i, j); ev.preventDefault(); return false;}, false);
      let mine = document.createAttribute("activeBombe", "false");                   
      cell.setAttributeNode(mine);
    }
  }
  seconds = 0;
  minute = 0;
  timer = setInterval(countTimer, 1000);
  generateBombes();
  document.getElementById("startAgain").style.visibility = "hidden";
}

function generateBombes() {
  for (let i = 0; i < 10; ++i) {
    let row = Math.floor(Math.random() * 9);
    let col = Math.floor(Math.random() * 9);
    let cell = grid.rows[row].cells[col];
    if (cell.getAttribute("activeBombe") == "true") {
      --i;
    }
    cell.setAttribute("activeBombe", "true");
  }
}

function rightClick(i, j) {
  grid.rows[i].cells[j].style.backgroundColor = "blue";
}

function leftClick(i, j) {
  let cell = grid.rows[i].cells[j];
  if (cell.getAttribute("activeBombe") == "true" && gameEnded == false) {
    endGame();
  } else if (gameEnded == false && cell.innerHTML == "") {
    cell.style.backgroundColor = "grey";
    ++checkedCells;
    if (checkedCells == 71) {
      endGame();
    }
    let adjacentBombs = 0;
    for (let m = i - 1; m <= i + 1; ++m) {
      for(let n = j - 1; n <= j + 1; ++n) {
        if (m >= 0 && m <= 8 && n >= 0 && n <= 8 && grid.rows[m].cells[n].getAttribute("activeBombe") == "true") {
          ++adjacentBombs;
        }
      }
    }
    if (adjacentBombs != 0) {
      cell.innerHTML = adjacentBombs;
    } else {
      cell.innerHTML = " ";
      for (let k = i - 1; k <= i + 1; ++k) {
        for(let l = j - 1; l <= j + 1; ++l) {
          if (k >= 0 && k <= 8 && l >= 0 && l <= 8 && grid.rows[k].cells[l].innerHTML == "") {
            leftClick(k, l);
          } 
        }
      }
    }
  }
}

function endGame() {
  clearInterval(timer);
  showBombes();
  gameEnded = true;
  if (checkedCells == 71) {
    print("Congratulations! You won!");
  } else {    
    print("Sorry! You lost!");
  }
}

function showBombes() {
  for (let i = 0; i < 9; ++i) {
    for (let j = 0; j < 9; ++j) {
      let cell = grid.rows[i].cells[j];
      if (cell.getAttribute("activeBombe") == "true") {
        cell.style.backgroundColor = "red";
        document.getElementById("startAgain").style.visibility = "visible";
      } 
    }
  }
}

function countTimer() {
  ++seconds;
  if(minute < 10)
    minutes = "0" + minute;
  if(seconds < 10) {
    seconds = "0" + seconds;
  }
  if (seconds >= 60) {
    ++minute;
    seconds = 0;
  }
  document.getElementById("chronometer").innerHTML = minutes + ":" + seconds;
}

function print(str) {
  return document.getElementById("gameStatusMesage").innerHTML = str;
}

function reStart() {
  checkedCells = 0;
  grid.innerHTML = "";
  print("");
  createGrid();
  gameEnded = false;
}