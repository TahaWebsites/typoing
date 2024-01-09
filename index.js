// DOM imports
let timerContainer = document.querySelector('.timer-container')
let selecterContainer = document.querySelector('.selector-container')
let mainContainer = document.querySelector('.main-container')
let resutlsContainer = document.querySelector('.results-container');
let text = document.querySelector('.main-container-para');
let input = document.querySelector('.input');
let timeText = document.querySelector('.timeText');
let timeOptions = document.querySelectorAll('.timeli');
let wpmresult = document.querySelector('.wpm-result');
let accresult = document.querySelector('.acc-result');
let rawresult = document.querySelector('.raw-result');
let timeresult = document.querySelector('.time-result');

// Function to fetch random paragraphs from Bacon Ipsum API
async function getRandomParagraphs(paragraphCount) {
    try {
        const response = await fetch(`https://baconipsum.com/api/?type=all-meat&paras=${paragraphCount}`);
        const data = await response.json();
        return data.join('\n\n');


    } catch (error) {
        console.error('Error fetching paragraphs:', error);
        return null;
    }
}

let correctchar = 0;
let worngchar = 0;

// Displaying the randomm words
const paragraphCount = 2;
getRandomParagraphs(paragraphCount)
    .then((result) => {
        if (result) {
            text.textContent = result;

            // converts all letters to span
            function spanText() {
                let copiedText = text.textContent;
                text.innerText = '';
                let resultHtml = '';
                for (let i = 0; i < copiedText.length; i++) {
                    if (i == 0) {
                        resultHtml = `<span> ${copiedText[i]} </span>`;
                    } else {
                        if (copiedText[i] == ' ') {
                            resultHtml += `<span class="space"> ${copiedText[i]} </span>`;
                        } else {
                            resultHtml += `<span> ${copiedText[i]} </span>`;
                        }
                    }
                }

                text.innerHTML = resultHtml;
            }

            spanText();

            // color changing function in para text
            let letters = document.querySelectorAll('.main-container-para span');

            let maxlen = 0;
            input.addEventListener('input', () => {


                if (input.value.length > maxlen) {
                    maxlen = input.value.length;
                }
                else {
                    alert('You cheated');
                    location.reload();
                }
                const inputValue = input.value.trim();
                const spanText = letters[inputValue.length - 1].textContent.trim();

                // console.log(inputValue, spanText);
                // console.log(inputValue === spanText);

                if (inputValue[inputValue.length - 1] === spanText) {
                    letters[inputValue.length - 1].classList.add('match');
                    correctchar++;
                } else {
                    letters[inputValue.length - 1].classList.add('no-match');
                    worngchar++;
                }
            });

        }
    });


// preventing user from erasing text and other similar operations
document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});
input.addEventListener('keydown', function (e) {
    if (e.key === 'Backspace') {
        e.preventDefault();
    }
});
input.addEventListener('keydown', function (e) {
    if (e.key === 'Delete') {
        e.preventDefault();
    }
});
input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault();
    }
});

// timer Text configurations
let timer = 60;
let duptimer;
timeText.innerText = timer + ` secs`;

let timerRunning = false;

timeOptions.forEach((t) => {
    t.addEventListener('click', () => {
        t.style.backgroundColor = '#C5A119';
        t.style.color = 'black';
        timeOptions.forEach((tall) => {
            if (t == tall) {
                t.style.backgroundColor = '#C5A119';
                t.style.color = 'black';
            }
            else {
                tall.style.backgroundColor = '#26282b';
                tall.style.color = '#D1D0C5';
            }
        })
        if (!timerRunning) {
            timer = parseInt(t.textContent);
            duptimer = timer;
            timeText.innerText = timer + ` secs`;
        }
    });
});


// Timer Configurations and  Results Calculations
let wpm = 0;
let accuracy = 0;

input.addEventListener('input', () => {
    timerRunning = true;
    if (input.value.length == 1) {
        timeText.style.color = 'red';
        const intervalId = setInterval(() => {
            timeText.innerText = timer + ` secs`;

            if (timer === 0) {
                clearInterval(intervalId);
                timerRunning = false;
                timerContainer.style.display = 'none';
                selecterContainer.style.display = 'none';
                mainContainer.style.display = 'none';
                resutlsContainer.style.display = 'flex';

                // results testing
                let allEntries = input.value.length;
                
                if(duptimer == 15) {
                    wpm = (allEntries/5)*4;
                }
                else if(duptimer == 30) {
                    wpm = (allEntries/5)*2;
                }
                else if(duptimer == 60) {
                    wpm = (allEntries/5);
                }
                else if(duptimer == 120) {
                    wpm = (allEntries/5)/2;
                }

                accuracy = (correctchar/allEntries) * 100;

                wpmresult.textContent = wpm;
                accresult.textContent = accuracy.toFixed(2) + `%`;
                rawresult.textContent = wpm;
                timeresult.textContent = duptimer + ` secs`;

            } else {
                timer--;
            }
        }, 1000);
    }
});
