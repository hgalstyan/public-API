let employees = [];
let selectedIndex = 0;
const employeeSearch = document.querySelector('.employee__search');
const modalOverlay = document.querySelector('.modal__overlay');

/////////////////
/// FUNCTIONS ///
/////////////////

/**
 * Creates an element.
 * @param {object} parentElement
 * @param {string} tagName
 * @param {string} className
 * @param {string} innerHTML
 * @returns the created element
 */
const createChildElement = (parentElement, tagName, className, innerHTML) => {
    const createdElement = document.createElement(tagName);
    parentElement.appendChild(createdElement);
    if (className) {
        createdElement.className = className;
    }
    if (innerHTML) {
        createdElement.innerHTML = innerHTML;
    }
    return createdElement;
};

/**
 * Capitalizes the first letter in a string.  Handles spaced strings.
 * @param {string} name
 * @returns a capitalized string
 */
const formatName = function(name) {
    const splitName = name.split(' ');
    let result = [];
    for (let i = 0; i < splitName.length; i++) {
        const word = splitName[i];
        result.push(word[0].toUpperCase() + word.slice(1));
    }
    return result.join(' ');
};

const displayModalForUser = function(member) {
    selectedIndex = employees.indexOf(member);

    const employeeFullName = `${formatName(member.name.first)} ${formatName(member.name.last)}`;
    const employeeAddress = `${formatName(member.location.street)} ${formatName(member.location.city)}, ${formatName(member.location.state)} ${member.location.postcode}`;

    modalOverlay.style = 'display: inline-block';

    let modalContent =
    `<div class="modal__container">
        <div>
            <span class="modal--close">&times;</span>
            <ul class="modal__list">
                <img src="${member.picture.large}" id="modal--image">
                <li id="modal__name">${employeeFullName}</li>
                <li>${member.email}</li>
                <li>${formatName(member.location.city)}</li>
            </ul>
        </div>
        <div>
            <ul class="modal__list2">
                <li>${member.cell}</li>
                <li>${employeeAddress}</li>
                <li>Birthday: ${new Date(member.dob).toLocaleDateString('en-US')}</li>
            </ul>
            <img class="arrowLeft" src="images/arrow-left.png">
            <img class="arrowRight" src="images/arrow-right.png">
        </div>
    </div>`;

    modalOverlay.innerHTML = modalContent;

    //Event listener for closing modal
    const modalClose = document.querySelector('.modal--close');
    modalClose.addEventListener('click', () => {
        modalOverlay.style = 'display: none';
        $('.modal__container').remove();
    });
};

// Event listener for arrow clicks
modalOverlay.addEventListener('click', (e) => {

    if (e.target.className === 'arrowLeft') {
        if (selectedIndex === 0) {
            return displayModalForUser(employees[employees.length - 1]);
        }

        return displayModalForUser(employees[selectedIndex - 1]);
    }
    if (e.target.className === 'arrowRight') {
        if (selectedIndex === employees.length - 1) {
            return displayModalForUser(employees[0]);
        }

        return displayModalForUser(employees[selectedIndex + 1]);
    }
});

/////////////////
//AJAX REQUEST///
/////////////////
$.ajax({
    url: 'https://randomuser.me/api/?results=12&nat=us&inc=name,picture,email,location,cell,dob',
    dataType: 'json',
    success: function(response) {
        employees = response.results;

        //MAIN EMPLOYEE DIRECTORY
        for (let i = 0; i < employees.length; i++) {
            const employeeFirstName = formatName(employees[i].name.first);
            const employeeLastName = formatName(employees[i].name.last);
            const employeeFullName = `${employeeFirstName} ${employeeLastName}`;

            const mainContainer = document.querySelector('.main-container');
            const memberContainer = createChildElement(mainContainer, 'div', 'grid__item');
            memberContainer.onclick = () => displayModalForUser(employees[i]);

            //Container for each member
            let memberContent =
                `<div class="member__img">
                    <img src="${employees[i].picture.medium}">
                </div>
                <div class="member__info">
                    <ul class="member__item">
                        <li id="name">${employeeFullName}</li>
                        <li id="email">${employees[i].email}</li>
                        <li id="city">${formatName(employees[i].location.city)}</li>
                    </ul>
                </div>`;
            memberContainer.innerHTML = memberContent;

            //Event listener for employee search
            employeeSearch.addEventListener('keyup', () => {
                if (employeeFullName.toUpperCase().includes(employeeSearch.value.toUpperCase())) {
                    memberContainer.style = 'display: ""';
                }
                else {
                    memberContainer.style = 'display: none';
                }
            });
        }
    }
});