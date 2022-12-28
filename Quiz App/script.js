const questionId = document.querySelector(".id")
const question = document.querySelector(".sub-text")
const options = document.querySelectorAll(".options")
const btn = document.querySelector(".button")
const endBtn = document.querySelector(".end-button")
const scoreBoard = document.getElementById("score")
let currentIndex = 0
let score = 0

async function getQuestions() {
    const response = await fetch("https://the-trivia-api.com/api/questions?categories=history,general_knowledge,science&limit=20");
    const result = await response.json();

    console.log(result);
    // Get the questions lenght
    const questionLenght =  [...result].length
    function setQuestion() {
    // Put incorrect and correct answer into one array
    const correct = [result[currentIndex].correctAnswer]
    const incorrect = [...result[currentIndex].incorrectAnswers]
    const answer = [...incorrect, ...correct]

    // Add question number
    questionId.textContent = currentIndex + 1
    // Shuffle the answers
    const shuffled = answer
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)


    // Assign each answer to an option
    question.textContent = result[currentIndex].question
    for (let i = 0; i < answer.length; i++) {
        for (let i = 0; i < options.length; i++) {
            options[i].textContent = shuffled[i]           
        }   
    }

    // Getting correct and wrong option on click of an option
    for (let i = 0; i < options.length; i++) {
        options[i].addEventListener("click", (e) => {
            // Disable every other option once an option is picked
            options.forEach(option => option.style.cssText = "pointer-events: none;")

            if (correct.includes(e.target.textContent)) {
              options[i].classList.add("correct")

            //   Increment score if you get an answer
              score ++
              scoreBoard.textContent = score;
            }else{
                options[i].classList.add("wrong")
                
                // If you click the wrong option show correct option from list of options
                const opt = [...options]
                const findCorrect = opt.find(corr => corr.textContent == correct).classList.add("correct")
            }

            // Display next btn at same time
            btn.style.cssText = "display: flex;"

            if (questionLenght == currentIndex + 1) {
                endBtn.style.cssText = "display: flex;"
                btn.style.cssText = "display: none;"
            }
        }) 
    }  

    }

    setQuestion()

    // Remove the btn on click and change questions
    btn.addEventListener("click", () => {
    btn.style.cssText = "display: none;"

    // Enable options again
    options.forEach(option => option.style.cssText = "pointer-events: all;")

    // Remove correct and wrong classlist for next question
    for (let i = 0; i < options.length; i++) {
    options[i].classList.remove("correct")
    options[i].classList.remove("wrong")
    }

    currentIndex ++
    setQuestion()
    
    // If the question has reached the end stop
    if (questionLenght == currentIndex + 1) {
        endBtn.style.cssText = "display: flex;"
        btn.style.cssText = "display: none;"
    }

    // End the quiz and reload page
    endBtn.addEventListener("click", () => {
        location.reload()
    })
    })
}

getQuestions()
