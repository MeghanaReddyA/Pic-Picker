const sideBarEl = document.getElementById('sideBar');
const sideBarListEl = document.getElementById('sideBarList');
const menuIconEl = document.getElementById('menuIcon');
const imagesContEl = document.getElementById('imagesCont');
let inputEl = document.getElementById('inputEl');
const searchIconEl = document.getElementById('searchIcon');
const resultStatusEl = document.getElementById('resultStatus');
const paginationContEl = document.getElementById('paginationCont'); 

let searchInput = '';
let currentPage = 1;
const perPage = 80;
const menuHeadingEl = document.getElementById('menuHeading');

//Main images fetching function
async function displayImages(searchInputValue = inputEl.value, page=currentPage) {
    const apiKey = 'jUs8KwRBAofYCsjl0iwazCmV8RLUIa2ZxesF1ZhueIWFADRn13wVuyzv';

    resultStatusEl.innerHTML = 'Searching<span class="dot">.</span><span class="dot">.</span><span class="dot">.</span>';
    resultStatusEl.classList.add('loading-dots');
    resultStatusEl.style.display = 'block';

    // Fetch images from Pexels API
    try {
        const response = await fetch(`https://api.pexels.com/v1/search?query=${searchInputValue}&per_page=${perPage}&page=${page}`, {
            method: 'GET',
            headers: {
                Authorization: apiKey
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        imagesContEl.innerHTML = '';

        const totalPages = Math.ceil(data.total_results / perPage);
        
        if (totalPages === 0) {
            resultStatusEl.innerHTML = 'Sorry!, No results found.';
            return;
        };
        function capitalize(word = '') {
            return word ? word.charAt(0).toUpperCase() + word.slice(1) : '';
        };
        data.photos.forEach(photo => {
            resultStatusEl.style.display = 'block';
            resultStatusEl.innerHTML = `Showing results for <span style="color:rgb(211, 23, 136)">"${capitalize(searchInputValue)}"</span>`;
            const aEl = document.createElement('a');
            aEl.href = photo.src.medium;
            aEl.target = '_blank'; 

            const imageEl = document.createElement('img');
            imageEl.src = photo.src.medium;
            imageEl.id = 'image';
            imageEl.alt = photo.alt || 'Image';
            aEl.appendChild(imageEl);

            imagesContEl.classList.add('col-6', 'col-sm-6', 'col-md-4', 'col-lg-3', 'col-xl-2');
            imagesContEl.appendChild(aEl);
        });

        // Pagination controls
        paginationContEl.innerHTML = '';
        paginationContEl.classList.add('d-flex', 'justify-content-around', 'align-items-center','pagination-cont');

        if (page>1){
            const prevPageBtn = document.createElement('button');
            prevPageBtn.textContent = 'Prev';
            prevPageBtn.classList.add('pagination-btn');
            prevPageBtn.onclick = ()=>{
                currentPage--;
                displayImages(searchInputValue, currentPage);
            }
            paginationContEl.appendChild(prevPageBtn);
        }
        const pageInfo = document.createElement('span');
        pageInfo.textContent = ` Page ${page} of ${totalPages}`;
        pageInfo.classList.add('page-info');

        paginationContEl.appendChild(pageInfo);
        if (page < totalPages) {
            const nextPageBtn = document.createElement('button');
            nextPageBtn.textContent = 'Next';
            nextPageBtn.classList.add('pagination-btn');
            nextPageBtn.onclick = ()=>{
                currentPage++;
                displayImages(searchInputValue, currentPage);
            }
            paginationContEl.appendChild(nextPageBtn);
        }
        imagesContEl.appendChild(paginationContEl);

        imagesContEl.scrollTop = 0;
        window.scrollTo({ top: 0, behavior: "smooth" });

    } catch (error) {
        console.error('Error fetching images:', error);
        resultStatusEl.innerHTML = 'Error fetching images. Please try again.';
    };
}

// Event listeners for search input and icon
inputEl.addEventListener('focus', function () {
    inputEl.placeholder = 'Looking for something?';
    inputEl.style.color = '#4568a1';
});
inputEl.addEventListener("blur", function () {
    inputEl.placeholder = "Search here...";
    inputEl.style.color = 'gray';
});
inputEl.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        imagesContEl.textContent = '';
        searchInput = inputEl.value;
        currentPage = 1;
        displayImages(searchInput);
    }
});

// Search icon click event
searchIconEl.addEventListener('click', function () {
    searchIconEl.style.color = 'rgb(211, 23, 136)';
    if (inputEl.value != '') {
        resultStatusEl.style.display = 'block'
        imagesContEl.textContent = '';
        searchInput = inputEl.value;
        currentPage = 1;
        displayImages(searchInput);
    };
})

