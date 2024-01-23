let data; // Variable to store loaded data
let selectedTerms = []; // Array to store selected terms

// Fetch data from the JSON file
fetch('ansi_terms.json')
  .then(response => response.json())
  .then(jsonData => {
    data = jsonData; // Store data globally
    populateBrowsePage();
  })
  .catch(error => console.error('Error loading data:', error));

function populateSearchResults(query) {
  const searchResults = document.getElementById('searchResults');
  searchResults.innerHTML = ''; // Clear previous results

  for (const key in data.suffixes) {
    if (key.includes(query) || data.suffixes[key].toLowerCase().includes(query.toLowerCase())) {
      createListItem(searchResults, key, data.suffixes[key], 'Suffix');
    }
  }

  for (const key in data.common_acronyms) {
    if (key.includes(query) || data.common_acronyms[key].toLowerCase().includes(query.toLowerCase())) {
      createListItem(searchResults, key, data.common_acronyms[key], 'Acronym');
    }
  }

  for (const key in data.device_numbers) {
    if (key.includes(query) || data.device_numbers[key].toLowerCase().includes(query.toLowerCase())) {
      createListItem(searchResults, key, data.device_numbers[key], 'Device Number');
    }
  }
  updateSelectionStyle();
}

function populateBrowsePage() {
  const browseList = document.getElementById('browseList');
  const browseAcronyms = document.getElementById('browseAcronyms');
  const browseDeviceNumbers = document.getElementById('browseDeviceNumbers');

  browseList.innerHTML = ''; // Clear previous lists
  browseAcronyms.innerHTML = '';
  browseDeviceNumbers.innerHTML = '';

  for (const key in data.suffixes) {
    createListItem(browseList, key, data.suffixes[key], 'Suffix');
  }

  for (const key in data.common_acronyms) {
    createListItem(browseAcronyms, key, data.common_acronyms[key], 'Acronym');
  }

  for (const key in data.device_numbers) {
    createListItem(browseDeviceNumbers, key, data.device_numbers[key], 'Device Number');
  }

  // Add click event to each list item for multi-select and copy functionality
  const allLists = [browseList, browseAcronyms, browseDeviceNumbers, searchResults];
  for (const list of allLists) {
    list.addEventListener('click', function (event) {
      if (event.target.tagName === 'LI') {
        const term = event.target.textContent;
        toggleSelection(term);
        updateSelectionStyle();
      }
    });
  }
}

function createListItem(parent, key, value, category) {
  const listItem = document.createElement('li');
  listItem.innerHTML = `<span class="termKey">${key}</span>: ${value} (${category})`;
  listItem.setAttribute('data-category', category);
  parent.appendChild(listItem);
}

function toggleSelection(term) {
  const index = selectedTerms.indexOf(term);
  if (index === -1) {
    selectedTerms.push(term);
  } else {
    selectedTerms.splice(index, 1);
  }
}

function updateSelectionStyle() {
  const allLists = [document.getElementById('browseList'), document.getElementById('browseAcronyms'), document.getElementById('browseDeviceNumbers'), document.getElementById('searchResults'),];

  for (const list of allLists) {
    const listItems = list.getElementsByTagName('li');

    for (const listItem of listItems) {
      const term = listItem.textContent;
      listItem.classList.toggle('selected', selectedTerms.includes(term));
    }
  }
}

function copySelectedTerms() {
  if (selectedTerms.length > 0) {
    const textToCopy = selectedTerms.join('\n');
    copyToClipboard(textToCopy);
    alert('Text copied to clipboard:\n' + textToCopy);
  } else {
    alert('No terms selected.');
  }
}

function copyToClipboard(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand('copy');
  document.body.removeChild(textArea);
}

// Event listener for search input
const searchInputPage = document.getElementById('searchInputPage');
searchInputPage.addEventListener('input', function () {
  const query = this.value.trim();
  populateSearchResults(query);
});

// Event listener for search button
const searchButton = document.getElementById('searchButton');
searchButton.addEventListener('click', function () {
  const searchPage = document.getElementById('searchPage');
  const browsePage = document.getElementById('browsePage');

  searchPage.style.display = 'block';
  browsePage.style.display = 'none';
  selectedTerms = []; // Reset selected terms when switching to the search page
  updateSelectionStyle();
});

// Event listener for browse button
const browseButton = document.getElementById('browseButton');
browseButton.addEventListener('click', function () {
  const searchPage = document.getElementById('searchPage');
  const browsePage = document.getElementById('browsePage');

  searchPage.style.display = 'none';
  browsePage.style.display = 'block';
});

// Show copy button only when terms are selected
const copyButton = document.getElementById('copyButton');
copyButton.addEventListener('click', copySelectedTerms);

// Event listener for copy button visibility
document.addEventListener('click', function () {
  copyButton.style.display = selectedTerms.length > 0 ? 'block' : 'none';
});