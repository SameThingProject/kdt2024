document.addEventListener('DOMContentLoaded', () => {
    // 이미지 배열
    const images = [
        'Dog.png', 'Cat.png', 'Pig.png', 'Cow.png', 
        'Bird.png', 'Rabbit.png', 'Bear.png', 'Chicken.png',
        'Elephant.png', 'Horse.png', 'Lion.png', 'Giraffe.png',
        'Panda.png', 'Wolf.png', 'Sheep.png', 'Kangaroo.png',
        'Whale.png', 'Rinoceros.png'
    ];
    const comboImages = [
        'wow_beaver.png', 'wow_cat.png', 'wow_giraffe.png', 'wow_person.png', 'wow.png', 'wow_good.png', 'wow_tiger.png'
    ];

    // 변수 초기화
    let shuffledImages = []; // 섞인 이미지 배열
    let firstCard = null; // 첫 번째로 선택된 카드
    let secondCard = null; // 두 번째로 선택된 카드
    let lockBoard = false; // 보드 잠금 상태
    let timer; // 게임 타이머
    let timerInterval; // 타이머 인터벌
    let score; // 현재 점수
    let combo; // 콤보 카운트
    let selectedDifficulty; // 선택된 난이도
    let isRunning = false; // 게임 실행 상태
    let hintcnt = 3; // 힌트 갯수 설정

    // DOM 요소 참조
    const winimg = document.getElementById('win-img');
    const loseimg = document.getElementById('lose-img');
    const backButton = document.getElementById('backbutton');
    const header = document.getElementById('header');
    const container = document.getElementById('container');
    const startbg = document.getElementById('start-bg');
    const hintButton = document.getElementById('hint-button');
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
    // 시작 버튼 클릭 시 난이도 선택 화면 표시
    startButton.addEventListener('click', showDifficultySelection);

    function showDifficultySelection() {
        startbg.classList.add('hidden');
        startButton.classList.add('hidden');
        difficultySelection.classList.remove('hidden');
    }

    // 난이도 선택 버튼 클릭 시 난이도 설정
    difficultyButtons.forEach(button => {
        button.addEventListener('click', () => selectDifficulty(button.dataset.difficulty));
    });

    function selectDifficulty(difficulty) {
        selectedDifficulty = difficulty;
        difficultySelection.classList.add('hidden');
        difficultyDisplay.textContent = `<LEVEL> ${difficulty}`;
        difficultyDisplay.classList.remove('hidden');
        container.classList.remove('hidden');
        startGame();
    }

    // 게임 시작
    function startGame() {
        isRunning = true;
        if (timerInterval) {
            clearInterval(timerInterval);
        }
        endScreen.classList.add('hidden');
        timerDisplay.classList.remove('hidden');
        scoreDisplay.classList.remove('hidden');
        scoreChangeDisplay.classList.remove('hidden');
        header.classList.remove('hidden');
        backButton.classList.add('hidden');
        hintButton.classList.remove('hidden');
        gameBoard.innerHTML = '';
        shuffledImages = getShuffledImages(selectedDifficulty);
        score = 0;
        combo = 0;

        lockBoard = false; // 보드 잠금 초기화
        scoreChangeDisplay.innerHTML = ''; // 이전 게임의 콤보 효과 초기화

        timerDisplay.textContent = "제한 시간: 02:00";
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

    // 뒤로가기 버튼 클릭 시 게임 재시작
    backButton.addEventListener('click', restartGame);

    // 난이도에 따라 이미지를 섞는 함수
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
    
    // 모든 카드를 보여주는 함수
    function showAllCards() {
        isRunning = true;
        document.querySelectorAll('.card').forEach(card => card.classList.add('flipped'));
        setTimeout(() => {
            document.querySelectorAll('.card').forEach(card => card.classList.remove('flipped'));
            isRunning = true;
            startTimer();
        }, 3000);
    }

    // 타이머 시작 함수
    function startTimer() {
        backButton.classList.remove('hidden');
        isRunning = false;
        timer = 120;
        timerInterval = setInterval(() => {
            timer--;
            const minutes = Math.floor(timer / 60);
            const seconds = timer % 60;
            timerDisplay.textContent = `남은 시간: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

            if (timer === 0) {
                clearInterval(timerInterval);
                endGame(false);
            }
        }, 1000);
    }

    // 카드 뒤집기 함수
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

    // 카드 일치 확인 함수
    function checkForMatch() {
        if (firstCard.dataset.image === secondCard.dataset.image) {
            disableCards();
            resetBoard();

            combo += 1;
            let addedScore = 30 + (combo - 1) * 15;
            score += addedScore;

            const comboText = `${combo > 1 ? `<span class="comboFont">${combo}</span> Combo!` : ''}
            <br><span class="scoreFont">+${addedScore} points! </span>`;
            const comboImage = getRandomComboImage();

            showScoreChange(comboText, comboImage);

            updateScoreDisplay();

            if (document.querySelectorAll('.card.matched').length === shuffledImages.length) {
                clearInterval(timerInterval);
                setTimeout(() => {
                    endGame(true);  // 성공시 success 파라미터를 true로 전달
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

    // 일치한 카드 비활성화 함수
    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        resetBoard();
    }

    // 보드 상태 초기화 함수
    function resetBoard() {
        [firstCard, secondCard, lockBoard] = [null, null, false];
    }

    // 일치하지 않은 카드 뒤집기 함수
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

    // 점수 표시 업데이트 함수
    function updateScoreDisplay() {
        scoreDisplay.textContent = `SCORE : ${score}`;
    }

    // 랜덤 콤보 이미지 선택 함수
    function getRandomComboImage() {
        const randomIndex = Math.floor(Math.random() * comboImages.length);
        return comboImages[randomIndex];
    }

    // 점수 변경 표시 함수
    function showScoreChange(change, comboImage) {
        const textElement = `<span class="combo-text">${change}</span>`;
        const imgElement = comboImage ? `<img class="combo-image" src="images/${comboImage}" alt="Combo Image">` : '';
        scoreChangeDisplay.innerHTML = `${imgElement} ${textElement}`;
        scoreChangeDisplay.style.opacity = 1;
        setTimeout(() => {
            scoreChangeDisplay.style.opacity = 0;
        }, 1000);
    }

    // 게임 종료 함수
    function shuffleArray(array) {
        let currentIndex = array.length, randomIndex;

        while (currentIndex != 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }

        return array;
    }

    // 힌트 버튼
    hintButton.innerHTML = `Hint: ${hintcnt}`;

    hintButton.addEventListener('click', showHint);

    function showHint() {
        if(isRunning) return;
        if (hintcnt === 0) return;
        
        isRunning = true;
        resetBoard();
        document.querySelectorAll('.card').forEach(card => card.classList.add('flipped')); // 카드 보여주기
        setTimeout(() => {
            document.querySelectorAll('.card').forEach(card => {
                if (card.classList.contains('matched')) return; // 이미 맞힌 카드 제외하고 다시 뒤집기
                card.classList.remove('flipped');
                card.querySelector('.card-back').style.backgroundColor = ''; // 빨간 배경 남아있는 오류 해결
                isRunning = false;
            });
        }, 2000);

        hintcnt--;
        hintButton.innerHTML = `Hint: ${hintcnt}`;
    }

    // 게임 종료 함수
    function endGame(success = false) {
        endScreen.classList.remove('hidden');
        startButton.style.display = 'none';
        gameBoard.classList.add('hidden');
        gameBoard.innerHTML = '';
        hintButton.classList.add('hidden');
        clearInterval(timerInterval);
    
        // 기존의 애니메이션 요소를 제거
        removeAnimations();
    
        // 폭죽 애니메이션 생성 (게임 성공 시)
        if (success) {
            createFireworks();
        }
    
        // 비 내리는 애니메이션 생성 (게임 실패 시)
        if (!success) {
            createRain();
        }
    
        // 기존의 resultMessage 요소를 제거
        const existingResultMessage = endScreen.querySelector('.result-message');
        if (existingResultMessage) {
            endScreen.removeChild(existingResultMessage);
        }
    
        const resultMessage = success ? '축하합니다! 당신이 이겼습니다!' : '시간이 다 됐습니다. 다시 도전해 보세요!';
        const resultMessageElement = document.createElement('div');
        resultMessageElement.textContent = resultMessage;
        resultMessageElement.classList.add('result-message');
        endScreen.appendChild(resultMessageElement);
    }
    
    // 폭죽 애니메이션 생성 함수
    function createFireworks() {
        winimg.classList.remove('hidden'); //추가
        const container = document.createElement('div');
        container.classList.add('fireworks-container');
        document.body.appendChild(container);  // body에 추가
    
        for (let i = 0; i < 20; i++) {
            const firework = document.createElement('div');
            firework.classList.add('firework');
            firework.style.left = `${Math.random() * 100}vw`;
            firework.style.top = `${Math.random() * 100}vh`;
            firework.style.width = `${Math.random() * 10 + 10}px`;
            firework.style.height = firework.style.width;
            firework.style.background = `radial-gradient(circle, #ff0, #f00)`; // 폭죽 색상
            firework.style.animationDuration = `${Math.random() * 1 + 0.5}s`;
            firework.style.animationDelay = `${Math.random() * 0.5}s`;
            firework.style.animationName = `explode, firework`;
            firework.style.animationTimingFunction = `ease-out`;
    
            container.appendChild(firework);
    
            // 애니메이션이 끝난 후 요소 제거
            firework.addEventListener('animationend', () => {
                firework.remove();
            });
        }
    }
    
    // 비 내리는 애니메이션 생성 함수
    function createRain() {
        loseimg.classList.remove('hidden'); //추가
        const container = document.createElement('div');
        container.classList.add('rain-container');
        document.body.appendChild(container);  // body에 추가
    
        for (let i = 0; i < 100; i++) {
            const drop = document.createElement('div');
            drop.classList.add('rain-drop');
            drop.style.left = `${Math.random() * 100}vw`;
            drop.style.animationDuration = `${Math.random() * 1 + 0.5}s`;
            drop.style.opacity = `${Math.random() * 0.5 + 0.5}`;
            container.appendChild(drop);
    
            // 애니메이션이 끝난 후 요소 제거
            drop.addEventListener('animationend', () => {
                drop.remove();
            });
        }
    }
    
    // 애니메이션을 제거하는 함수
    function removeAnimations() {
        const fireworksContainer = document.body.querySelector('.fireworks-container');
        const rainContainer = document.body.querySelector('.rain-container');
        if (fireworksContainer) fireworksContainer.remove();
        if (rainContainer) rainContainer.remove();
    }
    
    restartButton.addEventListener('click', restartGame);
    
    function restartGame() {
        clearInterval(timerInterval); // 타이머 인터벌 초기화
        winimg.classList.add('hidden');  //추가
        loseimg.classList.add('hidden'); //추가
        header.classList.add('hidden');
        difficultySelection.classList.remove('hidden');
        hintButton.classList.add('hidden');
        endScreen.classList.add('hidden');
        gameBoard.innerHTML = '';
        hintcnt = 3;
        hintButton.innerHTML = `Hint: ${hintcnt}`;
    
        // 애니메이션이 끝난 후 요소 제거
        removeAnimations();
    }
    
});

