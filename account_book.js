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
        </tr>
    `;

    data.forEach(entry => {
        //console.log(entry);
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${entry.date}</td>
            <td>${entry.item}</td>
            <td>$ ${entry.price}</td>
            <td>${entry.type}</td>
            <td><a href="php/editForm.php?id=${entry.id}" class="btn edit-link">Edit</a></td>
            <td><a href="php/deleteForm.php?id=${entry.id}" class="btn">Delete</a></td>
        `;
        table.appendChild(row);
    });

    // add table to the display section
    const display = document.querySelector("#display");
    display.innerHTML = "";
    display.appendChild(table);
}

//send form data to the server
const form = document.querySelector('#form');
form.addEventListener('submit', async (event) => {
    // Prevent the default form submission behavior
    event.preventDefault();

    const insertData = new FormData(form);
    let url = 'php/insert.php';

    form.reset();

    const response = await fetch(url, {
        method: 'POST',
        body: insertData
    });
    const insertdata = await response.json();
    console.log(insertdata);

    //call the function again to refresh the page
    fetchAccountBook('php/select.php');

});
