const searchBtn = document.querySelector('.searchbtn')
const inputEl = document.querySelector('input')
const cardsContainer = document.querySelector('.cards-container')
const watchlistbtn = document.querySelector('.watchlist')
const moviesbtn = document.querySelector('.movies')

const watchlist = []

function switchTab() {
    watchlistbtn.classList.toggle('invisible')
    moviesbtn.classList.toggle('invisible')
    inputEl.classList.toggle('invisible')
    searchBtn.classList.toggle('invisible')
    renderMovies()
}

watchlistbtn.addEventListener('click', switchTab)
moviesbtn.addEventListener('click', switchTab)
searchBtn.addEventListener('click', handleClick)

function renderMovies() {
    cardsContainer.innerHTML = ''
    if (watchlistbtn.classList.contains('invisible')) {
        let watchlistParsed = JSON.parse(localStorage.getItem('wlist'))
        const html = watchlistParsed.map(object => {
            const { Poster, Title, Runtime, Ratings, Genre, Plot } = object
            return (`
            <div class="film-card">     
                <div class="image-container">
                    <img src="${Poster}" alt="">
                </div>
                <div class="text-container">
                    <div>
                        <h3>${Title}</h3>
                        <span>${Ratings[0].Value}</span>
                    </div>
                    <div>
                        <span>${Runtime}</span>
                        <span>${Genre}</span>
                        <button class="filmbtn">delete</button>
                        <span>Watchlist</span>
                    </div>
                    <p>${Plot}</p>
                </div>
            </div>
    `)
        }
        ).join('')
        cardsContainer.innerHTML = html
        document.querySelectorAll('.filmbtn').forEach(btn => btn.addEventListener('click', event => {
            const filmTitle = event.path[2].children[0].children[0].textContent
            watchlistParsed = watchlistParsed.filter(object => object.Title !== filmTitle)
            localStorage.setItem('wlist', JSON.stringify(watchlistParsed))
            renderMovies()
        }))
        
        
    }
}


function handleClick(event) {
    event.preventDefault()
    const searchFrase = inputEl.value
    fetch(`http://www.omdbapi.com/?t=${searchFrase}&plot=short&apikey=73603aa0`)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            const { Poster, Title, Runtime, Ratings, Genre, Plot } = data
            const html = `
            <div class="film-card">     
                <div class="image-container">
                    <img src="${Poster}" alt="">
                </div>
                <div class="text-container">
                    <div><h3>${Title}</h3> <span>${Ratings[0].Value}</span></div>
                    <div><span>${Runtime}</span> <span>${Genre}</span> <button class="filmbtn">save</button> <span>Watchlist</span></div>
                    <p>${Plot}</p>
                </div>
            </div>`
            cardsContainer.innerHTML = html
            document.querySelector('.filmbtn').addEventListener('click', () => {
                watchlist.push(data)
                localStorage.setItem('wlist', JSON.stringify(watchlist))
            })
        })
}