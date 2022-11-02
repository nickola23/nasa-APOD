let pickDay = new Date()
let currDate = new Date()
let sun = document.getElementById('sun')
let curr_month = {value: currDate.getMonth()}
let curr_year = {value: currDate.getFullYear()}
let curr_day = {value: currDate.getDay()} 
let jupiter = document.getElementById(`jupiter`)
let calendar = document.querySelector('.calendar')
let month_list = calendar.querySelector('.month-list')
let month_picker = calendar.querySelector('#month-picker')
const API_KEY = "OFuTHiMgsvzujVRcxT4WM5M281ZwTch54rRdCdtA"
const month_names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

window.addEventListener('scroll', function(){
let value = window.scrollY
sun.style.top = 0 + value * 0.6 + 'px'
jupiter.style.bottom = value * -0.3 + 'px'
})

isLeapYear = (year) => {
    return (year % 4 === 0 && year % 100 !== 0 && year % 400 !== 0) || (year % 100 === 0 && year % 400 ===0)
}

getFebDays = (year) => {
    return isLeapYear(year) ? 29 : 28
}

generateCalendar = (month, year) => {
    let calendar_days = calendar.querySelector('.calendar-days')
    let calendar_header_year = calendar.querySelector('#year')
    let days_of_month = [31, getFebDays(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

    calendar_days.innerHTML = ''

    let currDate = new Date()
    month = month ?? currDate.getMonth()
    if (!year) year = currDate.getFullYear()

    let curr_month = `${month_names[month]}`
    month_picker.innerHTML = curr_month
    calendar_header_year.innerHTML = year
    
    let first_day = new Date(year, month, 1)

    for (let i = 0; i <= days_of_month[month] + first_day.getDay() - 1; i++) {
        let day = document.createElement('div')
        if (i >= first_day.getDay()) {
            day.classList.add('calendar-day-hover')
            day.innerHTML = i - first_day.getDay() + 1
            if (i - first_day.getDay() + 1 === currDate.getDate() && year === currDate.getFullYear() && month === currDate.getMonth()) {
                day.classList.add('curr-date')
            }
        }
        day.addEventListener("click", (event) => {
            if(event.target.textContent != ""){
                console.log(month)
                pickDay = new Date(year, Number(month), parseInt(event.target.textContent))
                calendar.querySelectorAll(".active").forEach(target => {
                    target.classList.remove("active")
                })
                event.target.classList.add("active")
                change("img2")
            }
            
        })
        calendar_days.appendChild(day)
    }
}

month_names.forEach((e, index) => {
    let month = document.createElement('div')
    month.innerHTML = `<div data-month="${index}">${e}</div>`
    month.querySelector('div').onclick = () => {
        month_list.classList.remove('show')
        curr_month.value = index
        generateCalendar(index, curr_year.value)
    }
    month_list.appendChild(month)
})

month_picker.onclick = () => {
    month_list.classList.add('show')
}

generateCalendar(curr_month.value, curr_year.value)

document.querySelector('#prev-year').onclick = () => {
    --curr_year.value
    generateCalendar(curr_month.value, curr_year.value)
}

document.querySelector('#next-year').onclick = () => {
    ++curr_year.value
    generateCalendar(curr_month.value, curr_year.value)
}

async function APICall(URL) {
    try{
        const res = await fetch(URL)
        if(!res.ok) throw new Error("Error while gathering data")
        const data = await res.json()
        return data
    }
    catch(error){
        console.log(error)
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    APICall(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&&thumbs=true`)
    const data = await APICall(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&&thumbs=true`)
    let title = document.getElementById("title")
    title.innerHTML = data.title
})

async function change(slika){
    const image = document.getElementById(slika)
    const data = await APICall(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&&thumbs=true&date=${pickDay.getFullYear()}-${pickDay.getMonth()+1}-${pickDay.getDate()}`)
    const src = data.media_type === "video" ? data.thumbnail_url : data.hdurl || data.url
    image.src = src
}
change("img1")