// ====================================
// HanysLeague Script - Complete Version
// ====================================

// ===== CORE SECURITY FUNCTIONS =====

// Base64 encoding/decoding functions
function b64Encode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
        return String.fromCharCode('0x' + p1);
    }));
}

function b64Decode(str) {
    return decodeURIComponent(Array.prototype.map.call(atob(str), (c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

// XOR encryption/decryption
function xorEncrypt(text, key) {
    let result = '';
    for (let i = 0; i < text.length; i++) {
        result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return result;
}

// Custom substitution cipher
function substitutionCipher(text, encrypt = true) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    const shifted = 'PQRSTUVWXYZABCDEFGHIJKLMNOabcdefghijklmnopqrstuvwxyz9876543210=/+';

    let result = '';
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (encrypt) {
            const index = alphabet.indexOf(char);
            result += (index !== -1) ? shifted[index] : char;
        } else {
            const index = shifted.indexOf(char);
            result += (index !== -1) ? alphabet[index] : char;
        }
    }
    return result;
}

// Triple encryption function
function tripleEncrypt(data, key) {
    // Step 1: Convert to JSON and encode with Base64
    const step1 = b64Encode(JSON.stringify(data));

    // Step 2: Apply XOR encryption with the key
    const step2 = xorEncrypt(step1, key);

    // Step 3: Apply substitution cipher
    const step3 = substitutionCipher(b64Encode(step2), true);

    return step3;
}

// Triple decryption function
function tripleDecrypt(encryptedData, key) {
    try {
        // Step 1: Reverse substitution cipher
        const step1 = substitutionCipher(encryptedData, false);

        // Step 2: Reverse XOR encryption
        const step2 = xorEncrypt(b64Decode(step1), key);

        // Step 3: Decode Base64 and parse JSON
        const step3 = JSON.parse(b64Decode(step2));

        return step3;
    } catch (e) {
        console.error("Decryption failed:", e);
        return null;
    }
}

// Secure hash function for password verification
function secureHash(str, salt) {
    let hash = 0;
    const combined = str + salt;
    for (let i = 0; i < combined.length; i++) {
        const char = combined.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(36);
}

// ===== USER AUTHENTICATION =====

// Security key and salt
const securityKey = "H4nysL3agu3S3cur1tyK3y!";
const securitySalt = "CS2T0urn4m3nt";

// Sample encrypted users data (for demo purposes)
// In a real application, this would be stored securely on a server
const sampleUsers = [
    {
        username: "admin",
        name: "Administrator",
        passwordHash: secureHash("admin123", securitySalt + "admin"),
        isAdmin: true
    },
    {
        username: "user",
        name: "Regular User",
        passwordHash: secureHash("user123", securitySalt + "user"),
        isAdmin: false
    }
];

// Current user details
let currentUser = null;

// Function to validate user credentials
function validateUserCredentials(username, password) {
    try {
        // For demonstration purposes, using the sample users
        // In a real app, you would decrypt from the encryptedUsers variable
        const users = sampleUsers;

        // Find matching user
        const user = users.find(u => {
            return u.username === username &&
                u.passwordHash === secureHash(password, securitySalt + u.username);
        });

        return user ? {
            username: user.username,
            name: user.name,
            isAdmin: user.isAdmin
        } : null;

    } catch (e) {
        console.error("Authentication error:", e);
        return null;
    }
}

// Create a secure authentication token
function generateAuthToken(user) {
    const payload = {
        username: user.username,
        timestamp: Date.now(),
        random: Math.random().toString(36).substring(2)
    };

    return tripleEncrypt(payload, securityKey + user.username);
}

// Verify the authentication token
function verifyAuthToken(token, username) {
    try {
        const payload = tripleDecrypt(token, securityKey + username);

        // Check if token is expired (24 hours validity)
        const isExpired = Date.now() - payload.timestamp > 24 * 60 * 60 * 1000;

        return !isExpired && payload.username === username;
    } catch (e) {
        return false;
    }
}

// Generate a unique user session ID for additional security
function generateSessionId() {
    return 'sid_' + Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
}

// Additional initialization when a user logs in
function initializeSecureSession(user) {
    // Create a secure session
    const sessionId = generateSessionId();

    // Store session details in sessionStorage (encrypted)
    const sessionData = {
        username: user.username,
        sessionId: sessionId,
        issuedAt: Date.now(),
        userAgent: navigator.userAgent
    };

    sessionStorage.setItem('secureSession', tripleEncrypt(sessionData, securityKey));

    return sessionId;
}

// ===== PICK'EM CHALLENGE FUNCTIONALITY =====

// Store bracket locks status
const bracketLocks = {
    'upper-quarterfinals': false,
    'upper-semifinals': false,
    'upper-final': false,
    'lower-rounds': false,
    'finals': false
};

// Function to update bracket status display
function updateBracketStatus(bracketId, isLocked) {
    const statusElement = document.getElementById(`status-${bracketId}`);
    if (statusElement) {
        statusElement.textContent = isLocked ? 'Status: Zablokowany' : 'Status: Odblokowany';
        statusElement.style.backgroundColor = isLocked ? '#7a2d2d' : '#2d5a2d';
    }
}

// Function to apply bracket locks to the form
function applyBracketLocks() {
    // Apply upper bracket quarterfinals lock
    if (bracketLocks['upper-quarterfinals']) {
        const inputs = document.querySelectorAll('#upper-quarterfinals input[type="radio"]');
        inputs.forEach(input => {
            input.disabled = true;
        });
        document.querySelectorAll('#upper-quarterfinals .pickem-match').forEach(match => {
            match.classList.add('locked');
        });
        updateBracketStatus('upper-quarterfinals', true);
    }

    // Apply upper bracket semifinals lock
    if (bracketLocks['upper-semifinals']) {
        const inputs = document.querySelectorAll('#upper-semifinals input[type="radio"]');
        inputs.forEach(input => {
            input.disabled = true;
        });
        document.querySelectorAll('#upper-semifinals .pickem-match').forEach(match => {
            match.classList.add('locked');
        });
        updateBracketStatus('upper-semifinals', true);
    }

    // Apply upper bracket final lock
    if (bracketLocks['upper-final']) {
        const inputs = document.querySelectorAll('#upper-final input[type="radio"]');
        inputs.forEach(input => {
            input.disabled = true;
        });
        document.querySelectorAll('#upper-final .pickem-match').forEach(match => {
            match.classList.add('locked');
        });
        updateBracketStatus('upper-final', true);
    }

    // Apply lower bracket rounds lock
    if (bracketLocks['lower-rounds']) {
        const inputs = document.querySelectorAll('#lower-round1 input[type="radio"], #lower-round2 input[type="radio"], #lower-semifinal input[type="radio"]');
        inputs.forEach(input => {
            input.disabled = true;
        });
        document.querySelectorAll('#lower-round1 .pickem-match, #lower-round2 .pickem-match, #lower-semifinal .pickem-match').forEach(match => {
            match.classList.add('locked');
        });
        updateBracketStatus('lower-rounds', true);
    }

    // Apply finals lock
    if (bracketLocks['finals']) {
        const inputs = document.querySelectorAll('#small-final input[type="radio"], #grand-final input[type="radio"]');
        inputs.forEach(input => {
            input.disabled = true;
        });
        document.querySelectorAll('#small-final .pickem-match, #grand-final .pickem-match').forEach(match => {
            match.classList.add('locked');
        });
        updateBracketStatus('finals', true);
    }
}

// Function to toggle bracket lock state
function toggleBracketLock(bracketId) {
    const checkbox = document.getElementById(`lock-${bracketId}`);
    if (checkbox) {
        bracketLocks[bracketId] = checkbox.checked;

        // Save bracket locks to localStorage
        localStorage.setItem('bracketLocks', JSON.stringify(bracketLocks));

        // Apply locks to the UI
        applyBracketLocks();
    }
}

// Function to load bracket locks from storage
function loadBracketLocks() {
    const savedLocks = localStorage.getItem('bracketLocks');
    if (savedLocks) {
        try {
            const parsedLocks = JSON.parse(savedLocks);
            Object.keys(parsedLocks).forEach(key => {
                bracketLocks[key] = parsedLocks[key];

                // Update checkboxes
                const checkbox = document.getElementById(`lock-${key}`);
                if (checkbox) {
                    checkbox.checked = parsedLocks[key];
                }
            });

            // Apply locks to the UI
            applyBracketLocks();
        } catch (e) {
            console.error("Error parsing bracket locks:", e);
        }
    }
}

// Function to update bracket labels based on selections
function updateLabelsBasedOnSelections() {
    try {
        // If the bracket logic is available, use it
        if (window.bracketLogic && typeof window.bracketLogic.updateAllBracketLabels === 'function') {
            window.bracketLogic.updateAllBracketLabels();
        }
    } catch (e) {
        console.error("Error updating bracket labels:", e);
    }
}

// Function to securely store user selections
function savePickemSelections() {
    if (!currentUser) return;

    // Collect all selected choices
    const selections = {};

    // Upper Bracket
    document.querySelectorAll('input[type="radio"]:checked').forEach(input => {
        selections[input.name] = input.id;
    });

    // Champion
    const championSelect = document.getElementById('champion-select');
    if (championSelect && championSelect.value) {
        selections['champion'] = championSelect.value;
    }

    // Add user information and date
    selections.username = currentUser.username;
    selections.timestamp = new Date().toISOString();

    // Store in localStorage
    const storageKey = `pickem_${currentUser.username}`;
    localStorage.setItem(storageKey, JSON.stringify(selections));

    // Send data to Google Sheets
    sendSelectionsToGoogleSheets(selections);

    // Show success message
    alert('Twoje wybory zostały zapisane pomyślnie!');
}

// Function to send selections to Google Sheets
function sendSelectionsToGoogleSheets(selections) {
    console.log("Wysyłane dane:", selections);

    // Format the data for the API
    const formattedData = {
        username: selections.username,
        timestamp: selections.timestamp,
        selections: JSON.stringify(selections)
    };

    // Create a deployment URL for the Google Apps Script Web App
    const scriptURL = 'https://script.google.com/macros/s/AKfycbwXSVziL9tJejfLj3QONA1YEaoCXNbRSIe0StI3hgQtEs16fYm2NlXxV-bFLaz8iOUX2Q/exec'; // Replace with your actual web app URL

    // Send data to Google Sheets via fetch API
    fetch(scriptURL, {
        method: 'POST',
        mode: 'no-cors', // Important for cross-origin requests to Google Apps Script
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formattedData)
    })
        .then(response => {
            console.log('Data sent to Google Sheets successfully');
        })
        .catch(error => {
            console.error('Error sending data to Google Sheets:', error);
        });
}

// Function to load user's saved selections
function loadUserSelections() {
    if (!currentUser) return;

    // Get data from localStorage
    const storageKey = `pickem_${currentUser.username}`;
    const savedData = localStorage.getItem(storageKey);

    if (savedData) {
        try {
            // Parse the saved data
            const selections = JSON.parse(savedData);

            // Mark saved radio buttons
            for (const [name, id] of Object.entries(selections)) {
                if (name === 'champion' || name === 'username' || name === 'timestamp') continue;

                const input = document.getElementById(id);
                if (input) input.checked = true;
            }

            // Select saved champion
            if (selections.champion) {
                const championSelect = document.getElementById('champion-select');
                if (championSelect) championSelect.value = selections.champion;
            }

            // Update labels based on selections
            updateLabelsBasedOnSelections();
        } catch (e) {
            console.error("Error loading user selections:", e);
        }
    }
}

// Login to Pick'em function
function loginToPickem() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorElement = document.getElementById('login-error');

    // Check if fields are filled
    if (!username || !password) {
        errorElement.textContent = 'Wprowadź nazwę użytkownika i hasło!';
        return;
    }

    // Validate credentials
    const user = validateUserCredentials(username, password);

    if (user) {
        // Successfully logged in
        currentUser = user;
        const userNameElement = document.getElementById('logged-user-name');
        if (userNameElement) userNameElement.textContent = user.name;

        // Show Pick'em content
        document.getElementById('pickem-login').style.display = 'none';
        document.getElementById('pickem-content').style.display = 'block';

        // If the user is an admin, show the admin panel
        const adminPanel = document.getElementById('admin-panel');
        if (adminPanel) {
            if (user.isAdmin) {
                adminPanel.style.display = 'block';
                // Set checkboxes based on current locks
                for (const bracketId in bracketLocks) {
                    const checkbox = document.getElementById(`lock-${bracketId}`);
                    if (checkbox) checkbox.checked = bracketLocks[bracketId];
                }
            } else {
                adminPanel.style.display = 'none';
            }
        }

        // Create a secure session
        initializeSecureSession(user);

        // Load user's saved selections (if any)
        loadUserSelections();

        // Apply current bracket locks to the form
        applyBracketLocks();
    } else {
        // Login error
        errorElement.textContent = 'Nieprawidłowa nazwa użytkownika lub hasło!';
    }
}

// Function to logout from Pick'em
function logoutFromPickem() {
    // Clear session data
    currentUser = null;

    // Clear security tokens
    sessionStorage.removeItem('adminToken');
    sessionStorage.removeItem('secureSession');

    // Hide Pick'em content panel
    const pickemContent = document.getElementById('pickem-content');
    if (pickemContent) pickemContent.style.display = 'none';

    // Show login panel
    const pickemLogin = document.getElementById('pickem-login');
    if (pickemLogin) pickemLogin.style.display = 'block';

    // Clear login form fields
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    const loginError = document.getElementById('login-error');

    if (username) username.value = '';
    if (password) password.value = '';
    if (loginError) loginError.textContent = '';

    // Uncheck all radio buttons
    document.querySelectorAll('input[type="radio"]').forEach(input => {
        input.checked = false;
    });

    // Reset champion dropdown
    const championSelect = document.getElementById('champion-select');
    if (championSelect) championSelect.value = '';

    console.log('User has been logged out');
}

// Reset all picks (admin only)
function resetAllPicks() {
    if (!currentUser || !currentUser.isAdmin) return;

    if (confirm('Czy na pewno chcesz zresetować wszystkie wybory wszystkich użytkowników? Ta operacja jest nieodwracalna!')) {
        // Remove pickem data from localStorage
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('pickem_')) {
                localStorage.removeItem(key);
            }
        });

        // Uncheck all radio buttons
        document.querySelectorAll('input[type="radio"]').forEach(input => {
            input.checked = false;
        });

        // Reset champion dropdown
        const championSelect = document.getElementById('champion-select');
        if (championSelect) championSelect.value = '';

        alert('Wszystkie wybory zostały zresetowane.');
    }
}

