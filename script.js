const GAME_GRID = document.querySelector('.container');
const TILES = Array.from(GAME_GRID.children);
const RESET_BTN = document.querySelector('.reset-btn');
const OUTCOME_DIV = document.querySelector('.outcome-container')

class GameView {
    constructor() {
        this.game_logic = new GameLogic();

        TILES.forEach(tile => {
            tile.addEventListener("click", (e) => this.playTurn(e));
        })

        RESET_BTN.addEventListener("click", () => this.reset());
    }

    reset() {
        TILES.forEach(tile => {
            tile.innerHTML = "";
            tile.classList = "";
        })

        OUTCOME_DIV.innerHTML = "";

        this.game_logic = new GameLogic();
    }

    chooseMove(e, player) {
        e.target.classList = player
        e.target.innerHTML = this.game_logic.setMove();
    }

    onGameEnd(status) {
        OUTCOME_DIV.innerHTML = status;
    }

    playTurn(e) {
        if (e.target.innerHTML != "" || this.game_logic.game_over) {
            return;
        }

        const starting_player = this.game_logic.player;
        this.chooseMove(e, starting_player);

        const status = GameLogic.getGameStatus(starting_player);
        if (status) {
            this.game_logic.game_over = true;
            this.onGameEnd(status);
        }
    }
}

class GameLogic {
    constructor() {
        this.player = 'X';
        this.switchPlayer = {
            X: 'O',
            O: 'X'
        }

        this.turns = 0;
        this.game_over = false;
    }

    setMove() {
        this.turns += 1;

        const player = this.player;
        this.player = this.switchPlayer[player];

        return player;
    }

    static getGameStatus(player) {
        for (let i = 0; i < 3; i++) {
            if (this.checkRow(i + 1, player) || this.checkColumn(i + 1, player)) {
                return player + ' Wins!';
            }
        }

        if (this.checkDiag(1, player) || this.checkDiag(-1, player)) {
            return player + ' Wins!';
        }

        if (this.turns == 9) {
            return 'Draw!';
        }

        return false;
    }

    static checkRow(r, player) {
        const start = 3 * (r - 1) + 1
        for (let j = 0; j < 3; j++) {
            if (TILES[start + j - 1].innerHTML != player) {
                return false;
            }
        }
        return true;
    }

    static checkColumn(c, player) {
        for (let j = 0; j < 3; j++) {
            if (TILES[c + 3 * j - 1].innerHTML != player) {
                return false;
            }
        }
        return true;
    }

    static checkDiag(sign, player) {
        const start = 2 - sign 
        for (let j = 0; j < 3; j++) {
            if (TILES[start + 3 * j + j * sign - 1].innerHTML != player) {
                return false;
            }
        }
        return true;
    }
}

const game = new GameView();