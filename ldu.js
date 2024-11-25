// Function to dynamically generate the input fields for the matrix
function generateMatrixInputs() {
  const size = parseInt(document.getElementById("matrixSize").value);
  const matrixInputs = document.getElementById("matrixInputs");
  const calculateButtonDiv = document.getElementById("calculateButton");

  // Clear previous content
  matrixInputs.innerHTML = "";
  calculateButtonDiv.innerHTML = "";

  if (!size || size < 2) {
      alert("Please enter a valid matrix size (n >= 2).");
      return;
  }

  // Create the input fields for the matrix
  const table = document.createElement("table");
  for (let i = 0; i < size; i++) {
      const row = document.createElement("tr");
      for (let j = 0; j < size; j++) {
          const cell = document.createElement("td");
          const input = document.createElement("input");
          input.type = "text";
          input.className = "matrix-input";
          input.id = `matrix-${i}-${j}`;
          cell.appendChild(input);
          row.appendChild(cell);
      }
      table.appendChild(row);
  }
  matrixInputs.appendChild(table);

  // Add the "Calculate LDU" button
  const calculateButton = document.createElement("button");
  calculateButton.type = "button";
  calculateButton.textContent = "Calculate LDU";
  calculateButton.id = "calculateMatrixButton";
  calculateButton.onclick = calculateLDU;
  calculateButtonDiv.appendChild(calculateButton);
}

// Function to extract matrix values from the input fields
function getMatrixFromInputs(size) {
  const matrix = [];
  for (let i = 0; i < size; i++) {
      const row = [];
      for (let j = 0; j < size; j++) {
          const value = parseFloat(document.getElementById(`matrix-${i}-${j}`).value) || 0;
          row.push(value);
      }
      matrix.push(row);
  }
  return matrix;
}

// Function to perform LDU factorization
function lduFactorization(matrix) {
  const n = matrix.length;

  // Initialize L, D, and U matrices
  const L = Array.from({ length: n }, () => Array(n).fill(0));
  const D = Array.from({ length: n }, () => Array(n).fill(0));
  const U = matrix.map(row => [...row]); // Clone the matrix to U

  for (let i = 0; i < n; i++) {
      L[i][i] = 1; // Set diagonal of L to 1
      D[i][i] = U[i][i]; // Diagonal of D

      // Normalize row i of U
      for (let j = i; j < n; j++) {
          U[i][j] /= D[i][i];
      }

      // Update rows below the current row
      for (let k = i + 1; k < n; k++) {
          L[k][i] = U[k][i];

          for (let j = i; j < n; j++) {
              U[k][j] -= L[k][i] * U[i][j];
          }
      }
  }

  return { L, D, U };
}

// Function to display matrices
function displayMatrix(matrix, name) {
  let html = `<h3>${name}:</h3><table border="1" style="border-collapse: collapse;">`;
  matrix.forEach(row => {
      html += "<tr>";
      row.forEach(value => {
          html += `<td style="padding: 5px 10px;">${value.toFixed(2)}</td>`;
      });
      html += "</tr>";
  });
  html += "</table>";
  return html;
}

// Main function to calculate and display LDU factorization
function calculateLDU() {
  const size = parseInt(document.getElementById("matrixSize").value);
  if (!size || size < 2) {
      alert("Please generate and fill the matrix first!");
      return;
  }

  const matrix = getMatrixFromInputs(size);
  const { L, D, U } = lduFactorization(matrix);

  // Display results
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = `
      ${displayMatrix(matrix, "Original Matrix")}
      ${displayMatrix(L, "L Matrix")}
      ${displayMatrix(D, "D Matrix")}
      ${displayMatrix(U, "U Matrix")}
  `;
}
