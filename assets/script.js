//Questions to ask for Quiz - Contains question, choices, and answer)
var questions = [
    {
        questionText: "What method sorts the elements of an array?",
        options: [
            "1. sort()",
            "2. order()",
            "3. changeOrder(order)",
            "4. changeOrder();",
        ],
        answer: "1. sort()",
    },
    {
        questionText: "Which element would you put JavaScript inside?",
        options: ["1. <section>", "2. <code>", "3. <var>", "4. <script>"],
        answer: "4. <script>",
    },
    {
        questionText:
            "What is the best way to round a number to the NEAREST integer?",
        options: [
            "1. Math.trunc()",
            "2. Math.ceil()",
            "3. Math.floor()",
            "4. Math.round()",
        ],
        answer: "4. Math.round()",
    },
    {
        questionText: "How do you write a new function in JavaScript",
        options: [
            "1. new.function (){}",
            "2. function = newFunction() {}",
            "3. function:newFunction(){}",
            "4. function newFunction (){}",
        ],
        answer: "4. function newFunction (){}",
    },
    {
        questionText: "How is data stored in local storage?",
        options: [
            "1. arrays",
            "2. objects",
            "3. strings",
            "4. none of the above",
        ],
        answer: "3. strings",
    },
    {
        questionText: "Which Popup Box will NOT have a 'cancel' option?",
        options: [
            "1. Prompt box",
            "2. Alert box",
            "3. Confirm box",
            "4. They all do",
        ],
        answer: "2. Alert box",
    },
    {
        questionText:
            "In JavaScript, what element is used to store multiple values in a single variable?",
        options: ["1. Variables", "2. Arrays", "3. Strings", "4. Functions"],
        answer: "2. Arrays",
    },
    {
        questionText: "What block of code is used to preform a specific task?",
        options: ["1. Declaration", "2. Object", "3. Function", "4. String"],
        answer: "3. Function",
    },
    {
        questionText: 'What  will 5 == "5" return as?',
        options: ["1. 5", "2. null", "3, false", "4. true"],
        answer: "4. true",
    },
    {
        questionText: "What does null mean in JavaScript?",
        options: [
            "1. 0",
            "2. Empty string",
            "3. Absence of value",
            "4. Unknown",
        ],
        answer: "4. Unknown",
    },
];

var resultsCard = document.querySelector("#results-card");
var gloryCard = document.querySelector("#glory-card");
var quizCard = document.querySelector("#quiz-card");
var instructionCard = document.querySelector("#instruction-card");

function hideCards() {
    resultsCard.setAttribute("hidden", true);
    gloryCard.setAttribute("hidden", true);
    quizCard.setAttribute("hidden", true);
    instructionCard.setAttribute("hidden", true);
}

var intervalID;
var time;
var currentQuestion;

// starts the quiz
document.querySelector("#begin-button").addEventListener("click", beginQuiz);

//shows the time on the top header
var timeDisplay = document.querySelector("#timer");
function displayTime() {
    timeDisplay.textContent = time;
}

function beginQuiz() {
    time = 100;
    intervalID = setInterval(countdown, 1000);
    // shows only the question and hides everything else
    hideCards();
    quizCard.removeAttribute("hidden");
    currentQuestion = 0;
    displayQuestion();
    displayTime();
}

//timer function -> reduces times by 1 second and then stops the quiz after it hits 0
function countdown() {
    time--;
    displayTime();
    if (time < 1) {
        endQuiz();
    }
}

//displays the question and answers
function displayQuestion() {
    var question = questions[currentQuestion];
    var options = question.options;
    
    var h2QuestionElement = document.querySelector("#question-text");
    h2QuestionElement.textContent = question.questionText;
    
    for (var i = 0; i < options.length; i++) {
        var option = options[i];
        var optionButton = document.querySelector("#option" + i);
        optionButton.textContent = option;
    }
}


