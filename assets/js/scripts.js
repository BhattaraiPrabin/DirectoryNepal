// Function to add a directory entry
async function addDirectory() {
    const image = document.getElementById('image').value;
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const mapEmbed = document.getElementById('mapEmbed').value;
    const websiteLink = document.getElementById('websiteLink').value;

    const directoryData = {
        image,
        title,
        description,
        mapEmbed,
        websiteLink
    };

    try {
        const response = await fetch('http://localhost:8080/api/directory', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(directoryData)

        });
        console.log(JSON.stringify(directoryData))
        console.log({response})

        if (response.ok) {
            // Data added successfully, close the modal
            document.getElementById('directoryForm').reset();

            const modal = document.getElementById('directoryModal');
            modal.classList.remove('show');
            modal.style.display = 'none';
            const modalBackdrop = document.querySelector('.modal-backdrop');
            modalBackdrop.parentNode.removeChild(modalBackdrop);
        } else {
            console.error('Failed to add directory entry');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Function to fetch and display directory entries
async function displayDirectories() {
    try {
        const response = await fetch('http://localhost:8080/api/directory');
        if (response.ok) {
            const directories = await response.json();
            const container = document.getElementById('directoryContainer'); // Use getElementById

           // Loop through the directory entries and create HTML for each
           directories.forEach(directory => {
            const directoryDiv = document.createElement('div');
            directoryDiv.classList.add('container-entry'); // Add a class for styling, if needed

            const column1 = document.createElement('div');
            column1.classList.add('left-column');

            const image = document.createElement('img');
            image.classList.add('directory-image');
            image.src = directory.image;
            image.alt = 'Directory Image';
            column1.appendChild(image);

            const title = document.createElement('h1');
            title.textContent = directory.title;
            column1.appendChild(title);

            const description = document.createElement('p');
            description.textContent = 'Description: ' + directory.description;
            column1.appendChild(description);

            const websiteLink = document.createElement('p');
            websiteLink.innerHTML = `<a href="${directory.websiteLink}" target="_blank">Website Link</a>`;
            column1.appendChild(websiteLink);

            // Add the update and delete buttons to column1
            const updateButton = document.createElement('button');
            updateButton.textContent = 'Update';
            updateButton.classList.add('btn', 'btn-primary');
            updateButton.addEventListener('click', () => handleUpdate(directory._id));
            column1.appendChild(updateButton);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('btn', 'btn-danger');
            deleteButton.addEventListener('click', () => handleDelete(directory._id));
            column1.appendChild(deleteButton);

            directoryDiv.appendChild(column1);

            const column2 = document.createElement('div');
            column2.classList.add('right-column', 'map-section');

            const mapTitle = document.createElement('h2');
            mapTitle.textContent = 'Location Map';
            column2.appendChild(mapTitle);

            const mapIframe = document.createElement('iframe');
            mapIframe.classList.add('iframe');
            mapIframe.src = directory.mapEmbed;
            mapIframe.width = '100%';
            mapIframe.height = '395';
            mapIframe.frameBorder = '0';
            mapIframe.style.border = '0';
            mapIframe.allowFullscreen = true;
            column2.appendChild(mapIframe);

            directoryDiv.appendChild(column2);

            container.appendChild(directoryDiv);
        });
    } else {
        console.error('Failed to fetch directory entries');
    }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Function to handle the delete button click
async function handleDelete(directoryId) {
    try {
        const response = await fetch(`http://localhost:8080/api/directory/${directoryId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            // Directory deleted successfully, remove it from the DOM
            const directoryDiv = document.querySelector(`[data-id="${directoryId}"]`);
            if (directoryDiv) {
                directoryDiv.remove();
            }
        } else {
            console.error('Failed to delete directory entry');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Function to populate the update modal with directory data
function populateUpdateModal(directory) {
    document.getElementById('updateImage').value = directory.image;
    document.getElementById('updateTitle').value = directory.title;
    document.getElementById('updateDescription').value = directory.description;
    document.getElementById('updateMapEmbed').value = directory.mapEmbed;
    document.getElementById('updateWebsiteLink').value = directory.websiteLink;
}

// Function to handle the update button click
function handleUpdate(directoryId) {
    // Make a GET request to fetch the directory data by ID
    console.log({directoryId})
    fetch(`http://localhost:8080/api/directory/${directoryId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch directory data');
            }
            return response.json();
        })
        .then(directory => {
            // Populate the update modal with the directory data
            populateUpdateModal(directory);

            // Show the update modal by adding the 'show' class
            const updateModal = document.getElementById('updateModal');
            updateModal.classList.add('show');
            updateModal.style.display = 'block'; // Make it visible

            // Add the modal-backdrop element to the body
            const modalBackdrop = document.createElement('div');
            modalBackdrop.classList.add('modal-backdrop', 'fade', 'show');
            document.body.appendChild(modalBackdrop);

            // Set the 'data-directory-id' attribute of the 'updateButton' element
            // const updateButton = document.getElementById('updateButton');
            // updateButton.setAttribute('data-directory-id', directoryId);
        })
        .catch(error => {
            console.error('Error:', error);
        });

        
    document.getElementById('saveChangesButton').addEventListener('click', () => {
        // Get the directory ID from somewhere (replace 'your-directory-id' with the actual ID)
        // const directoryId = document.getElementById('updateButton').getAttribute('data-directory-id');

       // Get the updated data from the modal form
    const updatedData = {
        image: document.getElementById('updateImage').value,
        title: document.getElementById('updateTitle').value,
        description: document.getElementById('updateDescription').value,
        mapEmbed: document.getElementById('updateMapEmbed').value,
        websiteLink: document.getElementById('updateWebsiteLink').value
    };

    // Make a PUT request to update the directory data
    fetch(`http://localhost:8080/api/directory/${directoryId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update directory data');
        }
        // Handle successful update here
        // You can close the modal or perform any other action

        // Close the modal
        const updateModal = document.getElementById('updateModal');
        updateModal.classList.remove('show');
        updateModal.style.display = 'none';

        // Remove the modal backdrop
        const modalBackdrop = document.querySelector('.modal-backdrop');
        if (modalBackdrop) {
            modalBackdrop.parentNode.removeChild(modalBackdrop);
        }

        // Optionally, reload the directory list or show a success message
    })
    .catch(error => {
        console.error('Error:', error);
    });
    });
}



// Call the function to display directories when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
    displayDirectories();

});
