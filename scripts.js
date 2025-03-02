// Function to show selected section and hide others
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.container > div').forEach(div => {
        div.classList.add('hidden');
    });

    // Show selected section
    document.getElementById(sectionId).classList.remove('hidden');
}

// Function to initialize the card table
function initializeTable() {
    const deck = document.getElementById('deck');
    const cards = document.querySelectorAll('.card');
    let deckClicked = false;

    // Kliknięcie na talię kart
    deck.addEventListener('click', function() {
        if (!deckClicked) {
            deckClicked = true;
            deck.classList.add('clicked');
            dealCards();
        }
    });

    // Rozdanie kart
    function dealCards() {
        let delay = 0;
        cards.forEach(card => {
            setTimeout(() => {
                card.style.display = 'block';
                card.style.animation = 'dealCard 0.6s ease-out forwards';
            }, delay);
            delay += 150;
        });

        // Dodanie obsługi kliknięcia na kartę
        cards.forEach(card => {
            card.addEventListener('click', function() {
                this.classList.toggle('flipped');
            });
        });
    }
}

// When the DOM is loaded, initialize the card table if we're on the tournament4 page
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the tournament4 page
    const tournament4Element = document.getElementById('tournament4');
    if (tournament4Element && !tournament4Element.classList.contains('hidden')) {
        initializeTable();
    }
});