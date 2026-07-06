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
    createEmployeeCards(data.results);
    createSearchUI(data.results);
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
    const firstName = employee.name.first;
    const lastName = employee.name.last;
    const employeeImage = employee.picture.large;
    const email = employee.email;
    const city = employee.location.city;
    const state = employee.location.state;

    const employeeHTML = `
     <div class="card-container" data-index="${index}">
        <div class="card">

          <div class="card-img-container">
          <img class="card-img" src="${employeeImage}" alt="${firstName} ${lastName}">
          </div>

          <div class="card-info-container">
          <h3 id="name" class="card-name cap">${firstName} ${lastName}</h3>
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
    const firstName = employee.name.first;
    const lastName = employee.name.last;
    const option = document.createElement("option");
    option.value = `${firstName} ${lastName}`;
    option.textContent = `${firstName} ${lastName}`;
    dataListElement.appendChild(option);
  });
}
