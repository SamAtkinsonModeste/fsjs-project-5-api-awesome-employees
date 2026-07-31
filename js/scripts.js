let employees = [];
let activeEmployee;
const galleryDiv = document.querySelector("#gallery");
const searchDiv = document.querySelector(".search-container");

const randomUsersUrl =
  "https://randomuser.me/api/?results=12&inc=name,picture,email,location,phone,dob&noinfo&nat=gb";

// INITIALIZATION
fetchEmployeesData();

async function fetchData(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Error fetching data - Status: ${response.status}`);
  }

  const data = await response.json();
  if (data.error) {
    throw new Error(data.error);
  }

  return data;
}

async function fetchEmployeesData() {
  try {
    const data = await fetchData(randomUsersUrl);
    employees = data.results;
    createEmployeeCards(employees);
    createSearchUI(employees);
  } catch (error) {
    console.error(error);
  }
}

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

  const searchValue = document.querySelector("#search-input");
  searchValue.addEventListener("focus", optionClickEvents);
  searchValue.addEventListener("input", updateFilterEmployees);

  const searchCloseBtn = document.querySelector("#search-close");
  searchCloseBtn.addEventListener("click", resetUI);
}

//!SECTION - EVENT LISTENER HELPER FUNCTIONS

/**
 * Retrieves the current value from the search input and
 * formats it for case-insensitive searching.
 *
 * @returns {string} The trimmed, lowercase search value.
 */
const getSearchInputValue = () => {
  const input = document.querySelector("#search-input");
  const formattedSearchValue = input.value.trim().toLowerCase();
  return formattedSearchValue;
};

/**
 * Filters the displayed employee cards and search options
 * based on the current search input. Also updates the
 * search interface by showing or hiding the datalist and
 * adjusting the gallery layout when a single matching
 * employee remains.
 */
const updateFilterEmployees = () => {
  const inputValue = getSearchInputValue();
  const datalist = document.querySelector("#data-names");
  const currentOptions = datalist.querySelectorAll("option");
  const main = document.querySelector(".main");

  let optionCount = 0;

  if (inputValue === "") {
    datalist.classList.add("show");
  }

  currentOptions.forEach((currentOption, i) => {
    const currentOptionValue = currentOption.value.toLowerCase();
    const employeeCard = document.querySelector(`[data-index="${i}"]`);

    if (inputValue === "") {
      currentOption.classList.remove("optionFiltered");
      currentOption.classList.remove("hide");
      employeeCard.style.display = "block";
      main.classList.remove("gallery-filtered");
    } else if (currentOptionValue.includes(inputValue) && inputValue !== "") {
      currentOption.classList.add("optionFiltered");
      currentOption.classList.remove("hide");
      employeeCard.style.display = "block";

      optionCount++;
    } else {
      currentOption.classList.remove("optionFiltered");
      currentOption.classList.add("hide");
      employeeCard.style.display = "none";
    }
  });

  if (optionCount === 1) {
    main.classList.add("gallery-filtered");
    datalist.classList.remove("show");
    currentOptions.forEach((currentOption) => {
      currentOption.classList.remove("optionFiltered");
      currentOption.classList.remove("hide");
    });
  } else {
    main.classList.remove("gallery-filtered");
  }
};

/**
 * Attaches click event listeners to each search option.
 * When an option is selected, updates the search input,
 * applies the active input styling, hides the datalist,
 * and filters the employee cards.
 */
const optionClickEvents = () => {
  const input = document.querySelector("#search-input");
  const datalist = document.querySelector("#data-names");
  const datalistOptions = datalist.querySelectorAll("option");
  const inputLabel = document.querySelector('[for="search-input"]');

  datalist.classList.add("show");
  datalistOptions.forEach((datalistOption) => {
    datalistOption.addEventListener("click", () => {
      input.value = datalistOption.value;
      input.classList.add("lightText");
      inputLabel.classList.add("input-active");
      datalist.classList.remove("show");
      updateFilterEmployees();
    });
  });
};

/**
 * Resets the employee search interface back to its default state.
 * Clears the search input, restores the employee cards and search
 * options, removes any temporary UI styling, and returns the
 * gallery layout to its original appearance.
 */
const resetUI = () => {
  const input = document.querySelector("#search-input");
  const inputLabel = document.querySelector('[for="search-input"]');
  const datalist = document.querySelector("#data-names");
  const options = datalist.querySelectorAll("option");
  const main = document.querySelector(".main");
  const employeeContainers = document.querySelectorAll(".card-container");

  input.value = "";
  input.classList.remove("lightText");
  datalist.classList.remove("show");
  inputLabel.classList.remove("input-active");
  options.forEach((option) => {
    option.classList.remove("optionFiltered");
    option.classList.remove("hide");
  });

  main.classList.remove("gallery-filtered");

  employeeContainers.forEach((employeeContainer) => {
    employeeContainer.style.display = "block";
  });
};

//!SECTION - OVERLAY & MODAL FUNCTIONS

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

  innerOverlay.insertAdjacentHTML("afterbegin", modalHTML);

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
 * Displays the selected employee's modal interface.
 * Stores the selected employee's index, creates the overlay,
 * employee modal and navigation controls, sets the initial
 * navigation button visibility, then attaches the overlay
 * button click handler.
 *
 * @param {number|string} index - The selected employee's array index.
 */
const displayEmployeeModal = (index) => {
  activeEmployee = Number(index);
  resetUI();
  const overlay = createOverlay();
  createModal(activeEmployee);
  createModalNav();
  updateModalBtnsVisibility();
  overlay.addEventListener("click", handleOverlayBtnsClick);
};

/**
 * Updates the visibility of the modal navigation buttons.
 * Hides the Previous button when the first employee is displayed
 * and hides the Next button when the last employee is displayed.
 */
const updateModalBtnsVisibility = () => {
  const prevBtn = document.querySelector("#modal-prev");
  const nextBtn = document.querySelector("#modal-next");

  prevBtn.style.visibility = activeEmployee === 0 ? "hidden" : "visible";
  nextBtn.style.visibility =
    activeEmployee === employees.length - 1 ? "hidden" : "visible";
};

/**
 * Handles all button clicks inside the employee modal overlay.
 * Closes the overlay or navigates between employees by
 * recreating the modal content and updating the navigation buttons.
 *
 * @param {Event} evt - The click event object.
 */
const handleOverlayBtnsClick = (evt) => {
  const clickedBtn = evt.target.closest("button");

  if (!clickedBtn) return;

  const overlay = document.querySelector("#overlay");

  if (clickedBtn.id === "modal-close-btn") {
    overlay.remove();
  } else if (clickedBtn.id === "modal-prev" && activeEmployee > 0) {
    activeEmployee -= 1;
    document.querySelector("#modal").remove();
    createModal(activeEmployee);
    updateModalBtnsVisibility();
  } else if (
    clickedBtn.id === "modal-next" &&
    activeEmployee < employees.length - 1
  ) {
    activeEmployee += 1;
    document.querySelector("#modal").remove();
    createModal(activeEmployee);
    updateModalBtnsVisibility();
  }
};

//!SECTION - GALLERY DIV EVENT LISTENER

/**
 * Opens the employee modal when an employee card is clicked.
 * Uses event delegation to identify the selected employee and
 * passes its index to the modal display controller.
 */
galleryDiv.addEventListener("click", (evt) => {
  const employeeCard = evt.target.closest(".card-container");

  if (!employeeCard) return;

  const employeeIndex = employeeCard.getAttribute("data-index");
  displayEmployeeModal(employeeIndex);
});
