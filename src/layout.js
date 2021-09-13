let $ = document.getElementById.bind(document);

let tableElement = $("board");

let rotation = 0;
let rotate = (angle) => () => {
  rotation += angle;
  if (angle === 0) {
    rotation = 0;
  }
  tableElement.style.transform = `rotate(${rotation}deg)`;
};

let currentWidth = 0;
let currentHeight = 0;
let widthElem = $("width");
let heightElem = $("height");
let header = $("board-head");
let body = $("board-body");
function updateTable() {
  createHeader();
}

function createHeader() {
  const width = widthElem.value;

  if (currentWidth < width) {
    while (currentWidth < width) {
      let child = document.createElement("th");
      child.innerText = Math.random(0, 10);
      header.appendChild(child);
      currentWidth += 1;
    }
  } else {
    while (currentWidth > width) {
      header.removeChild(header.lastChild);
      currentWidth -= 1;
    }
  }
}

function createRows() {}

$("left").addEventListener("click", rotate(-45));
$("reset").addEventListener("click", rotate(0));
$("right").addEventListener("click", rotate(45));
widthElem.addEventListener("change", updateTable);
heightElem.addEventListener("change", updateTable);
updateTable();

export function getBoard() {}
