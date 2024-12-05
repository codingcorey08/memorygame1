// Memory Matching Game Logic
const board = document.getElementById('board');
const restartButton = document.getElementById('restart-btn');
const updateNotification = document.getElementById('update-notification');
const updateMessage = document.getElementById('update-message');
const updateLink = document.getElementById('update-link');
const dismissButton = document.getElementById('dismiss-update');

let cardValues = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
let flippedCards = [];
let matchedCards = 0;

// Shuffle array
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Create board
function createBoard() {
    shuffle(cardValues);
    board.innerHTML = '';
    flippedCards = [];
    matchedCards = 0;

    cardValues.forEach(value => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.value = value;
        card.addEventListener('click', flipCard);
        board.appendChild(card);
    });
}

// Flip a card
function flipCard() {
    if (flippedCards.length === 2 || this.classList.contains('flipped') || this.classList.contains('matched')) return;

    this.classList.add('flipped');
    this.textContent = this.dataset.value;
    flippedCards.push(this);

    if (flippedCards.length === 2) setTimeout(checkMatch, 1000);
}

// Check match
function checkMatch() {
    const [firstCard, secondCard] = flippedCards;

    if (firstCard.dataset.value === secondCard.dataset.value) {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        matchedCards += 2;

        if (matchedCards === cardValues.length) setTimeout(() => alert('You won!'), 500);
    } else {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        firstCard.textContent = '';
        secondCard.textContent = '';
    }

    flippedCards = [];
}

// Restart game
function restartGame() {
    createBoard();
}

// Check for updates
function checkForUpdates() {
    fetch('updates.json')
        .then(response => response.json())
        .then(data => {
            const currentVersion = document.getElementById('current-version').textContent;

            if (data.updateAvailable && currentVersion !== data.version) {
                updateMessage.innerHTML = `Version ${data.version} is available with these changes: <ul>`;
                data.changes.forEach(change => updateMessage.innerHTML += `<li>${change}</li>`);
                updateMessage.innerHTML += '</ul>';

                updateLink.href = data.updateURL;
                updateNotification.style.display = 'block';

                dismissButton.addEventListener('click', () => updateNotification.style.display = 'none');
            }
        })
        .catch(error => console.error('Error fetching updates:', error));
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkForUpdates();
    createBoard();
});

restartButton.addEventListener('click', restartGame);
