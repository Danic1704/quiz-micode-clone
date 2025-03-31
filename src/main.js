// @ts-nocheck
import "./style.css";
import {Questions} from "./questions";

const app = document.querySelector("#app");

const TIMEOUT = 4000;

const startButton = document.querySelector("#start");

startButton.addEventListener("click", startQuiz);
function startQuiz(){
  let currentQuestion = 0;
  let score= 0;

clean ();

  displayQuestion(currentQuestion)
  
  function clean(){
    while (app.firstElementChild) {
      app.firstElementChild.remove();
    }
    const progress = getProgressBar(Questions.length, currentQuestion);
    app.appendChild(progress);
  }


    function displayQuestion(index) {
    clean();
  
    // Vérifiez si l'index est valide
    // if (isNaN(index) || index < 0 || index >= Questions.length) {
    //   console.error(`Index ${index} est invalide ou NaN. Questions.length = ${Questions.length}`);
    //   displayFinishMessage();
    //   return;
    // }

  
    const question = Questions[index];
  
    if (!question) {
      console.error(`La question à l'index ${index} est introuvable.`);
      displayFinishMessage();
      return;
    }
  
    const title = getTittleElement(question.question);
    app.appendChild(title);
  
    const answerDiv = createAnswer(question.answers);
    app.appendChild(answerDiv);
  
    const submitButton = getSubmitButton();
    submitButton.addEventListener("click", submit);
    app.appendChild(submitButton);
  }
  function displayFinishMessage(index) {
    clean();
    const h1 = document.createElement("h1");
    h1.innerHTML = `Bravo ! Tu as terminé le quiz.`;
    const p = document.createElement("p");
    p.innerHTML =`Tu as eu  ${score} sur ${Questions.length} !`;
    app.appendChild(h1);
    app.appendChild(p);
    const button = document.createElement("button");
    button.innerText = "Recommencer";
    button.addEventListener("click", startQuiz);
    app.appendChild(button);


  }

  function submit() {
    
    const selectedAnswer = app.querySelector("input[name='answer']:checked"); 

    disableAllAnswers();

    if (!selectedAnswer) {
      alert("Veuillez sélectionner une réponse !");
      return;
    }

    const value = selectedAnswer.value;

    const question = Questions[currentQuestion];
    
     const isCorrect = question.correct === value;

    if (isCorrect) {
      score++;
    }
    showFeedback(isCorrect, question.correct, value);
    displayNextQuestionButton(() => {
      currentQuestion++;
      displayQuestion(currentQuestion);
    });
    const feedback = getFeedBackMessage(isCorrect, question.correct);
    app.appendChild(feedback);

  } 
  
 
  
 
  function createAnswer(answers) { 
    const answerDiv = document.createElement('div');
    answerDiv.classList.add("answers");

    for (const answer of answers) {
      // Utiliser getAnswerElement pour créer un label avec un input
      const label = getAnswerElement(answer);
      answerDiv.appendChild(label);
    }

    return answerDiv;
  }
  function getTittleElement(text) {
    const title = document.createElement("h3");
    title.innerText = text;
    return title;
  }
  function formatId(text){
    return text.replaceAll(" ", "").toLowerCase();
  }

  function getAnswerElement(text) {
    const label = document.createElement("label"); 
    label.innerText = text;
    const input = document.createElement("input");
    const id = formatId(text);
    input.id = id;
    label.htmlFor = id;
    input.type = "radio";
    input.name = "answer";
    input.value = text;
    label.appendChild(input);
    return label;
  }
  
  function getSubmitButton (){
    const submitButton = document.createElement("button");
    submitButton.innerText = "Submit";
    submitButton.type = "submit";
    return submitButton;
  }


  function showFeedback(isCorrect, correct, answer) {
    const correctAnswerId = formatId(correct);
    const correctElement = document.querySelector(`label[for='${correctAnswerId}']`);
  
    const selectedAnswerId = formatId(answer);
    const selectedElement = document.querySelector(`label[for='${selectedAnswerId}']`);
  
    
    correctElement.classList.add('correct');
    selectedElement.classList.add(isCorrect ? 'correct' : 'incorrect');
  
   

  }

  function getFeedBackMessage(isCorrect, correct){
    const paragraph = document.createElement("p");
    paragraph.innerText = isCorrect ? `Great ! Good answer. `: `Sorry, your answer was incorrect. The correct answer is ${correct}`;

    return paragraph;
  }

  function getProgressBar(max, value){
    const progress = document.createElement("progress");
    progress.max = Questions.length;
    progress.value = currentQuestion;
    return progress;

  }
}
function displayNextQuestionButton(callback){
  let remainingTimeout = TIMEOUT;
  
  app.querySelector("button").remove();

  const getButtonText = () => `Next (${remainingTimeout / 1000}s)`;


  const nextButton = document.createElement("button");
  nextButton.innerText = getButtonText();
  app.appendChild(nextButton);

  const interval = setInterval(() => {
    remainingTimeout -= 1000;
    nextButton.innerText = getButtonText(); 
  }, 1000);

  const timeout = setTimeout(() => {
    handlNextQuestion();
  }, TIMEOUT);

  const handlNextQuestion = () => {
    clearInterval(interval)
    clearTimeout(timeout);
    callback();
  };  

  nextButton.addEventListener("click", () => {
    handlNextQuestion();
  });

}

function disableAllAnswers(){
const radioInputs = document.querySelectorAll('input[type="radio"]');

  for (const radio of radioInputs){
    radio.disabled = true;
  }
}

