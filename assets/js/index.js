let timeDisplayEl = $('#time-display');
let projectDisplayEl = $('#project-display');
let projectFormEl = $('#project-form');
let projectNameInputEl = $('#project-name-input');
let projectTypeInputEl = $('#project-type-input');
let projectDateInputEl = $('#project-date-input');

// handle displayTime()
function displayTime() {
  let rightNow = dayjs().format('MMM DD, YYYY [at] hh:mm:ss a');
  timeDisplayEl.text(rightNow);
}

// Reads projects from local storage and returns array of project objects.
// Returns an empty array ([]) if there aren't any projects.
let readProjectsFromStorage = () => {
  let projects = localStorage.getItem('projects');
  if (projects) {
    projects = JSON.parse(projects);
  } else {
    projects = [];
  }

  return projects;
};

// let's take array of projects and store them in localStorage
function saveProjectsToStorage(projects) {
  localStorage.setItem('projects', JSON.stringify(projects));
}
// let's get data from local storage and display them
function printProjectData() {
  // let's empty the current projects
  projectDisplayEl.empty();
  let projects = readProjectsFromStorage();

  // let's loop through the project object and create a new row
  for (let i = 0; i < projects.length; i++) {
    let project = projects[i];
    let projectDate = dayjs(project.date);
    // let's get the current date
    let today = dayjs().startOf('day');

    // let's create rows and columns for the projects
    let rowEl = $('<tr>');
    let nameEl = $('<td>').text(project.name);
    let typeEl = $('<td>').text(project.type);
    let dateEl = $('<td>').text(projectDate.format('MMM/DD/YYYY'));
    // Save the index of the project as a data-* attribute on the button. This
    // will be used when removing the project from the array.
    let deleteEl = $('<td><button class="btn btn-sm btn-delete-project" data-index="' + i + '">X</button></td>');

    // add class to row by comparing project date to today's date
    if (projectDate.isBefore(today)) {
      rowEl.addClass('project-late');
    } else if (projectDate.isSame(today)) {
      rowEl.addClass('project-today');
    }
    rowEl.append(nameEl, typeEl, dateEl, deleteEl);
    projectDisplayEl.append(rowEl);
  }
}

// let's handle form submission to make sure that we are getting the expected data

// will take event
// will check input value
// will add project to storage
// will print project data
// lastly will clear input from data

function handleFormProjectSubmit() {
  //first let's read the user input
  let projectName = projectNameInputEl.val().trim();
  let projectType = projectTypeInputEl.val();
  let projectDate = projectDateInputEl.val();

  // let's create a new project object
  let newProject = {
    name: projectName,
    type: projectType,
    date: projectDate,
  };

  // let's push our projects to local storage
  let projects = readProjectsFromStorage();
  projects.push(newProject);
  saveProjectsToStorage(projects);

  // let's print project data
  printProjectData();

  // reset input value
  projectNameInputEl.val('');
  projectTypeInputEl.val('');
  projectDateInputEl.val('');
}
projectFormEl.on('submit', handleFormProjectSubmit);

// let's add the functionality to delete a specific project

function handleDeleteProject() {
  let projectIndex = parseInt($(this).attr('data-index'));

  let projects = readProjectsFromStorage();

  // let's remove project from the array
  projects.splice(projectIndex, 1);
  saveProjectsToStorage(projects);
  printProjectData();
}
// Use jQuery event delegation to listen for clicks on dynamically added delete
// buttons.
projectDisplayEl.on('click', '.btn-delete-project', handleDeleteProject);

displayTime();
setInterval(displayTime, 1000);

printProjectData();
