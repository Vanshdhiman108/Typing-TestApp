// Sample texts for typing test
const texts = [
   "Life is just like coding - you try, fail, and try again. Sometimes the solution is simple, sometimes it's hidden. But every bug you fix makes you better.",
   "Success is not a one-time event, it's a process. It comes from showing up every single day. Even when motivation is low discipline keeps you moving.",
   "The internet is full of answers. But the right answer comes only when you ask the right question. So think sharp, and learn smarter.",
   "A good developer knows the syntax. A great developer knows how to solve problems. And the best developer never stops learning.", 
   "Sometimes, you need to take a break. The best ideas often come when you’re not looking for them.",
   "Challenges are not meant to stop you. They are meant to test your courage and patience. Overcome them, and you’ll discover your real strength.",
   "Creativity is intelligence having fun. Mix knowledge with imagination. That’s when innovation happens."
];

// Global variables
let currentText = '';
let currentIndex = 0;
let startTime = null;
let timeLeft = 60;
let timer = null;
let isActive = false;
let errors = 0;
let totalChars = 0;

// DOM elements
const textContent = document.getElementById('textContent');
const typingInput = document.getElementById('typingInput');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const wpmElement = document.getElementById('wpm');
const accuracyElement = document.getElementById('accuracy');
const charactersElement = document.getElementById('characters');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const timerElement = document.getElementById('timer');
const resultsModal = document.getElementById('resultsModal');
const tryAgainBtn = document.getElementById('tryAgainBtn');

// Load a random text for typing
function loadNewText() {
   currentText = texts[Math.floor(Math.random() * texts.length)];
   displayText();
}

// Display text with spans for each character
function displayText() {
   textContent.innerHTML = currentText
       .split('')
       .map((char, index) => 
           `<span class="char pending" data-index="${index}">${char}</span>`
       )
       .join('');
}

// Start the typing test
function startTest() {
   isActive = true;
   startTime = Date.now();
   typingInput.disabled = false;
   typingInput.placeholder = "Start typing...";
   typingInput.focus();
   startBtn.style.display = 'none';
   progressText.textContent = 'Test in progress...';
   startTimer();
}

// Start the countdown timer
function startTimer() {
   timer = setInterval(() => {
       timeLeft--;
       timerElement.querySelector('span').textContent = timeLeft;
       
       if (timeLeft <= 0) {
           endTest();
       }
   }, 1000);
}

// Handle typing input
function handleInput(e) {
   if (!isActive) return;
   
   const inputValue = e.target.value;
   currentIndex = inputValue.length;
   
   updateDisplay(inputValue);
   updateStats();
   updateProgress();
   
   if (currentIndex >= currentText.length) {
       endTest();
   }
}

// Update character display with correct/incorrect/current styling
function updateDisplay(inputValue) {
   const chars = document.querySelectorAll('.char');
   errors = 0;
   totalChars = currentIndex;
   
   chars.forEach((char, index) => {
       char.className = 'char';
       
       if (index < inputValue.length) {
           if (inputValue[index] === currentText[index]) {
               char.classList.add('correct');
           } else {
               char.classList.add('incorrect');
               errors++;
           }
       } else if (index === inputValue.length && index < currentText.length) {
           char.classList.add('current');
       } else {
           char.classList.add('pending');
       }
   });
}

// Update typing statistics
function updateStats() {
   const timeElapsed = (Date.now() - startTime) / 1000 / 60;
   const grossWPM = (currentIndex / 5) / timeElapsed;
   const netWPM = Math.max(0, Math.round(grossWPM - (errors / timeElapsed)));
   const accuracy = totalChars > 0 ? Math.round(((totalChars - errors) / totalChars) * 100) : 100;
   
   wpmElement.textContent = isFinite(netWPM) ? netWPM : 0;
   accuracyElement.textContent = accuracy;
   charactersElement.textContent = totalChars;
}

// Update progress bar
function updateProgress() {
   const progress = (currentIndex / currentText.length) * 100;
   progressFill.style.width = `${Math.min(progress, 100)}%`;
   
   if (progress >= 100) {
       progressText.textContent = 'Complete!';
   } else {
       progressText.textContent = `${Math.round(progress)}% complete`;
   }
}

// End the typing test
function endTest() {
   isActive = false;
   typingInput.disabled = true;
   clearInterval(timer);
   
   // Final stats update
   updateStats();
   
   // Show results modal
   showResults();
}

// Show results modal with final stats
function showResults() {
   const finalWpm = wpmElement.textContent;
   const finalAccuracy = accuracyElement.textContent;
   const finalCharacters = charactersElement.textContent;
   
   document.getElementById('finalWpm').textContent = finalWpm;
   document.getElementById('finalAccuracy').textContent = finalAccuracy;
   document.getElementById('finalCharacters').textContent = finalCharacters;
   
   resultsModal.classList.add('show');
}

// Reset the typing test
function resetTest() {
   isActive = false;
   currentIndex = 0;
   errors = 0;
   totalChars = 0;
   timeLeft = 60;
   startTime = null;
   
   clearInterval(timer);
   
   typingInput.value = '';
   typingInput.disabled = true;
   typingInput.placeholder = "Click start to begin typing...";
   startBtn.style.display = 'inline-flex';
   timerElement.querySelector('span').textContent = '60';
   progressText.textContent = 'Ready to start';
   
   wpmElement.textContent = '0';
   accuracyElement.textContent = '100';
   charactersElement.textContent = '0';
   progressFill.style.width = '0%';
   
   loadNewText();
   resultsModal.classList.remove('show');
}

// Close results modal and reset
function closeResults() {
   resultsModal.classList.remove('show');
   resetTest();
}

// Event listeners
startBtn.addEventListener('click', startTest);
resetBtn.addEventListener('click', resetTest);
typingInput.addEventListener('input', handleInput);
typingInput.addEventListener('paste', (e) => e.preventDefault());
tryAgainBtn.addEventListener('click', closeResults);

// Initialize the app when page loads
document.addEventListener('DOMContentLoaded', () => {
   loadNewText();
});
