import hotels from './data.js'
const searchForm = document.querySelector('.search')
const featuresBox = searchForm.querySelector('#features')
const main = document.querySelector('main')

const cached = {}

function setSelectbox(data, parent) {
    data.forEach(x => {
        const option = document.createElement('option')
        option.setAttribute('value', x)
        option.textContent = x
        parent.appendChild(option)
    })
}

function getResult(personCount, city, features) {

    return new Promise((resolve, _) => {
        let result
        const args = []
        main.innerHTML = 'Lütfen bekleyin'
        if (cached[JSON.stringify([personCount, city, features])]) {
            resolve(cached[JSON.stringify([personCount, city, features])])
        } else {
            setTimeout(() => {
                if (personCount) {
                    result = (result || hotels).filter(hotel => hotel.peopleCount === +personCount)
                    args.push(personCount)
                }

                if (city) {
                    result = (result || hotels).filter(hotel => hotel.city === city)
                    args.push(city)
                }

                if (features.length) {
                    result = (result || hotels).filter(hotel => hotel.features.join(',').includes(features))
                    args.push(features)
                }
                resolve(result)
                cached[JSON.stringify([personCount, city, features])] = result
            }, 5000)
        }
    })
}

function listResults(data) {
    main.innerHTML = data.map(hotel => {
        return `
            <div class="card">
                <picture>
                    <img src="${hotel.thumbnail}"
                        alt="${hotel.name}">
                </picture>
                <h2>${hotel.name} - <b>${hotel.city}</b></h2>
                <p style="text-transform: capitalize;">${hotel.features.join(', ')}</p>
                <p>${hotel.pricePerPerson * hotel.peopleCount}${hotel.currency}</p>
            </div>

        `
    }).join('')

}

setSelectbox([...new Set(hotels.map(hotel => hotel.city))], searchForm.querySelector('#cities'))
setSelectbox([...new Set(hotels.map(hotel => hotel.features).flat(1))], featuresBox)
listResults(hotels)

searchForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const formData = new FormData(searchForm)
    const features = [...featuresBox.selectedOptions].map(x => x.value)
    const { personCount, city } = Object.fromEntries(formData)
    listResults(await getResult(personCount, city, features))
})