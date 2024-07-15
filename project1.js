document.addEventListener('DOMContentLoaded', () => {
    const images = [
        'Dog.png', 'Dog.png', 'Cat.png', 'Cat.png', 
        'Pig.png', 'Pig.png', 'Cow.png', 'Cow.png', 
        'Bird.png', 'Bird.png', 'Rabbit.png', 'Rabbit.png', 
        'Bear.png', 'Bear.png', 'Chicken.png', 'Chicken.png'
    ];

    let shuffledImages = shuffleArray(images);
    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;
    let timer;
    let timerInterval;
    let score = 0;
    let combo = 0;

    const gameBoard = document.getElementById('game-board');
    const startButton = document.getElementById('start-button');
    const timerDisplay = document.getElementById('timer');
    const scoreDisplay = document.getElementById('score');
    const scoreChangeDisplay = document.getElementById('score-change');

    startButton.addEventListener('click', startGame);

    function startGame() {
        startButton.style.display = 'none';
        gameBoard.innerHTML = '';
        shuffledImages = shuffleArray(images);
        score = 0;
        combo = 0;
        updateScoreDisplay();
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

    function showAllCards() {
        document.querySelectorAll('.card').forEach(card => card.classList.add('flipped'));
        setTimeout(() => {
            document.querySelectorAll('.card').forEach(card => card.classList.remove('flipped'));
            startTimer();
        }, 3000);
    }

    function startTimer() {
        timer = 60;
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

            /** 점수 기능 (정답 시) */
            combo += 1; // 콤보 증가
            let addedScore = 30 + (combo - 1) * 15; // 기본 매칭 성공 점수 + 콤보 점수
            score += addedScore;
            showScoreChange(`+${addedScore} ${combo > 1 ? 'Combo!' : ''}`);
            updateScoreDisplay();
            /***/

            if (document.querySelectorAll('.card.matched').length === images.length) {
                clearInterval(timerInterval);
                setTimeout(() => {
                    alert(`모든 카드를 맞췄습니다! 최종 점수: ${score}`);
                    startButton.style.display = 'block';
                    gameBoard.innerHTML = '';
                }, 500);
            }
        } else {
            unflipCards();

            /** 점수 기능 (오답 시) */
            const deductedScore = -10;
            score = Math.max(score + deductedScore, 0); // 점수가 0 이하로 내려가지 않도록 함
            combo = 0; // 콤보 리셋
            if (scoreDisplay.textContent != 0) // 점수가 내려갈 때만 -10 표시
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

    function showMismatch() {
        firstCard.classList.add('mismatched');
        secondCard.classList.add('mismatched');
        setTimeout(() => {
            firstCard.classList.remove('flipped', 'mismatched');
            secondCard.classList.remove('flipped', 'mismatched');
            resetBoard();
        }, 1000);
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
        scoreDisplay.textContent = `${score}`;
    }

    function showScoreChange(change) {
        scoreChangeDisplay.textContent = change;
        scoreChangeDisplay.style.opacity = 1;
        setTimeout(() => {
            scoreChangeDisplay.style.opacity = 0;
        }, 1000); // 1초 후에 점수 변화 표시 숨김
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
        alert(`시간 종료! 게임 오버. 최종 점수: ${score}`);
        startButton.style.display = 'block';
        gameBoard.innerHTML = '';
        clearInterval(timerInterval);
    }
});
