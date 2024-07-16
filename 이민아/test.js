document.addEventListener('DOMContentLoaded', () => {
    const imagesArray  = [
        'Ant','Ant',
        'Bear','Bear',
        'Cat','Cat',
        'Deer','Deer',
        'Elephant','Elephant',
        'Falcon','Falcon',
        'Giraffe','Giraffe',
        'Horse','Horse',
    ];

    let shuffledCards = new Array();
    let firstCard = null;
    let secondCard = null;
    let lockBoard = true;
    const gameBoard = document.getElementById('game-board');
    const startButton = document.getElementById('start-button');

/** 레벨 선택 */

    const imageArrayEasy  = [
        'Ant','Ant','Bear','Bear',
        'Cat','Cat','Deer','Deer',
        'Elephant','Elephant','Falcon','Falcon',
        'Giraffe','Giraffe','Horse','Horse',
    ]; // 16개
    const imageArrayNormal  = [
        'Ant','Ant','Bear','Bear',
        'Cat','Cat','Deer','Deer',
        'Elephant','Elephant','Falcon','Falcon',
        'Giraffe','Giraffe','Horse','Horse',
        'Insect','Insect','Kangaroo','Kangaroo',
        'Leopard','Leopard','Mite','Mite',
    ]; // 24개
    const imageArrayHard  = [
        'Ant','Ant','Bear','Bear',
        'Cat','Cat','Deer','Deer',
        'Elephant','Elephant','Falcon','Falcon',
        'Giraffe','Giraffe','Horse','Horse',
        'Insect','Insect','Kangaroo','Kangaroo',
        'Leopard','Leopard','Mite','Mite',
        'Octopus','Octopus','Panda','Panda',
        'Rabbit','Rabbit','Sheep','Sheep',
        'Turtle','Turtle','Unicorn','Unicorn',
        'Whale','Whale','Wolf','Wolf',
    ]; // 40개

    const levelSelector = document.getElementById('level-selector');
    const easyButton = document.getElementById('easy-button');
    const normalButton = document.getElementById('normal-button');
    const hardButton = document.getElementById('hard-button');

    startButton.addEventListener('click', () => { // 게임 시작 버튼 클릭
        levelSelector.style.display = "block"; // 레벨 버튼 활성화
    });

    easyButton.addEventListener('click', () => { // easy 버튼 클릭
        levelSelector.style.display = "none"; // 레벨 버튼 삭제
        gameBoard.style.gridTemplateColumns = "repeat(4, 100px)"; // 4열
        startGame(imageArrayEasy);
    });
    normalButton.addEventListener('click', () => { // normal 버튼 클릭
        levelSelector.style.display = "none"; // 레벨 버튼 삭제
        gameBoard.style.gridTemplateColumns = "repeat(6, 100px)"; // 6열
        startGame(imageArrayNormal);
    });
    hardButton.addEventListener('click', () => { // hard 버튼 클릭
        levelSelector.style.display = "none"; // 레벨 버튼 삭제
        gameBoard.style.gridTemplateColumns = "repeat(10, 100px)"; // 10열
        startGame(imageArrayHard);
    });

/** */

/**점수 기능
    const scoreDisplay = document.getElementById('score');
    const scoreChangeDisplay = document.getElementById('score-change');
          
    let score = 0; // 총 점수
    let increment = 1; // 초기 포인트 증가량

    // 점수 변화 표시
    function updateScoreDisplay() {
        scoreDisplay.textContent = score;
    }
    function showScoreChange(change) {
        scoreChangeDisplay.textContent = change;
        scoreChangeDisplay.style.opacity = 1;
        setTimeout(() => {
            scoreChangeDisplay.style.opacity = 0;
        }, 1000); // 1초 후에 점수 변화 표시 숨김
    }
*/

    // 게임 시작 버튼 클릭
    startButton.addEventListener('click', () => {
        // start-button 비활성화
        startButton.style.display = "none";

    });

    function startGame(array) {

        // 점수 활성화
        document.getElementById('score-text').style.display = "block";

        // 배열 셔플
        shuffledCards = shuffleArray(array);

        // 카드 div 요소 생성
        shuffledCards.forEach(cardValue => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.innerHTML = `
                <div class="card-content card-front"></div>
                <div class="card-content card-back"><img src="images/${cardValue}.png"></div>
            `;
            cardElement.dataset.value = cardValue;
            cardElement.addEventListener('click', flipCard);
            gameBoard.appendChild(cardElement);
        });
        document.querySelectorAll('.card').forEach(card => card.classList.add('flipped'));
        
        // 게임 시작 전 카드 미리보기
        setTimeout(() => {
            document.querySelectorAll('.card').forEach(card => card.classList.remove('flipped'));
            lockBoard = false;
        }, 3000);
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
        if (firstCard.dataset.value === secondCard.dataset.value) {
            disableCards();
            resetBoard();
        
        /**점수 기능(정답 시) 
            const addedScore = increment;
            score += addedScore;
            increment = Math.min(increment + 1, 3); // 점수 증가량을 최대 3으로 제한
            showScoreChange(`+${addedScore}`);
            updateScoreDisplay();
        */
        } else {
            unflipCards();

        /**점수 기능(오답 시)
            const deductedScore = -1;
            score = Math.max(score + deductedScore, 0); // 점수가 0 이하로 내려가지 않도록 함
            increment = 1; // 점수 증가량 리셋
            if (scoreDisplay.textContent != 0) // 점수가 내려갈 때만 -1 표시
                showScoreChange(deductedScore);
            updateScoreDisplay();
        */
        }
    }

    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
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

    function resetBoard() {
        [firstCard, secondCard, lockBoard] = [null, null, false];
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

});
