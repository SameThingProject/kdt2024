document.addEventListener('DOMContentLoaded', () => {
    const images = [
        'Animals png/Pig.png', 'Animals png/Pig.png', 'Animals png/Bear.png', 'Animals png/Bear.png',
        'Animals png/Bird.png', 'Animals png/Bird.png', 'Animals png/Cat.png', 'Animals png/Cat.png',
        'Animals png/Butterfly.png', 'Animals png/Butterfly.png', 'Animals png/Dog.png', 'Animals png/Dog.png',
        'Animals png/Turtle.png', 'Animals png/Turtle.png', 'Animals png/Bull.png', 'Animals png/Bull.png'
    ];

    let shuffledImages = shuffleArray(images); 
    let firstCard = null; // 첫 번째 선택된 카드
    let secondCard = null; // 두 번째 선택된 카드
    let lockBoard = false; // 보드 잠금 상태
    let timer; // 타이머 변수
    let timerInterval; // 타이머 인터벌 변수
    let score; // 점수 변수
    let combo; // 콤보 변수

    const gameBoard = document.getElementById('game-board'); // 게임 보드 요소 참조
    const startButton = document.getElementById('st-button'); // 시작 버튼 요소 참조
    const timerDisplay = document.getElementById('timer'); // 타이머 디스플레이 요소 참조
    const scoreDisplay = document.getElementById('score'); // 점수 디스플레이 요소 참조
    const scoreChangeDisplay = document.getElementById('score-change'); // 점수 변화 디스플레이 요소 참조

    startButton.addEventListener('click', startGame); // 시작 버튼 클릭 시 startGame 함수 실행

    function startGame() { // 게임 시작 함수
        startButton.style.display = 'none'; // 시작 버튼 숨기기
        gameBoard.innerHTML = ''; // 게임 보드 초기화
        shuffledImages = shuffleArray(images); // 이미지 배열 섞기
        score = 0; // 점수 초기화
        combo = 0; // 콤보 초기화
        updateScoreDisplay(); // 점수 디스플레이 업데이트
        shuffledImages.forEach(image => { // 섞인 이미지 배열을 돌며 카드 생성 및 추가
            const cardElement = document.createElement('div'); // 카드 요소 생성
            cardElement.classList.add('card'); // 카드 클래스 추가
            cardElement.innerHTML = `
                <div class="card-content card-front"></div>
                <div class="card-content card-back" style="background-image: url('${image}')"></div>
            `; // 카드 앞면과 뒷면 요소 생성
            cardElement.dataset.image = image; // 카드에 이미지 데이터셋 추가
            cardElement.addEventListener('click', flipCard); // 카드 클릭 시 flipCard 함수 실행
            gameBoard.appendChild(cardElement); // 게임 보드에 카드 추가
        });
        showAllCards(); // 모든 카드를 보여주는 함수 실행
    }

    function showAllCards() { // 모든 카드를 보여주는 함수
        document.querySelectorAll('.card').forEach(card => card.classList.add('flipped')); // 모든 카드 뒤집기
        setTimeout(() => {
            document.querySelectorAll('.card').forEach(card => card.classList.remove('flipped')); // 3초 후 카드 뒤집기 해제
            startTimer(); // 타이머 시작
        }, 3000);
    }

    function startTimer() { // 타이머 시작 함수
        timer = 60; // 타이머를 60초로 설정
        timerInterval = setInterval(() => { // 1초마다 실행되는 인터벌 설정
            timer--; // 타이머 1초 감소
            const minutes = Math.floor(timer / 60); // 분 계산
            const seconds = timer % 60; // 초 계산
            timerDisplay.textContent = `남은 시간: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`; // 남은 시간 디스플레이 업데이트

            if (timer === 0) { // 타이머가 0이 되면
                clearInterval(timerInterval); // 인터벌 해제
                endGame(); // 게임 종료 함수 실행
            }
        }, 1000);
    }

    function flipCard() { // 카드 뒤집기 함수
        if (lockBoard) return; // 보드가 잠겨있으면 리턴
        if (this === firstCard) return; // 이미 선택된 카드이면 리턴

        this.classList.add('flipped'); // 카드 뒤집기 클래스 추가

        if (!firstCard) { // 첫 번째 카드가 선택되지 않았으면
            firstCard = this; // 첫 번째 카드 설정
            return;
        }

        secondCard = this; // 두 번째 카드 설정
        lockBoard = true; // 보드 잠금

        checkForMatch(); // 카드 매칭 확인 함수 실행
    }

    function checkForMatch() { // 카드 매칭 확인 함수
        if (firstCard.dataset.image === secondCard.dataset.image) { // 두 카드의 이미지가 같으면
            disableCards(); // 카드 클릭 이벤트 제거
            resetBoard(); // 보드 리셋

            /** 점수 기능 (정답 시) */
            combo += 1; // 콤보 증가
            let addedScore = 30 + (combo - 1) * 15; // 기본 매칭 성공 점수 + 콤보 점수
            score += addedScore; // 점수 증가
            showScoreChange(`+${addedScore} ${combo > 1 ? 'Combo!' : ''}`); // 점수 변화 디스플레이
            updateScoreDisplay(); // 점수 디스플레이 업데이트
            /***/

            if (document.querySelectorAll('.card.matched').length === images.length) { // 모든 카드를 맞췄으면
                clearInterval(timerInterval); // 인터벌 해제
                setTimeout(() => {
                    alert(`모든 카드를 맞췄습니다! 최종 점수: ${score}`); // 알림 표시
                    startButton.style.display = 'block'; // 시작 버튼 표시
                    gameBoard.innerHTML = ''; // 게임 보드 초기화
                }, 500);
            }
        } else { // 두 카드의 이미지가 다르면
            unflipCards(); // 카드 뒤집기 해제

            /** 점수 기능 (오답 시) */
            const deductedScore = -10; // 감점
            score = Math.max(score + deductedScore, 0); // 점수가 0 이하로 내려가지 않도록 함
            combo = 0; // 콤보 리셋
            if (scoreDisplay.textContent != 0) // 점수가 내려갈 때만 -10 표시
                showScoreChange(deductedScore); // 점수 변화 디스플레이
            updateScoreDisplay(); // 점수 디스플레이 업데이트
        }
    }

    function disableCards() { // 카드 클릭 이벤트 제거 함수
        firstCard.removeEventListener('click', flipCard); // 첫 번째 카드 클릭 이벤트 제거
        secondCard.removeEventListener('click', flipCard); // 두 번째 카드 클릭 이벤트 제거
        firstCard.classList.add('matched'); // 첫 번째 카드 매칭 클래스 추가
        secondCard.classList.add('matched'); // 두 번째 카드 매칭 클래스 추가
        resetBoard(); // 보드 리셋
    }

    function showMismatch() { // 카드 매칭 실패 시 표시 함수 (사용하지 않음)
        firstCard.classList.add('mismatched'); // 첫 번째 카드 매칭 실패 클래스 추가
        secondCard.classList.add('mismatched'); // 두 번째 카드 매칭 실패 클래스 추가
        setTimeout(() => {
            firstCard.classList.remove('flipped', 'mismatched'); // 첫 번째 카드 뒤집기 및 매칭 실패 클래스 제거
            secondCard.classList.remove('flipped', 'mismatched'); // 두 번째 카드 뒤집기 및 매칭 실패 클래스 제거
            resetBoard(); // 보드 리셋
        }, 1000);
    }

    function resetBoard() { // 보드 리셋 함수
        [firstCard, secondCard, lockBoard] = [null, null, false]; // 첫 번째 카드, 두 번째 카드, 보드 잠금 상태 초기화
    }

    function unflipCards() { // 카드 뒤집기 해제 함수
        firstCard.querySelector('.card-back').style.backgroundColor = 'red'; // 첫 번째 카드 뒷면 배경색 빨간색으로 변경
        secondCard.querySelector('.card-back').style.backgroundColor = 'red'; // 두 번째 카드 뒷면 배경색 빨간색으로 변경
        setTimeout(() => {
            firstCard.classList.remove('flipped'); // 첫 번째 카드 뒤집기 해제
            secondCard.classList.remove('flipped'); // 두 번째 카드 뒤집기 해제
            firstCard.querySelector('.card-back').style.backgroundColor = ''; // 첫 번째 카드 뒷면 배경색 원래대로
            secondCard.querySelector('.card-back').style.backgroundColor = ''; // 두 번째 카드 뒷면 배경색 원래대로
            resetBoard(); // 보드 리셋
        }, 1000);
    }

    function updateScoreDisplay() { // 점수 디스플레이 업데이트 함수
        scoreDisplay.textContent = `${score}`; // 점수 디스플레이 업데이트
    }

    function showScoreChange(change) { // 점수 변화 디스플레이 함수
        scoreChangeDisplay.textContent = change; // 점수 변화 내용 설정
        scoreChangeDisplay.style.opacity = 1; // 점수 변화 디스플레이 표시
        setTimeout(() => {
            scoreChangeDisplay.style.opacity = 0; // 1초 후에 점수 변화 디스플레이 숨김
        }, 1000); // 1초 후에 점수 변화 표시 숨김
    }

    function shuffleArray(array) { // 배열 섞기 함수
        let currentIndex = array.length, randomIndex;

        while (currentIndex != 0) {
            randomIndex = Math.floor(Math.random() * currentIndex); // 랜덤 인덱스 생성
            currentIndex--;

            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]; // 요소 교환
        }

        return array; // 섞인 배열 반환
    }

    function endGame() { // 게임 종료 함수
        alert(`시간 종료! 게임 오버. 최종 점수: ${score}`); // 알림 표시
        startButton.style.display = 'block'; // 시작 버튼 표시
        gameBoard.innerHTML = ''; // 게임 보드 초기화
        clearInterval(timerInterval); // 인터벌 해제
    }
});