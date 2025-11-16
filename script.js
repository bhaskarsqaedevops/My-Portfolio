/* --- GLOBAL SELECTIONS --- */
const toggleButton = document.getElementById('theme-toggle');
const body = document.body;
const projectContainer = document.querySelector('.project-grid'); // Global container selection
const projectForm = document.getElementById('project-form');
const loginSection = document.getElementById('login-section');
const loginForm = document.getElementById('login-form');
const logoutBtn = document.getElementById('logout-btn');
const addProjectSection = document.getElementById('add-project');

/* --- FEATURE: DARK MODE --- */

// 1. Manual Toggle Listener
toggleButton.addEventListener('click', () => {
  body.classList.toggle('dark-mode');

  // Logic to swap the icon text
  if (body.classList.contains('dark-mode')) {
    toggleButton.textContent = '☀️';
  } else {
    toggleButton.textContent = '🌙';
  }
});

// 2. Automatic Time Check (Runs on load)
function checkTime() {
  const hour = new Date().getHours();
  // Check if it is after 6 PM (18) OR before 5 AM (5)
  if (hour > 18 || hour < 5) {
    document.body.classList.add('dark-mode');
    toggleButton.textContent = '☀️'; 
  }
}

/* --- FEATURE: TIC TAC TOE --- */

// 1. Select Elements
const cells = document.querySelectorAll('.cell');
const statusText = document.querySelector('#status');
const restartBtn = document.querySelector('#restart');

// 2. Game Variables
let options = ["", "", "", "", "", "", "", "", ""]; 
const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];
let currentPlayer = "X";
let running = false;

// 3. Game Logic Functions
function initializeGame() {
  cells.forEach(cell => cell.addEventListener("click", cellClicked));
  restartBtn.addEventListener("click", restartGame);
  statusText.textContent = `${currentPlayer}'s turn`;
  running = true;
};

function cellClicked() {
  const cellIndex = this.getAttribute("data-index");
  if (options[cellIndex] != "" || !running) {
    return;
  };
  updateCell(this, cellIndex);
  checkWinner();
};

function updateCell(cell, index) {
  options[index] = currentPlayer;
  cell.textContent = currentPlayer; 
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

    if (cellA == "" || cellB == "" || cellC == "") { continue; }
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

/* --- FEATURE: AUTHENTICATION --- */

// 1. Check if user is logged in on page load
function checkLoginStatus() {
  const token = localStorage.getItem('token');

  if (token) {
    // User is logged in
    loginSection.classList.add('hidden');
    addProjectSection.classList.remove('hidden');
    logoutBtn.style.display = 'block';
  } else {
    // User is NOT logged in
    loginSection.classList.remove('hidden');
    addProjectSection.classList.add('hidden');
    logoutBtn.style.display = 'none';
  }
}

// 2. Handle Login Submit
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.ok) {
      // SAVE THE TOKEN!
      localStorage.setItem('token', data.token);
      alert("Logged in successfully!");
      checkLoginStatus(); // Update UI
    } else {
      alert(data.error);
    }
  } catch (error) {
    console.error("Login Error:", error);
  }
});

// 3. Handle Logout
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('token'); // Destroy the token
  alert("Logged out!");
  checkLoginStatus(); // Update UI
});

// Run on load
checkLoginStatus();

/* --- FEATURE: PROJECT MANAGEMENT (CRUD) --- */

// 1. The Delete Listener (Event Delegation) - RUNS ONCE
projectContainer.addEventListener('click', async (e) => {
    // Check if the clicked element is our delete button
    if (e.target.classList.contains('delete-btn')) {
      
      // Grab the secret ID from the luggage tag
      const id = e.target.getAttribute('data-id');
      
      // Confirm with the user
      if(!confirm('Are you sure you want to delete this project?')) return;

      // Call the helper function
      deleteProject(id);
    }
});

// 2. The Helper Function to Delete
async function deleteProject(id) {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': localStorage.getItem('token')
        }
      });

      if (response.ok) {
        alert("Project Deleted!");
        fetchProjects(); // Refresh the list instantly
      } else {
        alert("Failed to delete");
      }
    } catch (error) {
      console.error("Error:", error);
    }
}

// 3. The Add Project Listener
projectForm.addEventListener('submit', async (e) => {
  e.preventDefault(); 

  const name = document.getElementById('project-name').value;
  const tech = document.getElementById('project-tech').value;
  const newProject = { name, tech };

  try {
    const response = await fetch('/api/projects', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token') // Dynamic token
       },
      body: JSON.stringify(newProject) 
    });

    if (response.ok) {
      alert('Project Added!');
      projectForm.reset(); 
      fetchProjects(); 
    } else {
      alert('Failed to add project');
    }
  } catch (error) {
    console.error('Error:', error);
  }
});

// 4. The Fetch Function 
async function fetchProjects() {
  try {
    const response = await fetch('/api/projects');
    const data = await response.json();

    // Clear any existing content
    projectContainer.innerHTML = '';

    // Loop through the data and create HTML for each project
    data.forEach(project => {
      const card = document.createElement('div');
      card.classList.add('card');

      // Create HTML with Delete Button
      card.innerHTML = `
          <div class="card-content">
            <h3>${project.name}</h3>
            <p>Tech Stack: ${project.tech}</p>
          </div>
          <button class="delete-btn" data-id="${project._id}">🗑️</button>
      `;

      projectContainer.appendChild(card);
    });

  } catch (error) {
    console.log("Error fetching projects:", error);
  }
};

/* --- INITIALIZATION --- */
checkTime();      // Set dark mode based on time
initializeGame(); // Start Tic Tac Toe
fetchProjects();  // Load projects from server