// Sidebar functionality
function addOptionsToDropDown(optionsListEl, options) {
    optionsListEl.innerHTML = '';
    for (let i in options) {
        if (options[i] != '') {
            const eachOptionEl = document.createElement('li');

            const optionNameEl = document.createElement('h1');
            optionNameEl.textContent = options[i];
            optionNameEl.id = 'optionName';
            optionNameEl.classList.add('option-name');
            optionNameEl.style.fontSize = '1vw';
            eachOptionEl.appendChild(optionNameEl);
            optionsListEl.appendChild(eachOptionEl);

            optionNameEl.addEventListener('click', function () {
                inputEl.value = '';
                searchIconEl.style.color = '';
                imagesContEl.textContent = '';
                searchInput = options[i];
                currentPage = 1;
                displayImages(searchInput);
            });

        }
    }
}

// Create sidebar list items with dropdown functionality
const createSideBarList = function (category, options, iconType, iconName) {
    const listItem = document.createElement('li');

    const dropDownContEl = document.createElement('div');
    dropDownContEl.classList.add('d-flex', 'flex-row', 'justify-content-start');
    dropDownContEl.classList.add('drop-down-cont');
    listItem.appendChild(dropDownContEl);

    const iconCategoryEl = document.createElement('div');
    iconCategoryEl.classList.add('iconCategoryEl');
    iconCategoryEl.classList.add('d-flex', 'flex-row', 'justify-content-between')
    dropDownContEl.appendChild(iconCategoryEl);
    
    const iconEl = document.createElement('i');

    if (iconType == 'fa') {
        iconEl.classList.add('fa', iconName);
    } else if (iconType == 'material') {
        iconEl.classList.add('material-symbols-outlined');
        iconEl.style.fontSize = '2.5vw';
        iconEl.textContent = iconName;
    }
    iconEl.classList.add('icon-el');
    iconCategoryEl.appendChild(iconEl);

    const categoryNameEl = document.createElement('span');
    categoryNameEl.textContent = category;
    categoryNameEl.classList.add('menu-text');

    iconCategoryEl.appendChild(categoryNameEl);

    const arrowIcon = document.createElement('i');
    arrowIcon.classList.add('fa-solid', 'fa-angle-right');
    arrowIcon.classList.add('arrow-icon');
    arrowIcon.id = 'arrowIcon';
    dropDownContEl.appendChild(arrowIcon);

    listItem.appendChild(dropDownContEl);

    sideBarListEl.appendChild(listItem);

    let optionsListEl = document.createElement('ul');
    optionsListEl.classList.add('options-list')
    listItem.appendChild(optionsListEl);

    dropDownContEl.addEventListener('click', function () {
        document.querySelectorAll('.arrow-icon').forEach(icon => {
            if (icon !== arrowIcon) {
                icon.classList.replace('fa-angle-down', 'fa-angle-right');
                optionsListEl.innerHTML = '';
            }
        });

        // Close other open dropdowns
        document.querySelectorAll('.options-list').forEach(list => {
            if (list !== optionsListEl) {
                list.innerHTML = '';
            }
        });
        if (arrowIcon.classList.contains('fa-angle-right')) {
            arrowIcon.classList.replace('fa-angle-right', 'fa-angle-down');
            addOptionsToDropDown(optionsListEl, options);

        } else {
            arrowIcon.classList.replace('fa-angle-down', 'fa-angle-right');
            optionsListEl.innerHTML = '';
        }

    });
}

// Fetch categories and options from local server(Excel)
const fetchXlData = new Promise(function (resolve, reject) {
    fetch('http://127.0.0.1:5000/data')
        .then(response => response.json())
        .then(data => resolve(data))
        .catch(error => reject(error));
})

// Populate sidebar with categories and options with icons
async function getXlData() {
    const dataSet = await fetchXlData;
    const icons = {
        'Nature': ['fa', 'fa-leaf'],
        'Animals': ['fa', 'fa-paw'],
        'Food': ['fa', 'fa-utensils'],
        'Sports': ['fa', 'fa-baseball'],
        'Travel': ['fa', 'fa-location-dot'],
        'Space': ['material', 'planet']
    };

    for (let key in dataSet) {
        let options = dataSet[key];
        key = key.trim();
        const icontype = icons[key] ? icons[key][0] : 'fa';
        const iconName = icons[key] ? icons[key][1] : 'fa-circle';
        createSideBarList(key, options, icontype, iconName);
    };
}
getXlData();

// Sidebar toggle functionality
menuIconEl.addEventListener('click', function () {
    sideBarEl.classList.toggle('collapsed');
    document.body.classList.toggle('sidebar-collapsed');
    document.querySelectorAll('.options-list').forEach(list => {
        list.innerHTML = '';
    });

    menuHeadingEl.style.display = menuHeadingEl.style.display === 'none' ? 'block' : 'none';

    document.querySelectorAll('.menu-text').forEach(text => {
        text.style.display = sideBarEl.classList.contains('collapsed') ? 'none' : 'inline';
    });

    document.querySelectorAll('.arrow-icon').forEach(iconn => {
        if (sideBarEl.classList.contains('collapsed')) {
            iconn.classList.remove('fa-angle-down');
            iconn.classList.add('fa-angle-right');
        } else {
            iconn.classList.remove('fa-angle-right');
            iconn.classList.add('fa-angle-down');
        }
    });
    paginationContEl.style.display = sideBarEl.classList.contains('collapsed') ? 'none' : 'flex';
});