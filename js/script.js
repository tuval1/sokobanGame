var gPlayer = {cellRow:4,cellCols:4};
var gBoard = buildBoard(10,10);
var gUserSteps=0;
var gWater;
var gBingoCount=0;
function initGame(){
    gState.isGameOn=true;   
}

//build the board
function buildBoard(rows,cols){
    var board = [];
	gWater = [];
    for(var i=0;i<cols;i++){
        var row = [];
        for(var j=0;j<rows;j++){
          cell='';
          if(j===0 || j===rows-1 || i===0 || i===cols-1){
            cell='X';
          }
          else if( i < cols-2 && i > 1 && j > 1 && j < rows-2 && Math.random()>0.85){
            cell='B';
          } 
		  else if(Math.random()>0.91){
              cell='X';
		  }
		  else if(i<4 && Math.random()>0.85){
			  cell='W';
			  gWater.push({x: i, y: j,checked: false});
		  }
		  
          row.push(cell);
        }
        board.push(row);
    }
    board[gPlayer.cellCols][gPlayer.cellRow]='P';
    return board;
}

function renderBoard(){
    var div = document.querySelector('#board');
    var tblHtml = '';

    gBoard.forEach(function(row, i) {
        tblHtml += '<tr>\n';

        row.forEach(function(cell, j) {
            if(cell==='X'){
                var cssClass='block';
            } else if (cell==='B'){
                var cssClass="box";
            } else if(cell==='P') {
                cssClass="player";
            } else if(cell==='W'){
				cssClass = "water";
			}
            else {
                cssClass="wall";
            }
            tblHtml += '<td class="cell-'+i+'-'+j +'" onclick="cellClicked('+i+','+j+')">';
            tblHtml += '<div class="'+cssClass+'">';
            // tblHtml += cell;
            tblHtml += '</div>';
            tblHtml += '</td>';
        }, this);
        tblHtml += '</tr>';
    }, this);
    div.innerHTML = tblHtml;   
}

function checkIfElementNeib(cell,row,el){    
    for(var i=cell-1;i<=cell+1;i++){
        for(var j=row-1; j<=row+1; j++){
            if(i===cell && j===row) continue;
            if(i<0 || i>=board.length) continue;
            if(j<0 || j>=board.length) continue;

            
            if(gBoard[i][j]===el) {
                // var playerCell = gBoard[i][j];
                // UpdatePlayerCell(i,j);
                return true;

            }
        }        
    }
    return false;    
}

function cellClicked(i,j){
	var clickedCell = gBoard[i][j];
	var isPlayerNieb = false;
	//if not wall
	if(clickedCell!='X' && clickedCell!='W'){
		isPlayerNieb = checkIfElementNeib(i,j,'P');
	} 
	if (isPlayerNieb && clickedCell==='B'){
		moveBox(i,j);
	} else if(isPlayerNieb && clickedCell!='B'){
		//move player
	   movePlayer(i,j);
		//update the player cell location
		UpdatePlayerCell(i,j);		
	}
}

function moveBox(i,j) {
    var boxCols = i;
    var boxRow  = j;
    var playerCols = gPlayer.cellCols;
    var playerRow  = gPlayer.cellRow;
    var boxMoved = false;

    if(playerRow>boxRow && boxCols===playerCols && gBoard[i][boxRow-1] !='B' && gBoard[i][boxRow-1]!='X'){
        //move box left
        var j_target = boxRow-1;
		console.log('i',i,'j:',j_target);
        gBoard[i][j_target]=gBoard[i][j];
        gBoard[i][j]='';
        var clickedCellClass = '.cell-'+i+'-'+j;
        var targetCellClass = '.cell-'+i+'-'+j_target;
        boxMoved = true;
        checkIfBingo(i,j_target);        

    } else if(boxRow>playerRow && boxCols===playerCols && gBoard[i][boxRow+1] !='B' && gBoard[i][boxRow+1]!='X'){
        //move box right
        var j_target=boxRow+1;
		console.log('i',i,'j:',j_target);
        gBoard[i][j_target]=gBoard[i][j];
        gBoard[i][j]='';
        var clickedCellClass = '.cell-'+i+'-'+j;
        var targetCellClass = '.cell-'+i+'-'+j_target;
        boxMoved = true;
        checkIfBingo(i,j_target);

    } else if(playerCols>boxCols && playerRow===boxRow && gBoard[boxCols-1][j] !='B' && gBoard[boxCols-1][j]!='X'){
        var i_target=boxCols-1;
		console.log('i:',i_target,'j',j);
        gBoard[i_target][j]=gBoard[i][j];
        gBoard[i][j]='';
        var clickedCellClass = '.cell-'+i+'-'+j;
        var targetCellClass = '.cell-'+i_target+'-'+j;
        boxMoved = true;
        checkIfBingo(i_target,j);
    }
    else if(playerCols<boxCols && playerRow===boxRow && gBoard[boxCols+1][j] !='B' && gBoard[boxCols+1][j]!='X'){
        var i_target=boxCols+1;
		console.log('i:',i_target,'j',j);
        gBoard[i_target][j]=gBoard[i][j];
        gBoard[i][j]='';
        var clickedCellClass = '.cell-'+i+'-'+j;
        var targetCellClass = '.cell-'+i_target+'-'+j;
        boxMoved = true;        
    }   
	
        //update the html table
        if(boxMoved){
            // document.querySelector(targetCellClass).innerHTML = 'B';
        document.querySelector(targetCellClass + ' div').classList.add('box');
        // document.querySelector(clickedCellClass).innerHTML = ''
        document.querySelector(clickedCellClass + ' div').classList.remove('box');
        //move the player
        movePlayer(i,j);
        UpdatePlayerCell(i,j);
        }
        
}

function checkIfBingo(x,y){
	console.log('bingo:',x,y);
	gWater.forEach(function( el ){
		if( el.checked===false && el.x === x && el.y === y) {
			console.log('Bingo!');
			el.checked = true;
			gBingoCount++;
		}
	})
	if(gBingoCount>=gWater.length){
		alert('Victorous!');
	}
}

function movePlayer(i,j){
	var playerCell = gBoard[gPlayer.cellCols][gPlayer.cellRow];
    var t = gBoard[i][j];
    gBoard[i][j] = gBoard[gPlayer.cellCols][gPlayer.cellRow];
    gBoard[gPlayer.cellCols][gPlayer.cellRow] = t;

    //update the html table
    var clickedCellClass = '.cell-'+i+'-'+j;
    var playerCellClass = '.cell-'+gPlayer.cellCols+'-'+gPlayer.cellRow;
    // var t1 = document.querySelector(clickedCellClass).textContent;
    document.querySelector(clickedCellClass + ' div').classList.add('player');
    document.querySelector(playerCellClass + ' div').classList.remove('player');
    gUserSteps++;
    displayUserSteps();
}

function UpdatePlayerCell(i,j){
    gPlayer.cellCols=i;
    gPlayer.cellRow=j;
}

//keyboard actions
document.onkeydown = function myFunction() {
    var playerCols = gPlayer.cellCols;
    var playerRow = gPlayer.cellRow;
switch (event.keyCode) {
case 38:
    cellClicked(playerCols-1,playerRow);
    
    break;
case 40:
    cellClicked(playerCols+1,playerRow);
    
    break;
case 37:
    cellClicked(playerCols,playerRow-1);
    
    break;
case 39:
    cellClicked(playerCols,playerRow+1);
    
    break;
}
}

function displayUserSteps(){
    document.querySelector('.user-steps').innerHTML=gUserSteps;
}