document.querySelector("#quiz-options").addEventListener("click", checkAnswer);

function optionIsCorrect(optionButton) {
    return optionButton.textContent === questions[currentQuestion].answer;
}

// outcome of the answer
var outcomeDiv = document.querySelector("#outcome-div");
var outcomeText = document.querySelector("#outcome-text");

function hideResultText() {
    outcomeDiv.style.display = "none";
}

// will notify user if he/she is wrong or right and will subtract time if wrong 
function checkAnswer(eventObject) {
    var optionButton = eventObject.target;
    outcomeDiv.style.display = "block";
    if (optionIsCorrect(optionButton)) {
        outcomeText.textContent = "Right on!";
        setTimeout(hideResultText, 1000);
    } else {
        outcomeText.textContent = "Wrong!";
        setTimeout(hideResultText, 1000);
        if (time >= 10) {
            time = time - 7;
            displayTime();
        } else {
            time = 0;
            displayTime();
            endQuiz();
        }
    }
    currentQuestion++;
    if (currentQuestion < questions.length) {
        displayQuestion();
    } else {
        endQuiz();
    }
}

//display scorecard and hide other divs
var score = document.querySelector("#results");

//What happens at the end of the quiz
function endQuiz() {
    clearInterval(intervalID);
    hideCards();
    resultsCard.removeAttribute("hidden");
    score.textContent = time;
}

var enterButton = document.querySelector("#enter-button");
var nameElement = document.querySelector("#name");

//saving the users input after their quiz score.
enterButton.addEventListener("click", storeScore);

function storeScore(event) {
    event.preventDefault();
    // modal for not entering anything
    if (!nameElement.value) {
        alert("You must enter something!");
        return;
    }
    var goatItem = {
        initials: nameElement.value,
        score: time,
    };

    updateStoredLeaderboard(goatItem);

    hideCards();
    gloryCard.removeAttribute("hidden");

    renderLeaderboard();
}

function getLeaderboard() {
    var storedLeaderboard = localStorage.getItem("goatArray");
    if (storedLeaderboard !== null) {
        var goatArray = JSON.parse(storedLeaderboard);
        return goatArray;
    } else {
        goatArray = [];
    }
    return goatArray;
}

//The score list is updated everytime and adds new input from user
function updateStoredLeaderboard(goatItem) {
    var goatArray = getLeaderboard();
    goatArray.push(goatItem);
    localStorage.setItem("goatArray", JSON.stringify(goatArray));
}

//display names on GOAT list card
function renderLeaderboard() {
    var sortedGoatArray = sortLeaderboard();
    var goatList = document.querySelector("#glory-list");
    goatList.innerHTML = "";
    for (var i = 0; i < sortedGoatArray.length; i++) {
        var goatEntry = sortedGoatArray[i];
        var newListItem = document.createElement("li");
        newListItem.textContent =
            goatEntry.initials + " - " + goatEntry.score;
        goatList.append(newListItem);
    }
}

//sort the scores
function sortLeaderboard() {
    var goatArray = getLeaderboard();
    if (!goatArray) {
        return;
    }

    goatArray.sort(function (a, b) {
        return b.score - a.score;
    });
    return goatArray;
}

// clearing scores
var clearButton = document.querySelector("#clear-button");
clearButton.addEventListener("click", clearHighscores);

function clearHighscores() {
    localStorage.clear();
    renderLeaderboard();
}

// start all over
var returnButton = document.querySelector("#restart-button");
returnButton.addEventListener("click", returnToStart);

function returnToStart() {
    hideCards();
    instructionCard.removeAttribute("hidden");
}

//Goat Link
var goatLink = document.querySelector("#glory-link");
goatLink.addEventListener("click", showGoatBoard);

function showGoatBoard() {
    hideCards();
    gloryCard.removeAttribute("hidden");
    clearInterval(intervalID);
    time = undefined;
    displayTime();
    renderLeaderboard();
}
