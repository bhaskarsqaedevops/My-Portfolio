// 1. Select the button
const toggleButton = document.getElementById('theme-toggle');

// 2. Select the body
const body = document.body;

// 3. Add the event listener
toggleButton.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
});

/* --- TIC TAC TOE LOGIC --- */

// 1. Select Elements
const cells = document.querySelectorAll('.cell');
const statusText = document.querySelector('#status');
const restartBtn = document.querySelector('#restart');

// 2. Game Variables
let options = ["", "", "", "", "", "", "", "", ""]; // Stores X or O for each cell
const winConditions = [
    [0, 1, 2], // Top Row
    [3, 4, 5], // Middle Row
    [6, 7, 8], // Bottom Row
    [0, 3, 6], // Left Column
    [1, 4, 7], // Middle Column
    [2, 5, 8], // Right Column
    [0, 4, 8], // Diagonal Top-Left -> Bottom-Right
    [2, 4, 6]  // Diagonal Top-Right -> Bottom-Left
];
let currentPlayer = "X";
let running = false;

// 3. Initialize Game
initializeGame();

function initializeGame() {
  cells.forEach(cell => cell.addEventListener("click", cellClicked));
  restartBtn.addEventListener("click", restartGame);
  statusText.textContent = `${currentPlayer}'s turn`;
  running = true;
};

// 4. Handle Clicks
function cellClicked() {
  const cellIndex = this.getAttribute("data-index");

  // If cell is taken or game is over, do nothing
  if (options[cellIndex] != "" || !running) {
    return;
  };

  updateCell(this, cellIndex);

  checkWinner();
};

function updateCell(cell, index) {
  options[index] = currentPlayer;
  cell.textContent = currentPlayer; // Updates the UI
};

function changePlayer() {
  currentPlayer = (currentPlayer == "X") ? "O" : "X";
  statusText.textContent = `${currentPlayer}'s turn`;
};

function restartGame() {
  currentPlayer = "X";
  options = ["", "", "", "", "", "", "", "", ""];
  statusText.textContent = `${currentPlayer}'s turn`;
  cells.forEach(cell => cell.textContent = "");
  running = true;
};

function checkWinner() {
  let roundWon = false;

  for (let i = 0; i < winConditions.length; i++) {
    const condition = winConditions[i];
    const cellA = options[condition[0]];
    const cellB = options[condition[1]];
    const cellC = options[condition[2]];

    if (cellA == "" || cellB == "" || cellC == "") {
      continue; // Skip empty cells
    }
    if (cellA == cellB && cellB == cellC) {
      roundWon = true;
      break;
    }
  }

  if (roundWon) {
    statusText.textContent = `${currentPlayer} Wins!`;
    running = false;
  } else if (!options.includes("")) {
    statusText.textContent = `Draw!`;
    running = false;
  } else {
    changePlayer();
  }
};

/* --- FETCH PROJECTS FROM API --- */

async function fetchProjects() {
  try {
    //  1. Ask the server for data
    const response = await fetch('http://localhost:3000/api/projects');
    // 2. Convert the response to JSON
    const data = await response.json();

    // Find the container where projects should go
    const projectContainer = document.querySelector('.project-grid');

    // Clear any existing content (optional, but good practice)
    projectContainer.innerHTML = '';

    // Loop through the data and create HTML for each project
    data.forEach(project => {
      // Create the card div
      const card = document.createElement('div');
      card.classList.add('card');

      // Set the inner HTML of the card
      card.innerHTML = `
        <h3>${project.name}</h3>
        <p>Tech Stack: ${project.tech}</p>
      `;

      // Add the card to the container
      projectContainer.appendChild(card);
    });

  } catch (error) {
    console.log("Error fetching projects:", error);
  }
};

// Call the function to test it
fetchProjects();


const projectForm = document.getElementById('project-form');

projectForm.addEventListener('submit', async (e) => {
  e.preventDefault(); // STOP the page from refreshing!

  // 1. Get the values from the input fields
  const name = document.getElementById('project-name').value;
  const tech = document.getElementById('project-tech').value;

  // 2. Create the data object
  const newProject = { name, tech };

  try {
    // 3. Send the POST request
    const response = await fetch('/api/projects', {
      method: 'POST', // Tell the server we are ADDING data
      headers: {
        'Content-Type': 'application/json' // Label the package so server knows it's JSON
      },
      body: JSON.stringify(newProject) // Convert JS object to text for sending 
    });

    // 4. Handle success
    if (response.ok) {
      alert('Project Added!');
      projectForm.reset(); // Clear the form inputs
      fetchProjects(); // Refresh the list so the new project shows up immediaely
    } else {
      alert('Failed to add project');
    }
  } catch (error) {
    console.error('Error:', error);
  }
});

