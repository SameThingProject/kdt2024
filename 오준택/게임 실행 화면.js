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
    let isRunning = false;

    const backButton = document.getElementById('backbutton');
    const header = document.getElementById('header');
    const container = document.getElementById('container');
    const startbg = document.getElementById('start-bg');
    const hintButton = document.getElementById('hint-button'); // 힌트 버튼 참조
    const gameBoard = document.getElementById('game-board');
    const startButton = document.getElementById('start-button');
    const difficultySelection = document.getElementById('difficulty-selection');
    const timerDisplay = document.getElementById('timer');
    const scoreDisplay = document.getElementById('score');
    const scoreChangeDisplay = document.getElementById('score-change');
    const endScreen = document.getElementById('end-screen');
    const restartButton = document.getElementById('restart-button');
    const difficultyButtons = document.querySelectorAll('.difficulty-button');
    const difficultyDisplay = document.getElementById('difficulty-display');
    
    startButton.addEventListener('click', showDifficultySelection);
    difficultyButtons.forEach(button => {
        button.addEventListener('click', () => selectDifficulty(button.dataset.difficulty));
    });
    restartButton.addEventListener('click', restartGame);
    backButton.addEventListener('click', restartGame);

    function showDifficultySelection() {
        startbg.classList.add('hidden');
        startButton.classList.add('hidden');
        difficultySelection.classList.remove('hidden');
    }

    function selectDifficulty(difficulty) {
        selectedDifficulty = difficulty;
        difficultySelection.classList.add('hidden');
        difficultyDisplay.textContent = `<LEVEL> ${difficulty}`;
        difficultyDisplay.classList.remove('hidden');
        container.classList.remove('hidden');
        startGame();
    }

    function startGame() {
        isRunning = true;
        if (timerInterval) {
            clearInterval(timerInterval); // 기존 타이머 인터벌 초기화
        }
        endScreen.classList.add('hidden');
        timerDisplay.classList.remove('hidden');
        scoreDisplay.classList.remove('hidden');
        scoreChangeDisplay.classList.remove('hidden');
        header.classList.remove('hidden');
        backButton.classList.remove('hidden');
        hintButton.classList.remove('hidden'); // 힌트 버튼 활성화
        gameBoard.innerHTML = '';
        shuffledImages = getShuffledImages(selectedDifficulty);
        score = 0;
        combo = 0;

        timerDisplay.textContent = "제한 시간: 03:00";
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
        setTimeout(() => {
            showAllCards();
        }, 1000)
    }

    function restartGame() {
        clearInterval(timerInterval); // 타이머 인터벌 초기화
        header.classList.add('hidden');
        difficultySelection.classList.remove('hidden');
        hintButton.classList.add('hidden');
        endScreen.classList.add('hidden');
        gameBoard.innerHTML = '';
        hintcnt = 3;
        hintButton.innerHTML = `Hint: ${hintcnt}`;

    }

    function getShuffledImages(difficulty) {
        let selectedImages;
        if (difficulty === 'Easy') {
            selectedImages = images.slice(0, 8);
        } else if (difficulty === 'Normal') {
            selectedImages = images.slice(0, 12);
        } else if (difficulty === 'Hard') {
            selectedImages = images.slice(0, 16);
        }

        selectedImages = selectedImages.concat(selectedImages);
        return shuffleArray(selectedImages);
    }
    
    function showAllCards() {
        isRunning = true;
        document.querySelectorAll('.card').forEach(card => card.classList.add('flipped'));
        setTimeout(() => {
            document.querySelectorAll('.card').forEach(card => card.classList.remove('flipped'));
            isRunning = true;
            startTimer();
        }, 3000);
    }

    function startTimer() {
        isRunning = false;
        timer = 2;
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
        if (lockBoard || isRunning) return;
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
        scoreDisplay.textContent = `SCORE : ${score}`;
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

    let hintcnt = 3; // 힌트 갯수 (재시작 시 초기화 코드 수정 필요)
    hintButton.innerHTML = `Hint: ${hintcnt}`;

    hintButton.addEventListener('click', showHint);

    function showHint() {
        if(isRunning) return; // 카드 보여주는 동안은 클릭 X
        if (hintcnt === 0) return; // 남은 힌트가 없으면 리턴
        
        isRunning = true;
        resetBoard(); // 클릭된 카드 리셋
        document.querySelectorAll('.card').forEach(card => card.classList.add('flipped')); // 카드 보여주기
        setTimeout(() => {
            document.querySelectorAll('.card').forEach(card => {
                if (card.classList.contains('matched')) return; // 이미 맞힌 카드 제외하고 다시 뒤집기
                card.classList.remove('flipped');
                card.querySelector('.card-back').style.backgroundColor = ''; // 빨간 배경 남아있는 오류 해결
                isRunning = false;
            });
        }, 2000); // 2초 뒤 해제

        hintcnt--;
        hintButton.innerHTML = `Hint: ${hintcnt}`;
    }

    function endGame() {
        endScreen.classList.remove('hidden');
        startButton.style.display = 'none';
        gameBoard.classList.add('hidden');
        gameBoard.innerHTML = '';
        hintButton.classList.add('hidden'); // 힌트 버튼 비활성화
        timerDisplay.classList.add('hidden');
        scoreDisplay.classList.add('hidden');
        header.classList.add('hidden');
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
