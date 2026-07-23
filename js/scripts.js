let employees = [];
const galleryDiv = document.querySelector("#gallery");
const searchDiv = document.querySelector(".search-container");

const randomUsersUrl =
  "https://randomuser.me/api/?results=12&inc=name,picture,email,location,phone,dob&noinfo&nat=gb";

// INITIALIZATION
fetchEmployeesData();

console.log(randomUsersUrl);
async function fetchData(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Error fetching data - Status: ${response.status}`);
  }

  const data = await response.json();
  if (data.error) {
    throw new Error(data.error);
  }

  console.log(data);
  return data;
}

async function fetchEmployeesData() {
  try {
    const data = await fetchData(randomUsersUrl);
    employees = data.results;
    console.log(employees);
    console.log("Above is now the value in - let employees = [];");
    createEmployeeCards(employees);
    createSearchUI(employees);
  } catch (error) {
    console.error(error);
  }
}

setTimeout(() => {
  console.log(employees);
}, 5000);

//!SECTION - HELPER FUNCTIONS

/**
 * Creates and displays an employee card for each employee returned by the API.
 *
 * @param {Object[]} employees - An array of employee objects from the Random User API.
 */
function createEmployeeCards(employees) {
  employees.forEach((employee, index) => {
    const {
      name: { first, last },
      email,
      phone,
      picture: { large },
      location: { city, state },
    } = employee;

    const employeeHTML = `
     <div class="card-container" data-index="${index}">
        <div class="card">

          <div class="card-img-container">
          <img class="card-img" src="${large}" alt="${first} ${last}">
          </div>

          <div class="card-info-container">
          <h3 id="name" class="card-name cap">${first} ${last}</h3>
          <p class="card-text">${email}</p>
          <p class="card-text cap">${city}, ${state}</p>
          </div>

        </div>
     </div>
      `;

    galleryDiv.insertAdjacentHTML("beforeend", employeeHTML);
  });
}

/**
 * Creates and displays the employee search interface.
 * Generates the search input, clear button, label and datalist,
 * then populates the datalist with each employee's full name.
 *
 * @param {Object[]} employees - Array of employee objects returned from the Random User API.
 */
function createSearchUI(employees) {
  const searchInput = `
   <input autocomplete="off" type="text" name="search" id="search-input" list="">
                <button id="search-close" title="Clear Search Field & Reset Employees">X</button>
                <label for="search-input">Search Employees</label>`;

  searchDiv.insertAdjacentHTML("afterbegin", searchInput);

  const dataList = `<datalist id="data-names"></datalist>`;
  searchDiv.insertAdjacentHTML("beforeend", dataList);

  const dataListElement = document.querySelector("#data-names");

  employees.forEach((employee) => {
    const {
      name: { first, last },
    } = employee;
    const option = document.createElement("option");
    option.value = `${first} ${last}`;
    option.textContent = `${first} ${last}`;
    dataListElement.appendChild(option);
  });
}

/**
 * Creates and displays the reusable overlay.
 * Inserts the overlay into the end of the document body
 * and returns the newly created overlay element.
 *
 * @returns {HTMLElement} The overlay element.
 */
const createOverlay = () => {
  const overlayHTML = `
  <div id="overlay">
    <div id="overlay-inner-container">
    </div>
  </div>
  `;

  document.body.insertAdjacentHTML("beforeend", overlayHTML);
  const overlay = document.querySelector("#overlay");
  return overlay;
};

/**
 * Creates and displays the employee modal for the selected employee.
 * Retrieves the selected employee's data, formats their birthday,
 * inserts the modal into the overlay, and returns the modal element.
 *
 * @param {number} index - The index of the selected employee in the employees array.
 * @returns {HTMLElement} The modal element.
 */
const createModal = (index) => {
  console.log(employees);
  console.log(index);
  console.log(employees[index]);
  const employee = employees[index];
  const innerOverlay = document.querySelector("#overlay-inner-container");

  const {
    name: { first, last },
    email,
    phone,
    picture: { large },
    location: {
      city,
      street: { number, name: streetName },
      state,
      postcode,
    },
    dob: { date },
  } = employee;

  const birthday = new Date(date).toLocaleDateString("en-GB");

  const modalHTML = `
  <div id="modal">
    <button type="button" id="modal-close-btn" class="modal-close-btn">
      <strong>X</strong>
    </button>

    <div class="modal-info-container">
      <div class="modal-img-container">
        <img class="modal-img" src="${large}" alt="${first} ${last}">
      </div>

      <h3 id="name" class="modal-name cap">${first} ${last}</h3>

      <p class="modal-text">${email}</p>

      <p class="modal-text cap">${city}</p>

      <hr>

      <p class="modal-text">${phone}</p>

      <p class="modal-text">
        ${number} ${streetName}<br> ${state}<br> ${postcode}
      </p>

      <p class="modal-text">
        Birthday: ${birthday}
      </p>
    </div>
  </div>
  `;

  innerOverlay.insertAdjacentHTML("beforeend", modalHTML);

  const modal = document.querySelector("#modal");
  return modal;
};

/**
 * Creates and displays the modal navigation controls.
 * Inserts the Previous and Next buttons into the overlay
 * and returns the navigation container element.
 *
 * @returns {HTMLElement} The modal navigation container element.
 */
const createModalNav = () => {
  const innerOverlay = document.querySelector("#overlay-inner-container");

  const modalNavHTML = `
  <div class="modal-btn-container">
    <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
    <button type="button" id="modal-next" class="modal-next btn">Next</button>
  </div>
  `;

  innerOverlay.insertAdjacentHTML("beforeend", modalNavHTML);

  const modalNavContainer = document.querySelector(".modal-btn-container");

  return modalNavContainer;
};

/**
 * Displays the selected employee in a modal window.
 * Creates the overlay, employee modal, and navigation controls
 * for the selected employee.
 *
 * @param {number} index - The index of the selected employee.
 */
const displayEmployeeModal = (index) => {
  createOverlay();
  createModal(index);
  createModalNav();
};

setTimeout(() => {
  displayEmployeeModal(6);
}, 5000);
