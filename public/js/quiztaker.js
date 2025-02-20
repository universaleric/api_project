let startBtnEl = document.querySelector('.startBtn');
let instructEl = document.querySelector('#instructions');
let timeBtnEl = document.querySelector('.time');
let HighSBtnEl = document.querySelector('.hss');
let timerEl = document.querySelector('.timer');
let mainEl = document.querySelector('.main');

let finalScoreEl = document.querySelector('.finalScore');
let endScreenEl = document.querySelector('.endScreen');
let questContainEl = document.querySelector('.questContain');
let questEl = document.querySelector('.questionPrompt');

let answerBtnsEl = document.getElementsByClassName('answerBtn');
let answerBtnAEl = document.querySelector('#answerchoicea');
let answerBtnBEl = document.querySelector('#answerchoiceb');
let answerBtnCEl = document.querySelector('#answerchoicec');
let answerBtnDEl = document.querySelector('#answerchoiced');
let user_idEl = document.querySelector('#user_idNumber');
let usernameEl = document.querySelector('#user_nameText');

let username = usernameEl.innerHTML
let user_id = parseInt(user_idEl.innerHTML);
let quiz_id = parseInt(document.location.pathname.split('/')[document.location.pathname.split('/').length-1]);


let secondsLeft = 1;
let secondsPassed;
let score = 0;
let currentQuest = 0;

let scoreset = [];

let questions;
questQuest();

async function questQuest() {
  await fetch(`/api/quiztaker/${quiz_id}`)
    .then((questionJSON) => questionJSON.json())
    .then((questionData) => (questions = questionData));

  console.log(questions)
}

// console.log(questionsData)

// let questions = [
//   {
//     question: "What's my favorite color?",
//     answers: [
//       { text: 'Green', correct: false },
//       { text: 'Blue', correct: false },
//       { text: 'Red', correct: true },
//       { text: 'Black', correct: false },
//     ],
//   },
//   {
//     question: "What's my favorite band?",
//     answers: [
//       { text: 'Vampire Weekend', correct: true },
//       { text: 'The Strokes', correct: false },
//       { text: 'Glass Animals', correct: false },
//       { text: 'Bombay Bicyle Club', correct: false },
//     ],
//   },
//   {
//     question: 'What is my birthday? 🤨',
//     answers: [
//       { text: 'August 20', correct: false },
//       { text: 'August 21', correct: true },
//       { text: 'August 22', correct: false },
//       { text: 'August 24', correct: false },
//     ],
//   },
//   {
//     question: "What's my favorite food?",
//     answers: [
//       { text: 'Gyros', correct: false },
//       { text: 'Pizza', correct: false },
//       { text: 'Tacos', correct: true },
//       { text: 'Sushi', correct: false },
//     ],
//   },
//   {
//     question: "What's my dream vacation?",
//     answers: [
//       { text: 'Athens', correct: false },
//       { text: 'Iceland', correct: false },
//       { text: 'Tokyo', correct: true },
//       { text: 'Fiji', correct: false },
//     ],
//   },
//   {
//     question:
//       'Which TV Show would I pick if I could only watch one for the rest of my life?',
//     answers: [
//       { text: 'Midnight Gospel', correct: false },
//       { text: 'Game Of Thrones', correct: false },
//       { text: 'Parks and Rec', correct: true },
//       { text: 'The Office', correct: false },
//     ],
//   },
// ];

console.log(questions);

setTime();

startBtnEl.addEventListener('click', function () {
  secondsLeft = 1;
  removeStartBtn();
  timeBtnEl.setAttribute('style', 'display: flex');
  startGame();
});

function startGame() {
  questContainEl.setAttribute('style', 'display: flex');
  renderQuestions();
}

function setTime() {
  let timerInterval = setInterval(function () {
    if (secondsLeft > 0) {
      secondsLeft++;
    } else {
      endGame();
    }
    timerEl.textContent = secondsLeft + ' seconds';
  }, 1000);
  if (secondsLeft <= 0) {
    clearInterval(timerInterval);
    endGame();
    return;
  }
}

