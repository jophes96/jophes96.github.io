//gamify by sliding the initial tile to the end tile, make it colored
//or something .... tread the line between over gamification and 
//the value of a paper puzzle like suodku 
// whole game pretty much works with
// CURRENT MOVE + EXISTINGPATH CELLS STATE VARIABLES

/*Constants ____________________________________________*/
const body = document.getElementsByTagName("body")[0];
var table;
/*Constants ____________________________________________*/

/*State Variables ____________________________________________*/
var levelState;

var topVals;
var botVals;
var boardHeight;
var boardWidth;
var boardArea = boardHeight * boardWidth;
var blackBoxes = [];
var winningCells = [];

var currentMove;
var firstCell;
var lastCell;
var existingPathCells = [];
//var leadingCell;
var trailingCell;
/*State Variables ____________________________________________*/


function init(){
    chooseGame();
    
}








/*Game Selection Mechanisms ________________________________________________________________*/
function chooseGame(){
    switch (levelState){
        case "easy":
            easyGame();
            break;
        case "medium":
            medGame();
            break;
        case "hard":
            hardGame();
            break;
        default:
            easyGame();
    }
}

function easyGame()
{
    levelState = "easy";
    topVals = ["",1,2,3,1];
    botVals = ["",2,2,1,2];
    boardHeight = botVals.length;
    boardWidth = topVals.length;
    blackBoxes = [9,12,15,17,23];
    winningCells = [7,8,13,14,19,24,25];
    startGame(topVals, botVals, boardHeight, boardWidth, blackBoxes);
}

function medGame()
{
    levelState = "medium";
    topVals = ["",3,2,3,2,3];
    botVals = ["",1,3,5,3,1];
    boardHeight = botVals.length;
    boardWidth = topVals.length;
    blackBoxes = [12,15,26,29];
    winningCells = [8,14,16,17,20,21,22,23,24,27,28,30,36];
    startGame(topVals, botVals, boardHeight, boardWidth, blackBoxes);
}

function hardGame()
{
    levelState = "hard";
    topVals = ["",0,0,0,0,0,0,0];
    botVals = ["",0,0,0,0,0,0,0];
    boardHeight = botVals.length;
    boardWidth = topVals.length;
    blackBoxes = [];
    startGame(topVals, botVals, boardHeight, boardWidth, blackBoxes);
}

function startGame(topVals, botVals, boardHeight, boardWidth, blackBoxes){
    var tbl = document.getElementById("tableID");
    if(tbl != null){
        destroyGrid();
    }
    createGrid(boardHeight, boardWidth, topVals, botVals, blackBoxes);
}
/*Game Selection Mechanisms ________________________________________________________________*/










/*Board Creation, Destruction ________________________________________________________________*/
function destroyGrid(){
    existingPathCells = [];
    var tbl = document.getElementById("tableID");
    tbl.remove();
}

function resetGrid(){
    destroyGrid();
    levelState = this.levelState;
    init(levelState);
  }

function createGrid(height, width, top, bot, blackboxes){
    
    var tbl = document.createElement("table");
    table = tbl;
    tbl.setAttribute("id", "tableID");
    tbl.setAttribute("align", "center");
    //table = document.getElementById("tableID");

    for (var i = 1; i <= height; i++) {
      var row = document.createElement("tr");
      row.setAttribute("id", "tr", i);
      for (var j =1; j <= width; j++) {
        var cell = document.createElement("td");
        var indexNum = (width*(i-1)) +j;
        cell.setAttribute("id", "td" + indexNum)
        cell.setAttribute("class", "Square");
        cell.setAttribute("onClick", "nextMove(this);")
        cell.style.backgroundColor = "white";
        row.appendChild(cell);
        //console.log(cell.id)
      }
      tbl.appendChild(row);
      j++;
    }
    body.appendChild(tbl);
    setRestrictions(height, width,top, bot, blackboxes);

  }
  function setRestrictions(height, width, top, bot, blackboxes)
  {
    for (var i = 1, j=1; i <= height*width; i += width, j++)
    {
        document.getElementById("td"+i).innerHTML = bot[j-1];
    }
    for (var i = 1; i <= height; i++){
        document.getElementById("td"+i).innerHTML = top[i-1];
    }
    document.getElementById("td1").style.backgroundColor = "black";
    document.getElementById("td"+ height*width).style.backgroundColor = "grey";
    firstCell = document.getElementById("td"+ (width + 2));
    firstCell.style.backgroundColor = "grey";
    firstCell.innerHTML = "X";
    currentMove = firstCell;
    existingPathCells.push(currentMove);
    lastCell = document.getElementById("td"+ (height*width))
    //maybe change above so that every blackbox array passed in has td1 as blacked out...
    if (blackboxes != null){
        for (var i =0; i < blackboxes.length ;i++){
            document.getElementById("td"+blackboxes[i]).style.backgroundColor = "black";
            //console.log(document.getElementById("td"+blackboxes[i]).style.backgroundColor);
        }
    }
        topVals = top;
        botVals = bot;
        boardHeight = height;
        boardWidth = width;
        blackBoxes = blackboxes;
  }
  /*Board Creation, Destruction ________________________________________________________________*/








  /*MOVEMENT________________________________________________________________*/
