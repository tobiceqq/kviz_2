const questions = [
    {
        question: "Co je hlavní město České republiky?",
        answers: ["Brno", "Praha", "Ostrava", "Plzeň"],
        correct: 1
    },
    {
        question: "Kolik je 5 + 3?",
        answers: ["6", "7", "8", "9"],
        correct: 2
    },
    {
        question: "Jaký jazyk se používá pro vzhled webové stránky?",
        answers: ["HTML", "CSS", "PHP", "SQL"],
        correct: 1
    },
    {
        question: "Který HTML tag vytvoří největší nadpis?",
        answers: ["&lt;p&gt;", "&lt;h1&gt;", "&lt;div&gt;", "&lt;span&gt;"],
        correct: 1
    },
    {
        question: "Který příkaz vypíše text do konzole v JavaScriptu?",
        answers: ["print()", "echo()", "console.log()", "write()"],
        correct: 2
    },
    {
        question: "Jaký atribut spojuje radio buttony do jedné skupiny?",
        answers: ["id", "class", "name", "value"],
        correct: 2
    },
    {
        question: "Co znamená HTML?",
        answers: [
            "Hyper Text Markup Language",
            "High Text Machine Language",
            "Hyper Tool Multi Language",
            "Home Text Markup Language"
        ],
        correct: 0
    },
    {
        question: "Který input slouží pro výběr jedné možnosti?",
        answers: ["text", "checkbox", "radio", "password"],
        correct: 2
    },
    {
        question: "K čemu slouží sessionStorage?",
        answers: [
            "K ukládání dat během jedné relace prohlížeče",
            "K úpravě CSS",
            "K načtení obrázku",
            "K vytvoření databáze"
        ],
        correct: 0
    },
    {
        question: "Jak se v JavaScriptu vytvoří konstanta?",
        answers: ["var", "let", "const", "static"],
        correct: 2
    }
];

let currentQuestion = 0;

let userAnswers = JSON.parse(sessionStorage.getItem("userAnswers")) || {};
let finished = sessionStorage.getItem("finished") === "true";

const questionBox = document.getElementById("questionBox");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const submitBtn = document.getElementById("submitBtn");
const result = document.getElementById("result");

function renderQuestion() {
    const q = questions[currentQuestion];

    let html = `
        <fieldset>
            <h2>Otázka ${currentQuestion + 1} z ${questions.length}</h2>
            <p>${q.question}</p>
    `;

    q.answers.forEach((answer, index) => {
        let checked = "";

        if (userAnswers[currentQuestion] == index) {
            checked = "checked";
        }

        let disabled = "";

        if (finished) {
            disabled = "disabled";
        }

        let className = "";

        if (finished) {
            if (index === q.correct) {
                className = "correct";
            } else if (userAnswers[currentQuestion] == index && index !== q.correct) {
                className = "wrong";
            }
        }

        html += `
            <label class="${className}">
                <input 
                    type="radio" 
                    name="answer" 
                    value="${index}" 
                    ${checked} 
                    ${disabled}
                >
                ${answer}
            </label>
        `;
    });

    html += `</fieldset>`;

    questionBox.innerHTML = html;

    if (!finished) {
        const inputs = document.querySelectorAll('input[name="answer"]');

        inputs.forEach(input => {
            input.addEventListener("change", function () {
                userAnswers[currentQuestion] = Number(this.value);
                sessionStorage.setItem("userAnswers", JSON.stringify(userAnswers));
            });
        });
    }

    updateButtons();

    if (finished) {
        showResult();
    }
}

function updateButtons() {
    prevBtn.disabled = currentQuestion === 0;
    nextBtn.disabled = currentQuestion === questions.length - 1;
    submitBtn.disabled = finished;
}

function nextQuestion() {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        renderQuestion();
    }
}

function previousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        renderQuestion();
    }
}

function submitQuiz() {
    finished = true;
    sessionStorage.setItem("finished", "true");

    let score = 0;

    questions.forEach((question, index) => {
        if (userAnswers[index] === question.correct) {
            score++;
        }
    });

    sessionStorage.setItem("score", score);

    renderQuestion();
    showResult();
}

function showResult() {
    const score = sessionStorage.getItem("score");

    result.innerHTML = `
        <h2>Výsledek</h2>
        <p>Získal/a jsi ${score} bodů z ${questions.length}.</p>
    `;
}

prevBtn.addEventListener("click", previousQuestion);
nextBtn.addEventListener("click", nextQuestion);
submitBtn.addEventListener("click", submitQuiz);

renderQuestion();