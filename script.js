import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://realtime-database-1297f-default-rtdb.asia-southeast1.firebasedatabase.app/"
}
const firebaseApp = initializeApp(appSettings)
const database = getDatabase(firebaseApp)
const cartInDB = ref(database, 'cart')

const inputBtn = document.getElementById("input-btn")
const addBtn = document.getElementById("add-btn")
const ulEl = document.getElementById("ul-el")

addBtn.addEventListener("click", pushToDB)
function pushToDB(){
    let inputValue = inputBtn.value
    push(cartInDB, inputValue)
    clearInputField()
}

inputBtn.addEventListener("keypress", function (event){
    if(event.keyCode === 13){
        pushToDB()
    }
})

onValue(cartInDB, function (snapshot){
    if(snapshot.exists()){
        clearLists()
        let itemsInArray = Object.entries(snapshot.val())
        for (let i=0; i<itemsInArray.length; i++){
            let currentItem = itemsInArray[i]
            render(currentItem)
        }
    }else{
        ulEl.innerHTML = `<p>No items added in Cart...</p>`
    }
})

function clearInputField(){
   inputBtn.value = "" 
}

function clearLists(){
    ulEl.innerHTML = ""
}
function render(item){
    let itemID = item[0]
    let itemValue = item[1]
    let newEl = document.createElement("li")
    
    newEl.textContent = itemValue
    newEl.addEventListener("dblclick", function (){
        let exactLocationInDB = ref(database, `cart/${itemID}`)
        remove(exactLocationInDB)
    })
    
    ulEl.append(newEl)
}