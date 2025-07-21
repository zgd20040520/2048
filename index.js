// 游戏主逻辑
document.addEventListener('DOMContentLoaded', () => {
    // 游戏状态
    let board = [];
    let score = 0;
    let gameOver = false;
    const gridSize = 4;
    
    // 初始化游戏
    function initGame() {
        board = Array(gridSize).fill().map(() => Array(gridSize).fill(0));
        score = 0;
        gameOver = false;
        document.getElementById('score').textContent = score;
        document.getElementById('gameover').style.display = 'none';
        
        // 清空所有格子
        document.querySelectorAll('.number-cell').forEach(cell => cell.remove());
        
        // 初始生成两个数字
        generateRandomNumber();
        generateRandomNumber();
        
        // 更新界面
        updateView();
    }
    
    // 生成随机数字（2或4）
    function generateRandomNumber() {
        if (gameOver) return;
        
        // 找出所有空格子
        const emptyCells = [];
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                if (board[row][col] === 0) {
                    emptyCells.push({ row, col });
                }
            }
        }
        
        if (emptyCells.length > 0) {
            // 随机选择一个空格子
            const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            // 90%概率生成2，10%概率生成4
            board[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
        }
    }
    
    // 更新游戏界面
    function updateView() {
        // 更新分数
        document.getElementById('score').textContent = score;
        
        // 清空所有数字格子
        document.querySelectorAll('.number-cell').forEach(cell => cell.remove());
        
        // 添加数字格子
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                const value = board[row][col];
                if (value !== 0) {
                    const numberCell = document.createElement('div');
                    numberCell.className = 'number-cell';
                    numberCell.textContent = value;
                    numberCell.style.top = `${row * 120 + 20}px`;
                    numberCell.style.left = `${col * 120 + 20}px`;
                    
                    // 根据数字大小设置不同样式
                    numberCell.style.backgroundColor = getNumberColor(value);
                    numberCell.style.color = value <= 4 ? '#776e65' : '#f9f6f2';
                    numberCell.style.fontSize = value < 100 ? '60px' : value < 1000 ? '50px' : '40px';
                    
                    document.getElementById('grid-container').appendChild(numberCell);
                }
            }
        }
    }
    
    // 获取数字对应的背景颜色
    function getNumberColor(number) {
        const colors = {
            2: '#eee4da',
            4: '#ede0c8',
            8: '#f2b179',
            16: '#f59563',
            32: '#f67c5f',
            64: '#f65e3b',
            128: '#edcf72',
            256: '#edcc61',
            512: '#edc850',
            1024: '#edc53f',
            2048: '#edc22e'
        };
        return colors[number] || '#3c3a32';
    }
    
    // 移动格子
    function move(direction) {
        if (gameOver) return false;
        
        let moved = false;
        const oldBoard = JSON.parse(JSON.stringify(board));
        
        // 根据方向处理移动逻辑
        switch (direction) {
            case 'up':
                for (let col = 0; col < gridSize; col++) {
                    for (let row = 1; row < gridSize; row++) {
                        if (board[row][col] !== 0) {
                            let currentRow = row;
                            while (currentRow > 0 && (board[currentRow - 1][col] === 0 || board[currentRow - 1][col] === board[row][col])) {
                                if (board[currentRow - 1][col] === 0) {
                                    board[currentRow - 1][col] = board[currentRow][col];
                                    board[currentRow][col] = 0;
                                    currentRow--;
                                    moved = true;
                                } else if (board[currentRow - 1][col] === board[currentRow][col]) {
                                    board[currentRow - 1][col] *= 2;
                                    score += board[currentRow - 1][col];
                                    board[currentRow][col] = 0;
                                    moved = true;
                                    break;
                                }
                            }
                        }
                    }
                }
                break;
                
            case 'down':
                for (let col = 0; col < gridSize; col++) {
                    for (let row = gridSize - 2; row >= 0; row--) {
                        if (board[row][col] !== 0) {
                            let currentRow = row;
                            while (currentRow < gridSize - 1 && (board[currentRow + 1][col] === 0 || board[currentRow + 1][col] === board[row][col])) {
                                if (board[currentRow + 1][col] === 0) {
                                    board[currentRow + 1][col] = board[currentRow][col];
                                    board[currentRow][col] = 0;
                                    currentRow++;
                                    moved = true;
                                } else if (board[currentRow + 1][col] === board[currentRow][col]) {
                                    board[currentRow + 1][col] *= 2;
                                    score += board[currentRow + 1][col];
                                    board[currentRow][col] = 0;
                                    moved = true;
                                    break;
                                }
                            }
                        }
                    }
                }
                break;
                
            case 'left':
                for (let row = 0; row < gridSize; row++) {
                    for (let col = 1; col < gridSize; col++) {
                        if (board[row][col] !== 0) {
                            let currentCol = col;
                            while (currentCol > 0 && (board[row][currentCol - 1] === 0 || board[row][currentCol - 1] === board[row][col])) {
                                if (board[row][currentCol - 1] === 0) {
                                    board[row][currentCol - 1] = board[row][currentCol];
                                    board[row][currentCol] = 0;
                                    currentCol--;
                                    moved = true;
                                } else if (board[row][currentCol - 1] === board[row][currentCol]) {
                                    board[row][currentCol - 1] *= 2;
                                    score += board[row][currentCol - 1];
                                    board[row][currentCol] = 0;
                                    moved = true;
                                    break;
                                }
                            }
                        }
                    }
                }
                break;
                
            case 'right':
                for (let row = 0; row < gridSize; row++) {
                    for (let col = gridSize - 2; col >= 0; col--) {
                        if (board[row][col] !== 0) {
                            let currentCol = col;
                            while (currentCol < gridSize - 1 && (board[row][currentCol + 1] === 0 || board[row][currentCol + 1] === board[row][col])) {
                                if (board[row][currentCol + 1] === 0) {
                                    board[row][currentCol + 1] = board[row][currentCol];
                                    board[row][currentCol] = 0;
                                    currentCol++;
                                    moved = true;
                                } else if (board[row][currentCol + 1] === board[row][currentCol]) {
                                    board[row][currentCol + 1] *= 2;
                                    score += board[row][currentCol + 1];
                                    board[row][currentCol] = 0;
                                    moved = true;
                                    break;
                                }
                            }
                        }
                    }
                }
                break;
        }
        
        if (moved) {
            generateRandomNumber();
            updateView();
            
            // 检查游戏是否结束
            if (isGameOver()) {
                gameOver = true;
                document.getElementById('gameover').style.display = 'block';
            }
        }
        
        return moved;
    }
    
    // 检查游戏是否结束
    function isGameOver() {
        // 检查是否有空格子
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                if (board[row][col] === 0) {
                    return false;
                }
            }
        }
        
        // 检查是否有相邻的相同数字
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                const value = board[row][col];
                if (col < gridSize - 1 && board[row][col + 1] === value) {
                    return false;
                }
                if (row < gridSize - 1 && board[row + 1][col] === value) {
                    return false;
                }
            }
        }
        
        return true;
    }
    
    // 新游戏
    window.newGame = function() {
        initGame();
    };
    
    // 键盘控制
    document.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'ArrowUp':
                move('up');
                break;
            case 'ArrowDown':
                move('down');
                break;
            case 'ArrowLeft':
                move('left');
                break;
            case 'ArrowRight':
                move('right');
                break;
        }
    });
    
    // 触摸滑动控制（移动端支持）
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    
    document.addEventListener('touchstart', (event) => {
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
    }, false);
    
    document.addEventListener('touchend', (event) => {
        touchEndX = event.changedTouches[0].clientX;
        touchEndY = event.changedTouches[0].clientY;
        handleSwipe();
    }, false);
    
    function handleSwipe() {
        const dx = touchEndX - touchStartX;
        const dy = touchEndY - touchStartY;
        
        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 50) {
                move('right');
            } else if (dx < -50) {
                move('left');
            }
        } else {
            if (dy > 50) {
                move('down');
            } else if (dy < -50) {
                move('up');
                
            }
        }
    }
    
    // 初始化游戏
    initGame();
});