//called onload
  function listeners(){
      //KEYDOWN WOULD WORK BETTER
        document.addEventListener('keyup', function(event) {
        //left
        if (event.keyCode == '37') {
            var val = currentMove.id.slice(2);
            val = Number(val);
            potentialCurrentMove = document.getElementById("td" + (val - 1) );
            nextMove(potentialCurrentMove);
        } // right
        else if (event.keyCode =='39'){

            var val = currentMove.id.slice(2);
            val = Number(val);
            potentialCurrentMove = document.getElementById("td" + (val + 1) );
            nextMove(potentialCurrentMove);
        } //up
        else if (event.keyCode =='38'){
            var val = currentMove.id.slice(2);
            val = Number(val);
            potentialCurrentMove = document.getElementById("td" + (val - boardHeight) );
            nextMove(potentialCurrentMove);
        } // down
        else if (event.keyCode =='40'){
            var val = currentMove.id.slice(2);
            val = Number(val);
            potentialCurrentMove = document.getElementById("td" + (val + boardHeight) );
            nextMove(potentialCurrentMove);
        } 
      });
}
  
  function undo(){
    
    if(currentMove == lastCell && checkForWinner()){
        alert("Youve already won!");
    } else if(currentMove == lastCell && !checkForWinner()){
        doUndoing();
    }
    else if (currentMove != firstCell){
        
        doUndoing();
    } 
  }

  function doUndoing(){

    currentMove.innerHTML = "";
    currentMove.style.backgroundColor = "white";
    currentMove = existingPathCells[existingPathCells.length -2];
    existingPathCells.pop();
    move();

  }


  function nextMove(Square){

    //if able to be moved
    if (forwardConditions(Square)){
        console.log("can move there");
        currentMove = Square;
        existingPathCells.push(currentMove);
        move();
        // need a check for win call here maybe? for future stuff
    } // if its the trailing cell
    else if(Square == trailingCell){
        undo();
    }else{
        console.log("Cant Move There!");
    }

}


function move(){
        
        if(currentMove == lastCell && checkForWinner()){
            alert("you the winner");
            fillLeadingCell();
            setTrailAppearance();
        } else if (currentMove == lastCell && !checkForWinner()){
            alert("try again!");
            undo();
            lastCell.style.backgroundColor = "grey";
        } else{
            fillLeadingCell();
            setTrailAppearance();
        }
}

function fillLeadingCell(){
    leadingCell = existingPathCells[existingPathCells.length-1];
    leadingCell.style.backgroundColor = "grey";
    leadingCell.innerHTML = "X";
    leadingCell.style.opacity = 1;

}

function setTrailAppearance(){

        trailingCell = existingPathCells[existingPathCells.length-2];
        trailingCell.style.backgroundColor = "grey";
        trailingCell.innerHTML = "";
        trailingCell.style.opacity = .95;

        
        for (var i=0; i < existingPathCells.length-2; i++)
        {
            // for decreasing opacity, divide 100(or like area *4 or something) by the number of steps in the path
            cellInPath = existingPathCells[i];
            cellInPath.style.backgroundColor = "black";
            cellInPath.style.opacity = .45;
            cellInPath.innerHTML = "";
        }
}


function forwardConditions(Square){

    if(notFirstSquare(Square) &&
    notNumberSquare(Square)&&
    notBlack(Square) &&
    isAdjacent(Square) &&
    isNotExistingPath(Square) &&
    (checkForWinner() == false)
    ){
        return true;
    } else{
        console.log("a forward condition didnt pass");
        return false;
        
    }
}

function notFirstSquare(Square){
    if(Square != firstCell){
         return true;
    }else if (Square == firstCell){
        console.log("clicked on a first square");
        return false;
    }
}

function notNumberSquare(Square){
    if(Square.innerHTML != "" && Square.innerHTML >= 0){
        console.log("clicked on a number square");
        return false;
    }else{
        return true;
    }
}

function notBlack(Square){
    if (Square.style.backgroundColor == "black"){
        console.log("clicked on a black square");
        return false;
    } else {
        return true;
    }
}

function isAdjacent(Square){
    var cellNumClicked = (Square.id).slice(2);
    var cellNumCurrent = (currentMove.id).slice(2);
    var difference = cellNumClicked - cellNumCurrent;
    if(difference==1 ){
        console.log("adjacent right")
        return true;
    } else if ( difference == -1 ){
        console.log("adjacent left")
        return true;
    } else if (difference == boardWidth){
        console.log("adjacent bottom")
        return true;
    }else if(difference == -(boardWidth)){
        console.log("adjacent top")
        return true;
    } else{
        console.log("not adjacent");
        return false;
    }
}

function isNotExistingPath(Square){
    var status = true;
    for (var i = 0; i < existingPathCells.length; i++ ){
        if (existingPathCells[i].id == Square.id){
            status = false;
        }
    }
    return status;
}
  /*MOVEMENT________________________________________________________________*/







/*Winning Mechanisms ________________________________________________________________*/

function checkForWin(){
    if(checkForWinner()){
        alert("yup, youve won!");
        return true;
    }else{
        alert("you did not win");
        return false;
    }
}

function checkForWinner(){

        var state = true;
        var path = [];

        for (var i =0; i < existingPathCells.length; i++)
        {
            pathVal = existingPathCells[i].id.slice(2);
            path.push(parseInt(pathVal));
        }

        //ORDER PATH AND EXISTING PATH IN SIZE ORDER, FOR CONSISTANCY
        winningCells.sort(function(a, b){return a - b});
        path.sort(function(a, b){return a - b});

        for (var i =0, x=0; i < path.length, x < winningCells.length;i++, x++ ){

            if (path[i] != winningCells[i])
            {
                state = false;
                break;
            }
        }

        console.log(winningCells);
        console.log(path);

        return state;

}

/*Winning Mechanisms ________________________________________________________________*/


