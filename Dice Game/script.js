/* =========================================
   DICE GAME - JAVASCRIPT
   Game logic and interactions
   ========================================= */

// =========================================
// GAME STATE
// =========================================
const gameState = {
  mode: null, // 'pvp' or 'pvc'
  currentPlayer: 1,
  scores: [0, 0], // Player 1 and Player 2 scores
  currentScore: 0,
  isPlaying: false,
  winningScore: 100,
};

// =========================================
// DOM ELEMENTS
// =========================================
const elements = {
  modeSelection: document.getElementById('modeSelection'),
  gameArea: document.getElementById('gameArea'),
  gameControls: document.getElementById('gameControls'),
  winnerModal: document.getElementById('winnerModal'),
  
  player1Section: document.getElementById('player1Section'),
  player2Section: document.getElementById('player2Section'),
  player1Name: document.getElementById('player1Name'),
  player2Name: document.getElementById('player2Name'),
  player1Score: document.getElementById('player1Score'),
  player2Score: document.getElementById('player2Score'),
  
  dice1: document.getElementById('dice1'),
  dice2: document.getElementById('dice2'),
  current1: document.getElementById('current1'),
  current2: document.getElementById('current2'),
  
  turnIndicator: document.getElementById('turnIndicator'),
  turnText: document.getElementById('turnText'),
  rollBtn: document.getElementById('rollBtn'),
  holdBtn: document.getElementById('holdBtn'),
  
  winnerText: document.getElementById('winnerText'),
  finalScore: document.getElementById('finalScore'),
  rulesContent: document.getElementById('rulesContent'),
};

// =========================================
// GAME FUNCTIONS
// =========================================

/**
 * Start the game with selected mode
 * @param {string} mode - 'pvp' or 'pvc'
 */
function startGame(mode) {
  gameState.mode = mode;
  gameState.isPlaying = true;
  
  // Update player names based on mode
  if (mode === 'pvc') {
    elements.player2Name.textContent = '🤖 Computer';
  } else {
    elements.player2Name.textContent = 'Player 2';
  }
  
  // Hide mode selection, show game
  elements.modeSelection.style.display = 'none';
  elements.gameArea.classList.add('active');
  elements.gameControls.classList.add('active');
  
  // Initialize game state
  initializeGame();
}

/**
 * Initialize/reset game state
 */
function initializeGame() {
  gameState.currentPlayer = 1;
  gameState.scores = [0, 0];
  gameState.currentScore = 0;
  
  // Update UI
  elements.player1Score.textContent = '0';
  elements.player2Score.textContent = '0';
  elements.current1.textContent = '-';
  elements.current2.textContent = '-';
  
  // Reset dice
  elements.dice1.removeAttribute('data-value');
  elements.dice2.removeAttribute('data-value');
  elements.dice1.querySelector('.dice-face').textContent = '?';
  elements.dice2.querySelector('.dice-face').textContent = '?';
  
  // Set active player
  updateActivePlayer();
  
  // Enable controls
  elements.rollBtn.disabled = false;
  elements.holdBtn.disabled = false;
}

/**
 * Roll the dice
 */
function rollDice() {
  if (!gameState.isPlaying) return;
  
  // Disable buttons during roll
  elements.rollBtn.disabled = true;
  elements.holdBtn.disabled = true;
  
  // Get current dice element
  const currentDice = gameState.currentPlayer === 1 ? elements.dice1 : elements.dice2;
  
  // Add rolling animation
  currentDice.classList.add('rolling');
  
  // Generate random number after animation
  setTimeout(() => {
    const diceValue = Math.floor(Math.random() * 6) + 1;
    
    // Update dice display
    currentDice.classList.remove('rolling');
    currentDice.setAttribute('data-value', diceValue);
    currentDice.querySelector('.dice-face').textContent = '';
    
    // Handle dice result
    handleDiceResult(diceValue);
  }, 500);
}

/**
 * Handle the result of a dice roll
 * @param {number} value - The dice value (1-6)
 */
function handleDiceResult(value) {
  const currentElement = gameState.currentPlayer === 1 ? elements.current1 : elements.current2;
  const playerSection = gameState.currentPlayer === 1 ? elements.player1Section : elements.player2Section;
  
  if (value === 1) {
    // Rolled a 1 - lose current score and switch player
    playerSection.classList.add('shake');
    setTimeout(() => playerSection.classList.remove('shake'), 500);
    
    gameState.currentScore = 0;
    currentElement.textContent = '0';
    
    // Show message
    showMessage(`💀 Rolled a 1! Lost all points!`);
    
    // Switch player after delay
    setTimeout(() => {
      switchPlayer();
    }, 1000);
  } else {
    // Add to current score
    gameState.currentScore += value;
    currentElement.textContent = gameState.currentScore;
    currentElement.classList.add('pulse');
    setTimeout(() => currentElement.classList.remove('pulse'), 300);
    
    // Re-enable buttons
    elements.rollBtn.disabled = false;
    elements.holdBtn.disabled = false;
  }
}

/**
 * Hold current score and switch player
 */
