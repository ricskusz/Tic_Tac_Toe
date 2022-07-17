const gameBoard = (() => {

    const boardContainer = document.querySelector('.game-container');
    let cellItems = [];
    // generate the cell elements
    const displayGameBoard = () => {
        for(let i = 0; i < 9; i++){

            let cell = document.createElement('div');
            cell.setAttribute('data-index', `${i+1}`);
            cell.classList.add('cell');
            boardContainer.appendChild(cell);
            cellItems.push(cell);
        }
    }
    // return the cells
    const getCells = () => {
        return cellItems;
    }
    // clear the board for the new game
    const clearBoard = () => {
        while(boardContainer.firstChild) boardContainer.removeChild(boardContainer.firstChild);
        cellItems = [];
    }

    return {
        displayGameBoard,
        getCells,
        clearBoard
    }
})();

const createPlayer = (mark) => {

    // players can mark the fields
    let fields = [];
    const placeMark = elementIndex => {
        fields.push(elementIndex);
    };

    return {
        mark,
        placeMark,
        fields,
    };
}

// game object for the game things
const game = (() => {
   
    const endScreen = document.querySelector('.endscreen');
    const message = document.querySelector('.message');
    // new game 
    const restartButton = document.querySelector('#restart');
    restartButton.addEventListener('click', () => {
        playGame();
        endScreen.setAttribute('style', 'display: none;');
    });

    let isPlayerOneTurn = true;

    // central function handle the game
    const playGame = () => {
        const table = gameBoard;
        table.clearBoard();
        const cells = table.getCells();
        let tableLock = false;
        table.displayGameBoard();
        const player1 = createPlayer('X');
        const player2 = createPlayer('O');

        cells.forEach(element => {
            element.addEventListener('click', () => {
                handleGame(element, cells, tableLock, player1, player2);
            });
        });
    };

    // display the endscreen
    const displayEndScreen = winner => {
        endScreen.setAttribute('style', 'display: flex;');
        message.textContent = `"${winner}" - player wins!`;
        if(winner == "draw") message.textContent = `Draw!`;
    }

    // handle screen events
    const handleGame = (element, cells, tableLock, player1, player2) => {
        if(element.textContent || tableLock) return;

        if(isPlayerOneTurn){
            player1.placeMark(parseInt(element.dataset.index));
            element.textContent = player1.mark;
        }else{
            player2.placeMark(parseInt(element.dataset.index));
            element.textContent = player2.mark;
        }
        
        if(checkWinner(player1.fields)){
            tableLock = true;
            displayEndScreen(player1.mark);
        }

        if(checkWinner(player2.fields)){
            tableLock = true;
            displayEndScreen(player2.mark);
        }

        if(!cells.some(cell => cell.textContent == "") && !tableLock){
            displayEndScreen("draw");
        }
        isPlayerOneTurn = !isPlayerOneTurn;
    }

    const checkWinner = marksArray => {
        let temp;
        let patternCheck = [];
        let isWinner;
        const WINNING_COMBINATIONS = [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9],
            [1, 5, 9],
            [3, 5, 7],
            [2, 5, 8],
            [1, 4, 7],
            [2, 5, 8],
            [3, 6, 9],
        ];

        // check for matching pattern for decide we have a winner or not
        WINNING_COMBINATIONS.forEach(array => {
            temp = array.every(element => marksArray.includes(element));
            patternCheck.push(temp);
        });
        
        isWinner = patternCheck.includes(true) ? true : false;
        return isWinner;
    }

    return {
        playGame,
    }
})();
game.playGame();