// Export data (admin only) with added security
function exportPickemData() {
    if (!currentUser || !currentUser.isAdmin) return;

    // Check admin authentication with secondary verification
    const adminToken = sessionStorage.getItem('adminToken');
    if (!adminToken || !verifyAuthToken(adminToken, currentUser.username)) {
        // Request additional verification
        const verifyPassword = prompt("Aby kontynuować, wprowadź hasło administracyjne:");

        if (!verifyPassword || !validateUserCredentials(currentUser.username, verifyPassword)) {
            alert("Nieprawidłowa weryfikacja. Operacja anulowana.");
            return;
        }

        // Generate and store admin token
        sessionStorage.setItem('adminToken', generateAuthToken(currentUser));
    }

    // Now proceed with the export
    const exportData = {};

    Object.keys(localStorage).forEach(key => {
        try {
            if (key.startsWith('pickem_')) {
                const username = key.replace('pickem_', '');
                const data = localStorage.getItem(key);

                // Parse the user data
                const selections = JSON.parse(data);
                exportData[username] = selections;
            }
        } catch (e) {
            // Skip non-pickem keys
        }
    });

    // Convert to JSON format
    const jsonData = JSON.stringify(exportData, null, 2);

    // Create download link
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

// ===== CARD TABLE ANIMATION =====

// Function to initialize the card table
function initializeTable() {
    const deck = document.getElementById('deck');
    const players = document.querySelectorAll('.player');
    let isDealing = false;

    // Reset card states
    players.forEach(player => {
        const cards = player.querySelectorAll('.card');
        cards.forEach(card => {
            card.style.display = 'none';
            card.classList.remove('flipped');
            const cardInner = card.querySelector('.card-inner');
            if (cardInner) cardInner.style.transform = '';
        });
    });

    // Add click event to the deck
    deck.addEventListener('click', function() {
        if (isDealing) return; // Prevent multiple clicks during animation

        isDealing = true;
        deck.classList.add('clicked');

        // Deal cards to each player
        players.forEach((player, playerIndex) => {
            const cards = player.querySelectorAll('.card');

            cards.forEach((card, cardIndex) => {
                // Display the card
                card.style.display = 'block';

                // Calculate delay based on player position and card number
                const delay = (playerIndex * 200) + (cardIndex * 300);

                // Apply the dealing animation
                card.style.animation = `dealCard 0.5s ease ${delay}ms forwards`;

                // Flip the card after dealing
                setTimeout(() => {
                    card.classList.add('flipped');
                }, delay + 500);
            });
        });

        // Reset dealing status after all animations
        setTimeout(() => {
            isDealing = false;
        }, 3000); // Adjust timing based on total animation duration
    });

    console.log('Card table initialized');
}

// ===== SECTION NAVIGATION =====

// Function to switch between tournament sections
function switchSection(sectionId) {
    // Remove active class from all sections
    document.querySelectorAll('.tournament-section').forEach(section => {
        section.classList.remove('active');
    });

    // Remove active class from all navigation items
    document.querySelectorAll('.section-nav-item').forEach(navItem => {
        navItem.classList.remove('active');
    });

    // Add active class to the selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) targetSection.classList.add('active');

    // Add active class to the clicked navigation item
    const navItems = document.querySelectorAll('.section-nav-item');
    Array.from(navItems).find(
        navItem => navItem.textContent.toLowerCase().includes(sectionId)
    )?.classList.add('active');

    // If the losowanie section is selected, initialize the card table
    if (sectionId === 'losowanie') {
        initializeTable();
    }
}

// ===== SECURITY MEASURES =====

// Setup anti-debugging measures
function setupSecurityMeasures() {
    // Detect DevTools opening
    let devToolsOpen = false;

    const devToolsDetection = function() {
        const widthThreshold = window.outerWidth - window.innerWidth > 160;
        const heightThreshold = window.outerHeight - window.innerHeight > 160;

        if (widthThreshold || heightThreshold) {
            if (!devToolsOpen) {
                devToolsOpen = true;
                console.log("%cUwaga! Konsola deweloperska została wykryta.", "color:red; font-size:16px;");
            }
        } else {
            devToolsOpen = false;
        }
    };

    // Check periodically
    setInterval(devToolsDetection, 1000);

    // Prevent easy access to stored variables
    (function() {
        try {
            const original = Object.getOwnPropertyDescriptor(window, "localStorage");
            Object.defineProperty(window, "localStorage", {
                get: function() {
                    const callerStack = new Error().stack;
                    // Here you could analyze the stack to detect suspicious access
                    return original.get.call(this);
                }
            });
        } catch (e) {
            console.error("Error setting up localStorage protection:", e);
        }
    })();
}

// ===== INITIALIZATION =====

// Initialize when the document is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set up security measures
    setupSecurityMeasures();

    // Add event listeners to all radio buttons
    document.querySelectorAll('input[type="radio"]').forEach(input => {
        input.addEventListener('change', updateLabelsBasedOnSelections);
    });

    // Add event listeners for Enter key in login fields
    const usernameField = document.getElementById('username');
    const passwordField = document.getElementById('password');

    if (usernameField) {
        usernameField.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                loginToPickem();
            }
        });
    }

    if (passwordField) {
        passwordField.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                loginToPickem();
            }
        });
    }

    // Load bracket locks
    loadBracketLocks();

    // Initialize card table if we're on the tournament page
    if (document.getElementById('losowanie')) {
        initializeTable();

        // Default active section is Losowanie
        switchSection('losowanie');
    }

    console.log('Document initialization complete');
});

// Make functions available globally
window.loginToPickem = loginToPickem;
window.logoutFromPickem = logoutFromPickem;
window.savePickemSelections = savePickemSelections;
window.resetAllPicks = resetAllPicks;
window.exportPickemData = exportPickemData;
window.toggleBracketLock = toggleBracketLock;
window.switchSection = switchSection;
window.initializeTable = initializeTable;