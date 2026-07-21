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
    console.log(data.results);
    employees = data.results;
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
