/*imports firebase app and realtime database libraries */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js"
/*initializes the firebase app with this database URL */
const appSettings = { 
    databaseURL: "https://playground-2-f1680-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")
/*getting references to DOM elements in the html document using document.getElementById */
const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")
/* adds evet listener to add-btn */
addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value
    
    push(shoppingListInDB, inputValue) /*pushes the value to the shoppingList node in firebase database*/
   
    clearInputFieldEl() /*clears the input field */
})

onValue(shoppingListInDB, function(snapshot) {
    if (snapshot.exists()) {  //checks if snapshot exists
        let itemsArray = Object.entries(snapshot.val()) 

        clearShoppingListEl()

        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]
            
            appendItemToShoppingListEl(currentItem)
        }
    } else {
        shoppingListEl.innerHTML = "No items here... yet" //if no items display this message
    }
})

function clearShoppingListEl() { //clears the shopping list
    shoppingListEl.innerHTML = ""
}

function clearInputFieldEl() {  //cleas the input field's value
    inputFieldEl.value = ""
}

function appendItemToShoppingListEl(item) {  //creates a new list item element
    let itemID = item[0]
    let itemValue = item[1]
    
    let newEl = document.createElement("li")
    
    newEl.textContent = itemValue
    
    newEl.addEventListener("click", function() {
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
        
        remove(exactLocationOfItemInDB)
    })
    
    shoppingListEl.append(newEl)
}