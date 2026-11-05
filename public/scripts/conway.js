document.addEventListener('DOMContentLoaded', () => {
  // Get the canvas and context
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  
  // Game configuration
  const cellSize = 15;
  const rows = Math.floor(canvas.height / cellSize);
  const cols = Math.floor(canvas.width / cellSize);
  let grid = createEmptyGrid();
  let running = false;
  let animationId = null;
  let generation = 0;
  
  // Set page title with generation counter
  function updateTitle() {
    document.title = `Contact (Gen: ${generation})`;
  }
  
  // Create an empty grid
  function createEmptyGrid() {
    return Array(rows).fill().map(() => Array(cols).fill(false));
  }
  
  // Draw the grid
  function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw cells
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (grid[i][j]) {
          ctx.fillStyle = '#F9B9C3';
          ctx.fillRect(j * cellSize, i * cellSize, cellSize - 1, cellSize - 1);
        }
      }
    }
    
    // Draw grid lines
    ctx.strokeStyle = '#E0E0E0';
    ctx.lineWidth = 0.5;
    
    // Vertical lines
    for (let i = 0; i <= cols; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
    }
    
    // Horizontal lines
    for (let i = 0; i <= rows; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }
  }
  
  // Count neighbors for a cell
  function countNeighbors(grid, x, y) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;
        
        const row = (x + i + rows) % rows;
        const col = (y + j + cols) % cols;
        
        if (grid[row][col]) {
          count++;
        }
      }
    }
    return count;
  }
  
  // Compute the next generation
  function nextGeneration() {
    const newGrid = createEmptyGrid();
    
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const neighbors = countNeighbors(grid, i, j);
        
        // Apply Conway's rules
        if (grid[i][j]) {
          // Live cell
          if (neighbors < 2 || neighbors > 3) {
            newGrid[i][j] = false; // Dies
          } else {
            newGrid[i][j] = true; // Survives
          }
        } else {
          // Dead cell
          if (neighbors === 3) {
            newGrid[i][j] = true; // Becomes alive
          }
        }
      }
    }
    
    grid = newGrid;
    generation++;
    updateTitle();
  }
  
  // Game loop
  function gameLoop() {
    nextGeneration();
    drawGrid();
    
    if (running) {
      animationId = setTimeout(gameLoop, 100);
    }
  }
  
  // Event listener for clicks on the canvas
  canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) * canvas.width / rect.width;
    const y = (event.clientY - rect.top) * canvas.height / rect.height;
    
    const i = Math.floor(y / cellSize);
    const j = Math.floor(x / cellSize);
    
    if (i >= 0 && i < rows && j >= 0 && j < cols) {
      grid[i][j] = !grid[i][j];
      drawGrid();
    }
  });
  
  // Button event listeners
  document.getElementById('startBtn').addEventListener('click', () => {
    if (!running) {
      running = true;
      gameLoop();
    }
  });
  
  document.getElementById('stopBtn').addEventListener('click', () => {
    running = false;
    if (animationId) {
      clearTimeout(animationId);
    }
  });
  
  document.getElementById('clearBtn').addEventListener('click', () => {
    running = false;
    if (animationId) {
      clearTimeout(animationId);
    }
    grid = createEmptyGrid();
    generation = 0;
    updateTitle();
    drawGrid();
  });
  
  document.getElementById('randomBtn').addEventListener('click', () => {
    grid = createEmptyGrid();
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        grid[i][j] = Math.random() > 0.7;
      }
    }
    generation = 0;
    updateTitle();
    drawGrid();
  });
  
  document.getElementById('gliderBtn').addEventListener('click', () => {
    grid = createEmptyGrid();
    
    // Create a glider at position 10,10
    const startRow = 10;
    const startCol = 10;
    
    grid[startRow][startCol+1] = true;
    grid[startRow+1][startCol+2] = true;
    grid[startRow+2][startCol] = true;
    grid[startRow+2][startCol+1] = true;
    grid[startRow+2][startCol+2] = true;
    
    generation = 0;
    updateTitle();
    drawGrid();
  });
  
  document.getElementById('gosperBtn').addEventListener('click', () => {
    grid = createEmptyGrid();
    
    // Create Gosper Glider Gun pattern
    const gunRow = 10;
    const gunCol = 10;
    
    // Left block
    grid[gunRow+4][gunCol+0] = true;
    grid[gunRow+4][gunCol+1] = true;
    grid[gunRow+5][gunCol+0] = true;
    grid[gunRow+5][gunCol+1] = true;
    
    // Right block
    grid[gunRow+2][gunCol+34] = true;
    grid[gunRow+2][gunCol+35] = true;
    grid[gunRow+3][gunCol+34] = true;
    grid[gunRow+3][gunCol+35] = true;
    
    // Left ship
    grid[gunRow+2][gunCol+10] = true;
    grid[gunRow+3][gunCol+10] = true;
    grid[gunRow+4][gunCol+10] = true;
    grid[gunRow+1][gunCol+11] = true;
    grid[gunRow+5][gunCol+11] = true;
    grid[gunRow+0][gunCol+12] = true;
    grid[gunRow+6][gunCol+12] = true;
    grid[gunRow+0][gunCol+13] = true;
    grid[gunRow+6][gunCol+13] = true;
    grid[gunRow+3][gunCol+14] = true;
    grid[gunRow+1][gunCol+15] = true;
    grid[gunRow+5][gunCol+15] = true;
    grid[gunRow+2][gunCol+16] = true;
    grid[gunRow+3][gunCol+16] = true;
    grid[gunRow+4][gunCol+16] = true;
    grid[gunRow+3][gunCol+17] = true;
    
    // Right ship
    grid[gunRow+0][gunCol+20] = true;
    grid[gunRow+1][gunCol+20] = true;
    grid[gunRow+2][gunCol+20] = true;
    grid[gunRow+0][gunCol+21] = true;
    grid[gunRow+1][gunCol+21] = true;
    grid[gunRow+2][gunCol+21] = true;
    grid[gunRow-1][gunCol+22] = true;
    grid[gunRow+3][gunCol+22] = true;
    grid[gunRow-2][gunCol+24] = true;
    grid[gunRow-1][gunCol+24] = true;
    grid[gunRow+3][gunCol+24] = true;
    grid[gunRow+4][gunCol+24] = true;
    
    generation = 0;
    updateTitle();
    drawGrid();
  });
  
  // Initial draw
  drawGrid();
  updateTitle();
});