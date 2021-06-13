
const alphabet = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "A", "S", "D", "F", "G", "H", "J", "K", "L", "Z", "X", "C", "V", "B", "N", "M"]
const bodyParts = ["head", "body", "arm-left", "arm-right", "leg-left", "leg-right"];
var word = "", goal, threat;

function newGame() {
    clearBoard(); // Reset elements for a new game
    word = document.getElementById("inputField").value; // This is used to find and switch characters on the screen
    goal = word.length; // When goal reaches 0 the game ends in a 'win'
    document.getElementById("inputField").value = ""; // Clear the modal text field
    document.getElementById("keyboard").style.visibility = "visible";
    console.log("Input: " + word);
    let checkAlpha = new RegExp(/^[a-zA-Z]+$/); // Parse the word to make sure it only contains alphabetic characters
    if (word.match(checkAlpha)) {
        word = word.toUpperCase();
        let charField = document.getElementById("charField"); // Generate and display containers for every word character
        for (let i = 0; i < word.length; i++) {
            const character = word[i];

            let char = document.createElement("div"); // Characters are hidden by default
            char.className = "char";
            char.id = "char_" + i;
            char.innerHTML = character;

            let underline = document.createElement("div");
            underline.className = "underline";

            let charBox = document.createElement("div");
            charBox.className = "charBox";
            charBox.id = "box_" + i;
            charBox.appendChild(char);
            charBox.appendChild(underline);
            charField.appendChild(charBox);
        }
        console.log("Word: " + word + "\nThreat: " + threat + "/7 ; Goal: " + goal + "/" + word.length);
    } else {
        console.log("Found illegal character");
        disableKeys("misfire"); // Halt game start
    }
}

function clearBoard() { // Reset elements for a new game
    if (word.length > 0) {
        for (let i = 0; i < word.length; i++) { // Remove old character containers
            let charBox = document.getElementById("box_" + i);
            document.getElementById("charField").removeChild(charBox);
        }
    }
    for (let i = 0; i < bodyParts.length; i++) { // Hide graphical elements
        const part = bodyParts[i];
        document.getElementById(part).style.visibility = "hidden";
        threat = 0;
        word = "";
    }
    document.getElementById("hanged").style.visibility = "hidden"; // Hide the fruit
    alphabet.forEach(key => { // Reset the virtual keyboard
        let keyDepress = document.getElementById(key);
        keyDepress.removeAttribute('style');
        keyDepress.setAttribute("onclick", "inquire('" + key + "')");
    });
    document.getElementById("result").innerHTML = ""; // Clear the message area.
}

function inquire(key) { // Called when clicking a key
    let success = false;
    for (let i = 0; i < word.length; i++) { // Search the word for the chosen character and reveal each instance
        const character = word[i];
        if (key == character) {
            success = true;
            goal--;
            document.getElementById("char_" + i).style.visibility = "visible";
            if (goal == 0) { // Winning scenario
                return disableKeys("win");
            }
        }
    }
    if (success == false) {
        if (threat < 6) {
            document.getElementById(bodyParts[threat++]).style.visibility = "visible"; // Reveal the next body part outline... oh the horror!
            
        } else { // Losing scenario
            document.getElementById("hanged").style.visibility = "visible"; // Switch the outline for the 'real' thing
            bodyParts.forEach(element => {
                document.getElementById(element).style.visibility = "hidden";
            });
            return disableKeys("lose");
        }
    }
    keyPress(key); // Whatever happens, a pressed key, remains this way
    console.log("Threat: " + threat + "/7 ; Goal: " + goal + "/" + word.length);
}

function keyPress(key) {
    let keyPress = document.getElementById(key);
    keyPress.style.color = "white";
    keyPress.style.top = "2";
    keyPress.style.left = "2";
    keyPress.style.boxShadow = "1px 1px 0px";
    keyPress.setAttribute("onclick", "bump()");
}

function disableKeys(result) { // When the game ends, all keys are disabled
    alphabet.forEach(key => {
        keyPress(key);
    });
    let resultText = document.getElementById("result");
    switch (result) {
        case "win":
            resultText.innerHTML = "You live to see another day."
            break;
        case "lose":
            resultText.innerHTML = "You became a strange fruit."
            break;
        case "misfire":
            resultText.innerHTML = "You better think of something better."
            word = "";
            break;
        default:
            break;
    }
}

function bump() {
    console.log("disabled");
}