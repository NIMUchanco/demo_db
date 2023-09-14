let data = []; //global variable to store the data

const fetchAccountBook = async (url) => {
    const response = await fetch(url);
    const data = await response.json();
    displayData(data);
}

//call the function to fetch the data
fetchAccountBook('php/select.php');

//filter data
const filter = document.querySelector('#filter');
const month = document.querySelector('#month');
const year = document.querySelector('#year');
const filterBtn = document.querySelector('#filterBtn');

//total sum
let sum = 0;

//populate the select element with options
const populateSelect = (selectElement, options) => {
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.innerHTML = option.label;
        selectElement.appendChild(optionElement);
    });
};

//generate the month and year options
const monthOptions = [
    {value: 1, label: 'January'},
    {value: 2, label: 'February'},
    {value: 3, label: 'March'},
    {value: 4, label: 'April'},
    {value: 5, label: 'May'},
    {value: 6, label: 'June'},
    {value: 7, label: 'July'},
    {value: 8, label: 'August'},
    {value: 9, label: 'September'},
    {value: 10, label: 'October'},
    {value: 11, label: 'November'},
    {value: 12, label: 'December'}
];

const yearOptions = [
    {value: 2023, label: 2023},
    {value: 2024, label: 2024},
];

//populate the month and year select elements
populateSelect(month, monthOptions);
populateSelect(year, yearOptions);

filterBtn.addEventListener('click', async (event) => {
    event.preventDefault();
    //get the value of the filter
    const selectedMonth = month.value;
    const selectedYear = year.value;
    const radio = document.querySelector('input[name="entryType"]:checked');
    if (radio) {
        const selectedType = radio.value;
        console.log('Selected Type:', selectedType);

        await fetchFilteredData(selectedMonth, selectedYear, selectedType);
    } else {
        console.log('No radio button selected.');
        await fetchFilteredData(selectedMonth, selectedYear);
    }
});

const fetchFilteredData = async (month, year, type) => {
    let url = `php/filter.php?month=${month}&year=${year}`;

    // Append type parameter if it's provided
    if (type) {
        url += `&type=${type}`;
    }

    console.log(url);

    try{
        const response = await fetch(url);
        console.log(response);
        const data = await response.json();
        displayData(data);
    } catch (error) {
        console.log('Error fetching filtered data', error);
    }
}

const clearFilter = document.querySelector('#clearFilter');
clearFilter.addEventListener('click', (event) => {
    event.preventDefault();
    window.location.reload();
});

//get the form element
const form = document.querySelector('#form');

//display data
const displayData = (data) => {
    const table = document.createElement("table");
    table.innerHTML = `
        <tr>
            <th>Date</th>
            <th>Item</th>
            <th>Price</th>
            <th>Type</th>
            <th></th>
            <th></th>
        </tr>
    `;

    // add table to the display section
    const display = document.querySelector("#display");
    display.innerHTML = "";
    display.innerHTML = "<h2>List of records</h2>";
    display.appendChild(table);

    //reset the total sum
    sum = 0;

    data.forEach(entry => {
        //calculate the total sum
        if (entry.type == 'expenditure') {
            sum -= parseFloat(entry.price);
        } else {
            sum += parseFloat(entry.price);
        }
        
        // Create table row
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${entry.date}</td>
            <td>${entry.item}</td>
            <td>$ ${entry.price}</td>
            <td class="${entry.type.toLowerCase()}">${entry.type}</td>
            <td><a href="#" data-id="${entry.id}" class="btn edit-link">&#x270E;</a></td>
            <td><a href="#" data-id="${entry.id}" class="btn delete-link">&#x2702;</a></td>
        `;
        //<td><a href="#" data-id="${entry.id}" class="btn edit-link"><i class="fa-solid fa-pencil"></i></a></td>
        //<td><a href="#" data-id="${entry.id}" class="btn delete-link"><i class="fa-solid fa-eraser"></i></a></td>
        table.appendChild(row);

        //edit btn
        const editLink = row.querySelector('.edit-link');
        editLink.addEventListener('click', (event) => {
            event.preventDefault();
            const id = event.target.getAttribute('data-id');
            console.log(id);

            //Use the data variable to find the entry with the id
            const selectedEntry = data.find(entry => entry.id == id);
            if (selectedEntry) {
                document.querySelector('#hiddenId').value = id;
                document.querySelector('#date').value = selectedEntry.date;
                document.querySelector('#item').value = selectedEntry.item;
                document.querySelector('#price').value = selectedEntry.price;
                document.querySelector(`input[name="type"][value="${selectedEntry.type}"]`).checked = true;
            }
            display.innerHTML = '';
            const filter = document.querySelector('#filter');
            filter.style.display = 'none';

            // Create a refresh button element
            const backBtn = document.createElement('a');
            backBtn.innerHTML = '<i class="fa-solid fa-left-long"></i>&nbsp; Go back';

            // Add an event listener to the refresh button
            backBtn.addEventListener('click', () => {
                fetchAccountBook('php/select.php');
                form.reset();
                filter.style.display = 'block';
            });
            display.appendChild(backBtn);
        });


        //delete btn
        const deleteLink = row.querySelector('.delete-link');
        deleteLink.addEventListener('click', async (event) => {
            event.preventDefault();
            console.log('delete');

            const id = event.target.getAttribute('data-id');
            document.querySelector('#hiddenId').value = id;

            const form = document.querySelector('#form');
            const deleteData = new FormData(form);
            //delete input data
            const url = 'php/delete.php';
            const deleteResponse = await fetch(url, {
                method: 'POST',
                body: deleteData
            });

            //call the function again to refresh the page
            fetchAccountBook('php/select.php');
        });
    });

    //display the total sum
    const total = document.createElement('p');
    display.appendChild(total);
    total.innerHTML = `Total: $ ${sum}`;
}

//send form data to the server
form.addEventListener('submit', async (event) => {
    // Prevent the default form submission behavior
    event.preventDefault();

    const insertData = new FormData(form);
    const url = 'php/insert.php';

    form.reset();

    //send data to the server
    const response = await fetch(url, {
        method: 'POST',
        body: insertData
    });
    const insertdata = await response.json();
    console.log(insertdata);

    //call the function again to refresh the page
    window.location.reload();
});