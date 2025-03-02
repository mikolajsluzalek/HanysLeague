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

// Dane użytkowników do logowania (w rzeczywistości powinny być przechowywane po stronie serwera)
const users = [
    { username: 'admin', password: 'admin123', isAdmin: true, name: 'Administrator' },
    { username: 'user1', password: 'user123', isAdmin: false, name: 'Gracz 1' },
    { username: 'user2', password: 'user123', isAdmin: false, name: 'Gracz 2' },
    { username: 'user3', password: 'user123', isAdmin: false, name: 'Gracz 3' }
];

// Statusy blokad bracket (w rzeczywistości powinny być przechowywane po stronie serwera)
let bracketLocks = {
    'upper-quarterfinals': false,
    'upper-semifinals': false,
    'upper-final': false,
    'lower-rounds': false,
    'finals': false
};

// Aktualnie zalogowany użytkownik
let currentUser = null;

// Funkcja logowania do Pick'em
function loginToPickem() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorElement = document.getElementById('login-error');

    // Sprawdź czy pola są wypełnione
    if (!username || !password) {
        errorElement.textContent = 'Wprowadź nazwę użytkownika i hasło!';
        return;
    }

    // Znajdź użytkownika
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        // Zalogowano pomyślnie
        currentUser = user;
        document.getElementById('logged-user-name').textContent = user.name;

        // Pokaż zawartość Pick'em
        document.getElementById('pickem-login').style.display = 'none';
        document.getElementById('pickem-content').style.display = 'block';

        // Jeśli użytkownik jest administratorem, pokaż panel admina
        if (user.isAdmin) {
            document.getElementById('admin-panel').style.display = 'block';
            // Ustaw checkboxy na podstawie aktualnych blokad
            for (const bracketId in bracketLocks) {
                document.getElementById(`lock-${bracketId}`).checked = bracketLocks[bracketId];
            }
        } else {
            document.getElementById('admin-panel').style.display = 'none';
        }

        // Załaduj zapisane wybory użytkownika (jeśli istnieją)
        loadUserSelections();

        // Zastosuj aktualne blokady na formularzu
        applyBracketLocks();
    } else {
        // Błąd logowania
        errorElement.textContent = 'Nieprawidłowa nazwa użytkownika lub hasło!';
    }
}

// Funkcja wylogowania
function logoutFromPickem() {
    currentUser = null;
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('login-error').textContent = '';

    // Ukryj zawartość Pick'em i pokaż formularz logowania
    document.getElementById('pickem-login').style.display = 'block';
    document.getElementById('pickem-content').style.display = 'none';
}

// Funkcja przełączania blokady dla danego bracket
function toggleBracketLock(bracketId) {
    if (!currentUser || !currentUser.isAdmin) return;

    const checkbox = document.getElementById(`lock-${bracketId}`);
    bracketLocks[bracketId] = checkbox.checked;

    // Aktualizuj status na formularzu
    const statusElement = document.getElementById(`status-${bracketId}`);
    statusElement.textContent = bracketLocks[bracketId] ? 'Status: Zablokowany' : 'Status: Odblokowany';
    statusElement.classList.toggle('locked', bracketLocks[bracketId]);

    // Zastosuj blokady
    applyBracketLocks();

    // Symulacja zapisu stanu na serwerze
    console.log(`Bracket "${bracketId}" jest teraz ${bracketLocks[bracketId] ? 'zablokowany' : 'odblokowany'}`);
}

// Funkcja blokująca/odblokowująca inputy na podstawie stanu blokad
function applyBracketLocks() {
    // Upper Quarterfinals
    const upperQuarterfinalsInputs = document.querySelectorAll('.upper-quarterfinals-pick');
    upperQuarterfinalsInputs.forEach(input => {
        input.disabled = bracketLocks['upper-quarterfinals'];
    });
    document.getElementById('upper-quarterfinals').classList.toggle('locked', bracketLocks['upper-quarterfinals']);

    // Upper Semifinals
    const upperSemifinalsInputs = document.querySelectorAll('.upper-semifinals-pick');
    upperSemifinalsInputs.forEach(input => {
        input.disabled = bracketLocks['upper-semifinals'];
    });
    document.getElementById('upper-semifinals').classList.toggle('locked', bracketLocks['upper-semifinals']);

    // Upper Final
    const upperFinalInputs = document.querySelectorAll('.upper-final-pick');
    upperFinalInputs.forEach(input => {
        input.disabled = bracketLocks['upper-final'];
    });
    document.getElementById('upper-final').classList.toggle('locked', bracketLocks['upper-final']);

    // Lower Rounds
    const lowerRoundsInputs = document.querySelectorAll('.lower-rounds-pick');
    lowerRoundsInputs.forEach(input => {
        input.disabled = bracketLocks['lower-rounds'];
    });
    document.getElementById('lower-round1').classList.toggle('locked', bracketLocks['lower-rounds']);
    document.getElementById('lower-round2').classList.toggle('locked', bracketLocks['lower-rounds']);
    document.getElementById('lower-semifinal').classList.toggle('locked', bracketLocks['lower-rounds']);

    // Finals
    const finalsInputs = document.querySelectorAll('.finals-pick');
    finalsInputs.forEach(input => {
        input.disabled = bracketLocks['finals'];
    });
    document.getElementById('small-final').classList.toggle('locked', bracketLocks['finals']);
    document.getElementById('grand-final').classList.toggle('locked', bracketLocks['finals']);
}

