const apiKey = "919d271dac1bb5318b47f53499249864"

function addLog(text){
const logBox = document.getElementById("logBox")
const line = document.createElement("div")
line.innerText = "> " + text
logBox.appendChild(line)
}

async function getWeather(city){

const info = document.getElementById("weatherInfo")
const logBox = document.getElementById("logBox")

if(city === ""){
alert("Enter a city")
return
}

logBox.innerHTML=""

addLog("1 Sync start")

setTimeout(()=>{
addLog("4 Macrotask finished")
},0)

Promise.resolve().then(()=>{
addLog("3 Microtask finished")
})

addLog("2 Fetching weather")

try{

const url=`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`

const res = await fetch(url)

if(!res.ok){
throw new Error("City not found")
}

const data = await res.json()

info.innerHTML = `
<div class="row"><b>City</b><span>${data.name}</span></div>
<div class="row"><b>Temp</b><span>${data.main.temp}°C</span></div>
<div class="row"><b>Humidity</b><span>${data.main.humidity}%</span></div>
<div class="row"><b>Wind</b><span>${data.wind.speed} m/s</span></div>
`

saveHistory(data.name)

addLog("5 Weather loaded")

}
catch(err){
info.innerHTML=`<p style="color:red;text-align:center">${err.message}</p>`
addLog("Error: "+err.message)
}

}

function saveHistory(city){

let history = JSON.parse(localStorage.getItem("cities")) || []

if(!history.includes(city)){
history.push(city)

if(history.length>5){
history.shift()
}

localStorage.setItem("cities",JSON.stringify(history))
}

showHistory()
}

function showHistory(){

let history = JSON.parse(localStorage.getItem("cities")) || ["Delhi","London","Tokyo"]

const list = document.getElementById("historyList")
list.innerHTML=""

history.forEach(city=>{

const btn=document.createElement("button")
btn.className="hist-btn"
btn.innerText=city

btn.onclick=()=>{
getWeather(city)
}

list.appendChild(btn)

})
}

document.getElementById("searchBtn").addEventListener("click",()=>{
const city=document.getElementById("cityInput").value.trim()
getWeather(city)
})

document.getElementById("cityInput").addEventListener("keypress",(e)=>{
if(e.key==="Enter"){
const city=document.getElementById("cityInput").value.trim()
getWeather(city)
}
})

window.onload=showHistory
