const form = document.querySelector('form');
const loadingElement = document.querySelector('.loading');
const barkElement = document.querySelector('.barks');
const API_URL = 'http://localhost:5000/barks';

loadingElement.style.display = ''

listAllBarks();

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const name = formData.get('name');
    const content = formData.get("content");
    const image = formData.get('image');
    const bark = {
        name,
        content,
        image
    };

    loadingElement.style.display = '';
    form.style.display = 'none';

    fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(bark),
        headers: {
            'content-type': 'application/json'
        }
    }).then(response => response.json())
        .then(createdBark => {
            console.log(createdBark);
            form.reset()
            setTimeout(() => {
                form.style.display = '';
            }, 30000);

            loadingElement.style.display = 'none';
            listAllBarks();
        });
});

function listAllBarks() {
    barkElement.innerHTML = '';

    fetch(API_URL)
        .then(response => response.json())
        .then(barks => {
            console.log(barks);

            barks.reverse();
            barks.forEach(bark => {
                const div = document.createElement('div');

                const header = document.createElement('h3');
                header.textContent = bark.name;

                const contents = document.createElement('p');
                contents.textContent = bark.content;

                const date = document.createElement('small');
                date.textContent = new Date(bark.created)

                div.appendChild(header);
                div.appendChild(contents);
                div.appendChild(date);

                barkElement.appendChild(div);
            });

            loadingElement.style.display = 'none';
        });
}