// IMPORT ESSENTIAL FUNCTIONS FROM FIREBASE
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

// SET APP AND DATABASE
const appSetting = {
    databaseURL: "https://we-are-the-champions-302a3-default-rtdb.firebaseio.com/"
}
const app = initializeApp(appSetting)
const database = getDatabase(app)
const endorsementListInDb = ref(database, "endorsementList")

// GET ESSENTIAL ELEMENTS
const fromNameEl = document.getElementById("from-name")
const toNameEl = document.getElementById("to-name")
const inputMessageEl = document.getElementById("endorsement-msg")
const publishBtn = document.getElementById("btn-el")
const endorsementList = document.getElementById("endorsement-list")

// GET ENDORSEMENTS FROM FIREBASE DATABASE
onValue(endorsementListInDb, function(snapshot) {
    if (snapshot.exists()) {
        let endorsementArray = Object.entries(snapshot.val()).reverse()
        clearEndorsementList()
        for (let i = 0; i < endorsementArray.length; i++) {
            let currentEndorsement = endorsementArray[i]
            appendEndorsementToList(currentEndorsement)
        }
    }
})

// CLEAR ENDORSEMENTS IN DOM
function clearEndorsementList() {
    endorsementList.innerHTML = ""
}

// TAKE ENDORSEMENT OBJECT FROM FIREBASE DATABASE, 
// RECREATE ENDORSEMENT BASED ON OBJECT VALUES AND 
// APPEND IT TO ENDORSEMENT LIST IN DOM
function appendEndorsementToList(endorsement) {
    const endorsementID = endorsement[0]
    const endorsementValue = endorsement[1]
    const endorsementBox = document.createElement("div")
    endorsementBox.className = "endorsement-box"

    const fromText = document.createElement("div")
    fromText.className = "from-text"
    fromText.textContent = `From: ${endorsementValue.from}`

    const messageText = document.createElement("div")
    messageText.className = "message-text"
    messageText.textContent = endorsementValue.message

    const toText = document.createElement("div")
    toText.className = "to-text"
    toText.textContent = `To: ${endorsementValue.to}`

    endorsementBox.appendChild(fromText)
    endorsementBox.appendChild(messageText)
    endorsementBox.appendChild(toText)
    endorsementList.appendChild(endorsementBox)
}

// PUSH NEW ENDORSEMENT OBJECT TO FIREBASE DATABASE
publishBtn.addEventListener("click", function() {
    const fromName = fromNameEl.value
    const toName = toNameEl.value
    const message = inputMessageEl.value
    if (fromName.trim() !== "" && toName.trim() !== "" && message.trim() !== "") {
        const endorsement = {
            from: fromName,
            to: toName,
            message: message
        }
        push(endorsementListInDb, endorsement)
        fromNameEl.value = ""
        toNameEl.value = ""
        inputMessageEl.value = ""
    }
})