function holdScore() {
  if (!gameState.isPlaying || gameState.currentScore === 0) return;
  
  // Add current score to player's total
  const playerIndex = gameState.currentPlayer - 1;
  gameState.scores[playerIndex] += gameState.currentScore;
  
  // Update score display
  const scoreElement = gameState.currentPlayer === 1 ? elements.player1Score : elements.player2Score;
  scoreElement.textContent = gameState.scores[playerIndex];
  scoreElement.classList.add('pulse');
  setTimeout(() => scoreElement.classList.remove('pulse'), 300);
  
  // Check for winner
  if (gameState.scores[playerIndex] >= gameState.winningScore) {
    endGame(gameState.currentPlayer);
    return;
  }
  
  // Reset current score and switch player
  gameState.currentScore = 0;
  switchPlayer();
}

/**
 * Switch to the other player
 */
function switchPlayer() {
  // Reset current score display for current player
  const currentElement = gameState.currentPlayer === 1 ? elements.current1 : elements.current2;
  currentElement.textContent = '-';
  
  // Switch player
  gameState.currentPlayer = gameState.currentPlayer === 1 ? 2 : 1;
  gameState.currentScore = 0;
  
  // Update UI
  updateActivePlayer();
  
  // If playing against computer and it's computer's turn
  if (gameState.mode === 'pvc' && gameState.currentPlayer === 2) {
    elements.rollBtn.disabled = true;
    elements.holdBtn.disabled = true;
    setTimeout(() => computerTurn(), 1000);
  } else {
    elements.rollBtn.disabled = false;
    elements.holdBtn.disabled = false;
  }
}

/**
 * Update UI to show active player
 */
function updateActivePlayer() {
  if (gameState.currentPlayer === 1) {
    elements.player1Section.classList.add('active');
    elements.player2Section.classList.remove('active');
    elements.turnText.textContent = "Player 1's Turn";
  } else {
    elements.player1Section.classList.remove('active');
    elements.player2Section.classList.add('active');
    elements.turnText.textContent = gameState.mode === 'pvc' ? "Computer's Turn" : "Player 2's Turn";
  }
}

/**
 * Computer AI turn
 */
function computerTurn() {
  if (!gameState.isPlaying || gameState.currentPlayer !== 2) return;
  
  // Simple AI: Roll until reaching 20 points or risk assessment
  const shouldHold = gameState.currentScore >= 20 || 
                     (gameState.scores[1] + gameState.currentScore >= gameState.winningScore);
  
  if (shouldHold && gameState.currentScore > 0) {
    // Computer holds
    setTimeout(() => {
      holdScore();
    }, 800);
  } else {
    // Computer rolls
    rollDice();
    
    // Schedule next decision after roll completes
    setTimeout(() => {
      if (gameState.currentPlayer === 2 && gameState.isPlaying) {
        computerTurn();
      }
    }, 1200);
  }
}

/**
 * End the game and show winner
 * @param {number} winner - The winning player (1 or 2)
 */
function endGame(winner) {
  gameState.isPlaying = false;
  
  // Disable controls
  elements.rollBtn.disabled = true;
  elements.holdBtn.disabled = true;
  
  // Update winner modal
  if (winner === 2 && gameState.mode === 'pvc') {
    elements.winnerText.textContent = '🤖 Computer Wins!';
  } else {
    elements.winnerText.textContent = `🎉 Player ${winner} Wins!`;
  }
  elements.finalScore.textContent = `Final Score: ${gameState.scores[winner - 1]}`;
  
  // Show modal
  setTimeout(() => {
    elements.winnerModal.classList.add('active');
  }, 500);
}

/**
 * Reset the game
 */
function resetGame() {
  // Hide modal if visible
  elements.winnerModal.classList.remove('active');
  
  // Reset game state
  gameState.isPlaying = true;
  initializeGame();
}

/**
 * Change game mode (go back to mode selection)
 */
function changeMode() {
  // Hide everything
  elements.winnerModal.classList.remove('active');
  elements.gameArea.classList.remove('active');
  elements.gameControls.classList.remove('active');
  
  // Show mode selection
  elements.modeSelection.style.display = 'block';
  
  // Reset state
  gameState.mode = null;
  gameState.isPlaying = false;
}

/**
 * Toggle rules visibility
 */
function toggleRules() {
  elements.rulesContent.classList.toggle('active');
}

/**
 * Show a temporary message
 * @param {string} message - The message to show
 */
function showMessage(message) {
  elements.turnText.textContent = message;
}

// =========================================
// KEYBOARD CONTROLS
// =========================================
document.addEventListener('keydown', (e) => {
  if (!gameState.isPlaying) return;
  
  // Don't allow keyboard controls during computer's turn
  if (gameState.mode === 'pvc' && gameState.currentPlayer === 2) return;
  
  switch (e.key.toLowerCase()) {
    case 'r':
    case ' ':
      e.preventDefault();
      if (!elements.rollBtn.disabled) rollDice();
      break;
    case 'h':
    case 'enter':
      e.preventDefault();
      if (!elements.holdBtn.disabled) holdScore();
      break;
    case 'n':
      resetGame();
      break;
    case 'escape':
      changeMode();
      break;
  }
});

// =========================================
// INITIALIZATION
// =========================================
console.log('🎲 Dice Game loaded! Press R to roll, H to hold.');
