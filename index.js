// javascript

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove, update } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://endorsement-app-4c823-default-rtdb.firebaseio.com/"
}

const myApp = initializeApp(appSettings)
const database = getDatabase(myApp)
const endorsementsInDB = ref(database, "endorsements")

const publishButtonEl = document.getElementById("publish-button")
const messageInputEl = document.getElementById("message-input")
const toInputEl = document.getElementById("to-input")
const fromInputEl = document.getElementById("from-input")
const endorsementsContainer = document.getElementById("endorsements-container")


publishButtonEl.addEventListener("click", function(){
    let messageInputValue = messageInputEl.value
    let toInputValue = toInputEl.value
    let fromInputValue = fromInputEl.value
    let favoriteCountInDB = 0
    
    push(endorsementsInDB, {toInputValue, fromInputValue, messageInputValue, favoriteCountInDB})
    
    clearMessageContainer()     
})

function clearMessageContainer() {
    messageInputEl.value = ""
    toInputEl.value = ""
    fromInputEl.value = ""
}

onValue(endorsementsInDB, function(snapshot) {
    
  let  pulledMessageArray = Object.entries(snapshot.val())
  endorsementsContainer.innerHTML = ""
  
  for (let i = 0; pulledMessageArray.length > i; i++) {
    let thisItem = pulledMessageArray[i]
    updateEndorsementsList(thisItem)
  }
    
})

function updateEndorsementsList(item) {
    let pulledItem = item
    let pulledItemID = item[0]
    let pulledItemFromValue = item[1].fromInputValue
    let pulledItemToValue = item[1].toInputValue
    let pulledItemMessageValue = item[1].messageInputValue 
    let pulledItemFavoriteCount = item[1].favoriteCountInDB 
    
    let newListItem = document.createElement("li")
    
    
    newListItem.innerHTML = 
                        `<div class = "message-wrap">
                        <p class = "pulled-to"><b>To ${pulledItemToValue}</b></p>
                        <p class = "pulled-message">${pulledItemMessageValue}</p>
                        <p class = "pulled-from"><b>From ${pulledItemFromValue} </b></p>
                        </div>
                        <div class = "favorite-wrap">
                        </div> `
    
    let faveWrap = document.createElement("div")
    let faveButton = document.createElement('i')
    let faveCount = document.createElement('p')
    
    faveWrap.className = "favorite-wrap"
    faveButton.className = "fa-solid fa-heart favorite-heart"
    faveCount.className = "favorite-count"
    faveCount.innerHTML = pulledItemFavoriteCount
    
    faveListener(faveButton, pulledItemID, pulledItemFavoriteCount)
    
    // Append the faveButton to the created Wrap
    newListItem.appendChild(faveWrap)
    faveWrap.appendChild(faveButton)
    faveWrap.appendChild(faveCount)
    
    endorsementsContainer.append(newListItem)   
}

function faveListener(button, id, count) {
    
    let favoriteCountNumber = Number(count)
    let countInDB = ref(database, `endorsements/${id}`)
    let thisCountNumber = Number(count)
    
    button.addEventListener('click', () => {
        thisCountNumber += 1
        update(countInDB, {favoriteCountInDB: thisCountNumber}) 
    })
}