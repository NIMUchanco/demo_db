const fetchAccountBook = async (url) => {
    const response = await fetch(url);
    const data = await response.json();
    displayData(data);
}

//call the function to fetch the data
fetchAccountBook('php/select.php');

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

    data.forEach(entry => {
        //console.log(entry);
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${entry.date}</td>
            <td>${entry.item}</td>
            <td>$ ${entry.price}</td>
            <td class="${entry.type.toLowerCase()}">${entry.type}</td>
            <td><a href="#" data-id="${entry.id}" class="btn edit-link"><i class="fa-solid fa-pencil"></i></a></td>
            <td><a href="#" data-id="${entry.id}" class="btn delete-link"><i class="fa-solid fa-eraser"></i></a></td>
        `;
        table.appendChild(row);

        //edit btn
        const editLink = row.querySelector('.edit-link');
        editLink.addEventListener('click', async (event) => {
            event.preventDefault();
            const id = event.target.getAttribute('data-id');
            const response = await fetch('php/select.php');
            const data = await response.json();
            console.log(id);

            //find the entry with the id
            const selectedEntry = data.find(entry => entry.id == id);
            if (selectedEntry) {
                document.querySelector('#hiddenId').value = id;
                document.querySelector('#date').value = selectedEntry.date;
                document.querySelector('#item').value = selectedEntry.item;
                document.querySelector('#price').value = selectedEntry.price;
                document.querySelector(`input[name="type"][value="${selectedEntry.type}"]`).checked = true;
            }
            display.innerHTML = '';
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
}

//send form data to the server
const form = document.querySelector('#form');
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
    fetchAccountBook('php/select.php');
});


//Design js
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    header.classList.toggle('addBg', window.scrollY > 0);
});