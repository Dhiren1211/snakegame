   // Game elements
        const gameContainer = document.getElementById('game-container');
        const scoreElement = document.getElementById('score');
        const foodElement = document.getElementById('food');
        const snakeContainer = document.getElementById('snake-container');
        const gameOverScreen = document.getElementById('game-over');
        const finalScoreElement = document.getElementById('final-score');
        const startBtn = document.getElementById('start-btn');
        const pauseBtn = document.getElementById('pause-btn');
        const restartBtn = document.getElementById('restart-btn');

        // Game settings
        const gridSize = 20;
        const gridWidth = 500 / gridSize;
        const gridHeight = 400 / gridSize;
        let snake = [];
        let food;
        let direction;
        let nextDirection;
        let score;
        let gameInterval;
        let isPaused = false;
        const gameSpeed = 110;
        const foodIcons = ['🍎', '🍕', '🍓', '🍇', '🍌', '🍒', '🍉', '🍔','🍖'];

        // Create grid lines
        function createGrid() {
            // Horizontal lines
            for (let y = 0; y < gridHeight; y++) {
                const line = document.createElement('div');
                line.className = 'grid-line horizontal-line';
                line.style.top = `${y * gridSize}px`;
                gameContainer.appendChild(line);
            }
            
            // Vertical lines
            for (let x = 0; x < gridWidth; x++) {
                const line = document.createElement('div');
                line.className = 'grid-line vertical-line';
                line.style.left = `${x * gridSize}px`;
                gameContainer.appendChild(line);
            }
        }

        // Generate food at random position
        function generateFood() {
            let newFoodPosition;
            do {
                newFoodPosition = {
                    x: Math.floor(Math.random() * gridWidth),
                    y: Math.floor(Math.random() * gridHeight),
                    icon: foodIcons[Math.floor(Math.random() * foodIcons.length)]
                };
            } while (snake.some(segment => segment.x === newFoodPosition.x && segment.y === newFoodPosition.y));

            foodElement.textContent = newFoodPosition.icon;
            foodElement.style.left = `${newFoodPosition.x * gridSize}px`;
            foodElement.style.top = `${newFoodPosition.y * gridSize}px`;
            return newFoodPosition;
        }

        // Update snake display
        function updateSnakeDisplay() {
            snakeContainer.innerHTML = '';
            snake.forEach((segment, index) => {
                const segmentDiv = document.createElement('div');
                segmentDiv.classList.add('snake-segment');
                if (index === 0) segmentDiv.classList.add('snake-head');
                
                // Add slight curve to body segments
                if (index > 0 && index < snake.length - 1) {
                    const prev = snake[index - 1];
                    const next = snake[index + 1];
                    
                    if (prev.x !== next.x && prev.y !== next.y) {
                        segmentDiv.style.borderRadius = 
                            (prev.x < segment.x || next.x < segment.x ? '10px 0 0 0' : '0 10px 0 0') +
                            (prev.y < segment.y || next.y < segment.y ? ' 10px 0 0 0' : ' 0 10px 0 0');
                    }
                }
                
                segmentDiv.style.left = `${segment.x * gridSize}px`;
                segmentDiv.style.top = `${segment.y * gridSize}px`;
                snakeContainer.appendChild(segmentDiv);
            });
        }

        // Game update function
        function update() {
            if (isPaused) return;
            
            // Update direction
            direction = nextDirection || direction;
            
            const head = { ...snake[0] };

            switch (direction) {
                case 'up':
                    head.y--;
                    break;
                case 'down':
                    head.y++;
                    break;
                case 'left':
                    head.x--;
                    break;
                case 'right':
                    head.x++;
                    break;
            }

            // Check collisions
            if (head.x < 0 || head.x >= gridWidth || head.y < 0 || head.y >= gridHeight || 
                checkCollision(head)) {
                endGame();
                return;
            }

            snake.unshift(head);

            // Check if food eaten
            if (head.x === food.x && head.y === food.y) {
                score++;
                scoreElement.textContent = `Score: ${score}`;
                food = generateFood();
            } else {
                snake.pop();
            }
            
            updateSnakeDisplay();
        }

        // Check if snake collides with itself
        function checkCollision(head) {
            return snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
        }

        // End game function
        function endGame() {
            clearInterval(gameInterval);
            finalScoreElement.textContent = `Score: ${score}`;
            gameOverScreen.style.display = 'flex';
        }

        // Handle keyboard input
        function handleKeyPress(event) {
            switch (event.key) {
                case 'ArrowUp':
                    if (direction !== 'down') nextDirection = 'up';
                    break;
                case 'ArrowDown':
                    if (direction !== 'up') nextDirection = 'down';
                    break;
                case 'ArrowLeft':
                    if (direction !== 'right') nextDirection = 'left';
                    break;
                case 'ArrowRight':
                    if (direction !== 'left') nextDirection = 'right';
                    break;
                case ' ':
                    togglePause();
                    break;
            }
        }

        // Toggle pause
        function togglePause() {
            isPaused = !isPaused;
            pauseBtn.textContent = isPaused ? 'Resume' : 'Pause';
        }

        // Start new game
        function startGame() {
            clearInterval(gameInterval);
            
            // Reset game state
            snake = [{ x: 10, y: 10 }];
            direction = 'right';
            nextDirection = null;
            score = 0;
            isPaused = false;
            
            // Update UI
            scoreElement.textContent = `Score: ${score}`;
            gameOverScreen.style.display = 'none';
            pauseBtn.textContent = 'Pause';
            
            // Generate food and draw snake
            food = generateFood();
            updateSnakeDisplay();
            
            // Start game loop
            gameInterval = setInterval(update, gameSpeed);
        }

        // Initialize game
        function init() {
            createGrid();
            startBtn.addEventListener('click', startGame);
            pauseBtn.addEventListener('click', togglePause);
            restartBtn.addEventListener('click', startGame);
            document.addEventListener('keydown', handleKeyPress);
        }

        // Start the game
        init();