document.addEventListener('DOMContentLoaded', () => {
    const images = [
        'Dog.png', 'Cat.png', 'Pig.png', 'Cow.png', 
        'Bird.png', 'Rabbit.png', 'Bear.png', 'Chicken.png',
        'Elephant.png', 'Horse.png', 'Lion.png', 'Giraffe.png',
        'Panda.png', 'Wolf.png', 'Sheep.png', 'Kangaroo.png',
        'Whale.png', 'Rinoceros.png'
    ];

    let shuffledImages = [];
    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;
    let timer;
    let timerInterval;
    let score;
    let combo;
    let selectedDifficulty;

    const container = document.getElementById('container');
    const startbg = document.getElementById('start-bg');
    const gameBoard = document.getElementById('game-board');
    const startButton = document.getElementById('start-button');
    const difficultySelection = document.getElementById('difficulty-selection');
    const timerDisplay = document.getElementById('timer');
    const scoreDisplay = document.getElementById('score');
    const scoreChangeDisplay = document.getElementById('score-change');
    const endScreen = document.getElementById('end-screen');
    const restartButton = document.getElementById('restart-button');
    const difficultyButtons = document.querySelectorAll('.difficulty-button');

    startButton.addEventListener('click', showDifficultySelection);
    difficultyButtons.forEach(button => {
        button.addEventListener('click', () => selectDifficulty(button.dataset.difficulty));
    });
    restartButton.addEventListener('click', restartGame);

    function showDifficultySelection() {
        startbg.classList.add('hidden');
        startButton.classList.add('hidden');
        difficultySelection.classList.remove('hidden');
    }

    function selectDifficulty(difficulty) {
        selectedDifficulty = difficulty;        
        difficultySelection.classList.add('hidden');
        container.classList.remove('hidden');
        startGame();
    }

    function startGame() {
        if (timerInterval) {
            clearInterval(timerInterval); // 기존 타이머 인터벌 초기화
        }
        endScreen.classList.add('hidden');
        timerDisplay.classList.remove('hidden');
        scoreDisplay.classList.remove('hidden');
        scoreChangeDisplay.classList.remove('hidden');

        gameBoard.innerHTML = '';
        shuffledImages = getShuffledImages(selectedDifficulty);
        score = 0;
        combo = 0;

        timerDisplay.textContent = "제한 시간: 01:00";
        updateScoreDisplay();

        gameBoard.className = ''; // 기존 클래스 초기화
        gameBoard.classList.add(`board-${selectedDifficulty}`); // 난이도에 맞는 클래스 추가

        shuffledImages.forEach(image => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.innerHTML = `
                <div class="card-content card-front"></div>
                <div class="card-content card-back" style="background-image: url('images/${image}')"></div>
            `;
            cardElement.dataset.image = image;
            cardElement.addEventListener('click', flipCard);
            gameBoard.appendChild(cardElement);
        });
        showAllCards();
    }

    function restartGame() {
        clearInterval(timerInterval); // 타이머 인터벌 초기화
        timerDisplay.classList.add('hidden');
        scoreDisplay.classList.add('hidden');
        scoreChangeDisplay.classList.add('hidden');
        difficultySelection.classList.remove('hidden');
        endScreen.classList.add('hidden');
    }

    function getShuffledImages(difficulty) {
        let selectedImages;
        if (difficulty === 'easy') {
            selectedImages = images.slice(0, 8);
        } else if (difficulty === 'normal') {
            selectedImages = images.slice(0, 12);
        } else if (difficulty === 'hard') {
            selectedImages = images.slice(0, 16);
        }

        // 두 개씩 추가하여 배열 길이 맞추기
        selectedImages = selectedImages.concat(selectedImages);
        return shuffleArray(selectedImages);
    }

    function showAllCards() {
        document.querySelectorAll('.card').forEach(card => card.classList.add('flipped'));
        setTimeout(() => {
            document.querySelectorAll('.card').forEach(card => card.classList.remove('flipped'));
            startTimer();
        }, 3000);
    }

    function startTimer() {
        timer = 180;
        timerInterval = setInterval(() => {
            timer--;
            const minutes = Math.floor(timer / 60);
            const seconds = timer % 60;
            timerDisplay.textContent = `남은 시간: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

            if (timer === 0) {
                clearInterval(timerInterval);
                endGame();
            }
        }, 1000);
    }

    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;

        this.classList.add('flipped');

        if (!firstCard) {
            firstCard = this;
            return;
        }

        secondCard = this;
        lockBoard = true;

        checkForMatch();
    }

    function checkForMatch() {
        if (firstCard.dataset.image === secondCard.dataset.image) {
            disableCards();
            resetBoard();

            combo += 1;
            let addedScore = 30 + (combo - 1) * 15;
            score += addedScore;
            showScoreChange(`+${addedScore} ${combo > 1 ? 'Combo!' : ''}`);
            updateScoreDisplay();

            if (document.querySelectorAll('.card.matched').length === shuffledImages.length) {
                clearInterval(timerInterval);
                setTimeout(() => {
                    endGame();
                }, 500);
            }
        } else {
            unflipCards();

            const deductedScore = -10;
            score = Math.max(score + deductedScore, 0);
            combo = 0;
            if (scoreDisplay.textContent != 0)
                showScoreChange(deductedScore);
            updateScoreDisplay();
        }
    }

    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        resetBoard();
    }

    function resetBoard() {
        [firstCard, secondCard, lockBoard] = [null, null, false];
    }

    function unflipCards() {
        firstCard.querySelector('.card-back').style.backgroundColor = 'red';
        secondCard.querySelector('.card-back').style.backgroundColor = 'red';
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            firstCard.querySelector('.card-back').style.backgroundColor = '';
            secondCard.querySelector('.card-back').style.backgroundColor = '';
            resetBoard();
        }, 1000);
    }

    function updateScoreDisplay() {
        scoreDisplay.textContent = `점수: ${score}`;
    }

    function showScoreChange(change) {
        scoreChangeDisplay.textContent = change;
        scoreChangeDisplay.style.opacity = 1;
        setTimeout(() => {
            scoreChangeDisplay.style.opacity = 0;
        }, 1000);
    }

    function shuffleArray(array) {
        let currentIndex = array.length, randomIndex;

        while (currentIndex != 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }

        return array;
    }

    function endGame() {
        endScreen.classList.remove('hidden');
        startButton.style.display = 'none';
        gameBoard.innerHTML = '';
        clearInterval(timerInterval);
    }
});

// 모달 표시 함수
function showModal() {
    var modal = document.getElementById("modal");
    modal.style.display = "block";
}

// help 버튼 클릭 시 모달 표시
document.getElementById("help").onclick = function() {
    showModal();
}

// 모달 닫기 버튼 설정
var closeModal = document.getElementById("closeModal");
closeModal.onclick = function() {
    var modal = document.getElementById("modal");
    modal.style.display = "none";
}