function removeStartBtn() {
  startBtnEl.setAttribute('style', 'display:none');
  //   instructEl.setAttribute("style", "display:none")
}

function renderQuestions() {
  questEl.textContent = questions[currentQuest].question;
  answerBtnAEl.textContent = questions[currentQuest].response_1;
  answerBtnBEl.textContent = questions[currentQuest].response_2;
  answerBtnCEl.textContent = questions[currentQuest].response_3;
  answerBtnDEl.textContent = questions[currentQuest].response_4;

  if (secondsLeft < 0) {
    endGame();
  } else {
  }
  for (let i = 0; i < answerBtnsEl.length; i++) {
    
    let crespNumb = questions[currentQuest].correct_response;
    let crespIndex = crespNumb - 1
    
    if (i === crespIndex) {
      answerBtnsEl[i].classList.add('correct');
    }
  }

  answerBtnAEl.addEventListener('click', checkValidity);
  answerBtnBEl.addEventListener('click', checkValidity);
  answerBtnCEl.addEventListener('click', checkValidity);
  answerBtnDEl.addEventListener('click', checkValidity);
}

function checkValidity(chose) {
  let chosenA = chose.target;
  if (chosenA.classList.contains('correct')) {
    score++;
    console.log(score);
  } else {
    console.log(score);
    secondsLeft = secondsLeft + 10;
  }

  resetQA();
  currentQuest++;
  if (currentQuest < questions.length) {
    renderQuestions();
  } else {
    secondsPassed = secondsLeft;
    endGame();
  }
}

function resetQA() {
  if (answerBtnAEl.classList.contains('correct')) {
    answerBtnAEl.classList.remove('correct');
  }
  if (answerBtnBEl.classList.contains('correct')) {
    answerBtnBEl.classList.remove('correct');
  }
  if (answerBtnCEl.classList.contains('correct')) {
    answerBtnCEl.classList.remove('correct');
  }
  if (answerBtnDEl.classList.contains('correct')) {
    answerBtnDEl.classList.remove('correct');
  }
  return;
}

async function endGame() {
  questContainEl.setAttribute('style', 'display: none');
  endScreenEl.setAttribute('style', 'display: flex');
  timeBtnEl.setAttribute('style', 'display: hidden');

  let time = secondsPassed;
  

  finalScoreEl.textContent =
    'Final score: ' +
    score +
    '\n | \n Time: ' +
    secondsPassed +
    '\n | \n Username: ' + username;

  scoreset.push({ quiz_id, user_id, score, time });

  console.log(scoreset);
  console.log(JSON.stringify(scoreset));

  if (scoreset) {
    const response = await fetch(`/api/score/`, {
      method: 'POST',
      body: JSON.stringify({quiz_id, user_id, score, time}),
      // body: JSON.stringify(scoreset),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      // document.location.replace('/profile');
      console.log("Score added")

    } else {
      alert('Failed to create score data');
    }
  }
}

HighSBtnEl.addEventListener('click', function (event) {
  event.preventDefault();
  secondsLeft = 0;
  removeStartBtn();
  endGame();
});

let userInput = document.querySelector('#initialsText');
let highscorelog = document.querySelector('#highscorelog');
let playAgainBtnEl = document.querySelector('.playAgain');

let highscores = [];

const quizPagehandler = function (event) {
  event.preventDefault();

  secondsLeft = 1;
  currentQuest = 0;
  score = 0;
  endScreenEl.setAttribute('style', 'display: none');

  const qid = parseInt(
    document.location.pathname.split('/')[
      document.location.pathname.split('/').length - 1
    ]
  );

  document.location.replace(`/quiz/${qid}`);
};

document
.querySelector('.playAgain')
.addEventListener('click', quizPagehandler);