// Funkcja do zapisywania wyborów użytkownika
function savePickemSelections() {
    if (!currentUser) return;

    // Zbieramy wszystkie zaznaczone wybory
    const selections = {};

    // Upper Bracket
    document.querySelectorAll('input[type="radio"]:checked').forEach(input => {
        selections[input.name] = input.id;
    });

    // Champion
    const championSelect = document.getElementById('champion-select');
    if (championSelect.value) {
        selections['champion'] = championSelect.value;
    }

    // W rzeczywistej aplikacji wysłalibyśmy te dane na serwer
    // Tutaj tylko logujemy do konsoli
    console.log('Zapisane wybory użytkownika:', selections);

    // Symulacja zapisu w localStorage
    localStorage.setItem(`pickem_${currentUser.username}`, JSON.stringify(selections));

    // Pokaż komunikat o powodzeniu
    alert('Twoje wybory zostały zapisane pomyślnie!');
}

// Funkcja do ładowania zapisanych wyborów użytkownika
function loadUserSelections() {
    if (!currentUser) return;

    // Symulacja odczytu z localStorage
    const savedSelections = localStorage.getItem(`pickem_${currentUser.username}`);

    if (savedSelections) {
        const selections = JSON.parse(savedSelections);

        // Zaznacz zapisane radio buttony
        for (const [name, id] of Object.entries(selections)) {
            if (name === 'champion') continue;

            const input = document.getElementById(id);
            if (input) input.checked = true;
        }

        // Wybierz zapisanego championa
        if (selections.champion) {
            document.getElementById('champion-select').value = selections.champion;
        }
    }
}

// Resetowanie wszystkich wyborów (tylko dla admina)
function resetAllPicks() {
    if (!currentUser || !currentUser.isAdmin) return;

    if (confirm('Czy na pewno chcesz zresetować wszystkie wybory wszystkich użytkowników? Ta operacja jest nieodwracalna!')) {
        // W rzeczywistej aplikacji wysłalibyśmy request do API
        // Tutaj usuwamy dane z localStorage

        // Usuń wszystkie klucze zawierające 'pickem_'
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('pickem_')) {
                localStorage.removeItem(key);
            }
        });

        // Odznacz wszystkie radio buttony
        document.querySelectorAll('input[type="radio"]').forEach(input => {
            input.checked = false;
        });

        // Resetuj dropdown z championem
        document.getElementById('champion-select').value = '';

        alert('Wszystkie wybory zostały zresetowane.');
    }
}

// Eksport danych Pick'em (tylko dla admina)
function exportPickemData() {
    if (!currentUser || !currentUser.isAdmin) return;

    // W rzeczywistej aplikacji pobieralibyśmy dane z API
    // Tutaj zbieramy dane z localStorage

    const exportData = {};

    Object.keys(localStorage).forEach(key => {
        if (key.startsWith('pickem_')) {
            const username = key.replace('pickem_', '');
            exportData[username] = JSON.parse(localStorage.getItem(key));
        }
    });

    // Konwertujemy do formatu JSON
    const jsonData = JSON.stringify(exportData, null, 2);

    // Tworzymy link do pobrania
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pickem_export_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Nasłuchiwanie na zmiany w wyborach Upper Bracket, aby aktualizować etykiety
function updateLabelsBasedOnSelections() {
    // Ćwierćfinały -> Półfinały
    const quarterfinalSelections = {
        match1: document.querySelector('input[name="match1"]:checked'),
        match2: document.querySelector('input[name="match2"]:checked'),
        match3: document.querySelector('input[name="match3"]:checked'),
        match4: document.querySelector('input[name="match4"]:checked')
    };

    // Aktualizacja etykiet dla półfinałów
    if (quarterfinalSelections.match1) {
        const winnerLabel = document.querySelector(`label[for="${quarterfinalSelections.match1.id}"]`).textContent;
        document.getElementById('semi1-team1-label').textContent = winnerLabel;
    }

    if (quarterfinalSelections.match2) {
        const winnerLabel = document.querySelector(`label[for="${quarterfinalSelections.match2.id}"]`).textContent;
        document.getElementById('semi1-team2-label').textContent = winnerLabel;
    }

    if (quarterfinalSelections.match3) {
        const winnerLabel = document.querySelector(`label[for="${quarterfinalSelections.match3.id}"]`).textContent;
        document.getElementById('semi2-team1-label').textContent = winnerLabel;
    }

    if (quarterfinalSelections.match4) {
        const winnerLabel = document.querySelector(`label[for="${quarterfinalSelections.match4.id}"]`).textContent;
        document.getElementById('semi2-team2-label').textContent = winnerLabel;
    }

    // Półfinały -> Upper Final
    const semifinalSelections = {
        semi1: document.querySelector('input[name="semi1"]:checked'),
        semi2: document.querySelector('input[name="semi2"]:checked')
    };

    if (semifinalSelections.semi1) {
        const winnerLabel = document.querySelector(`label[for="${semifinalSelections.semi1.id}"]`).textContent;
        document.getElementById('upperfinal-team1-label').textContent = winnerLabel;
    }

    if (semifinalSelections.semi2) {
        const winnerLabel = document.querySelector(`label[for="${semifinalSelections.semi2.id}"]`).textContent;
        document.getElementById('upperfinal-team2-label').textContent = winnerLabel;
    }

    // Podobne aktualizacje dla pozostałych rund...
}

// Inicjalizacja formularza Pick'em podczas ładowania strony
document.addEventListener('DOMContentLoaded', function() {
    // Dodaj nasłuchiwanie na wszystkie radio buttony
    document.querySelectorAll('input[type="radio"]').forEach(input => {
        input.addEventListener('change', updateLabelsBasedOnSelections);
    });

    // Dodaj nasłuchiwanie na Enter w polach logowania
    document.getElementById('username').addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            loginToPickem();
        }
    });

    document.getElementById('password').addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            loginToPickem();
        }
    });
});
