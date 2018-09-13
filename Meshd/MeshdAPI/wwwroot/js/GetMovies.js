function GetMovies() {
    const app = document.getElementById('root');

    const logo = document.createElement('img');
    logo.src = 'logo.png';

    const container = document.createElement('div');
    container.setAttribute('class', 'container');

    app.appendChild(logo);
    app.appendChild(container);

    var request = new XMLHttpRequest();
    request.open('GET', 'https://ghibliapi.herokuapp.com/films', true);
    request.onload = function () {

        // Begin accessing JSON data here
        var data = JSON.parse(this.response);
        if (request.status >= 200 && request.status < 400) {
            data.forEach(movie => {
                const card = document.createElement('div');
                card.setAttribute('class', 'card');

                const h1 = document.createElement('h1');
                h1.textContent = movie.title;

                const p = document.createElement('p');
                movie.description = movie.description.substring(0, 300);
                p.textContent = `${movie.description}...`;

                container.appendChild(card);
                card.appendChild(h1);
                card.appendChild(p);
        });
        } else {
            const errorMessage = document.createElement('marquee');
            errorMessage.textContent = `Gah, it's not working!`;
    app.appendChild(errorMessage);
  }
}

request.send();
}

function SayHi() {
    const valuesTarget = document.getElementById('values');
    const container = document.createElement('div');
    container.setAttribute('class', 'container');

    valuesTarget.appendChild(container);

    const request = new XMLHttpRequest();
    const url = 'http://localhost:61947/api/values';
    request.open("GET", url, true);
    //request.onload = function() {
    //    var data = JSON.parse(this.response);
    //    console.log(data);
    //}

    request.send();
    request.onreadystatechange = (e) => {

        const data = request.responseText;
        data.forEach(element => {
            console.log(element);
            
        });
        console.log(data);

        const card = document.createElement('div');

        const p = document.createElement('p');
        p.textContent = `${data}`;

        container.appendChild(card);
        card.appendChild(p);





    }
}
