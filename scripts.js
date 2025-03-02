// Enhanced security system with triple encryption for HanysLeague
// This makes it much harder to bypass authentication by examining code

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

// Encrypted user data (this would replace the plain users array)
const securityKey = "H4nysL3agu3S3cur1tyK3y!";
const securitySalt = "CS2T0urn4m3nt";

const encryptedUsers = "WwcdTQcJfF9TVPN2JIFgV65dByCpEhP5KgcwPPKdXw1LPQ9PPJN5Lic=SJkNNgTRYxBhXUTACGhGZnoFEQ0dSigcNF8PWwPWCh9eHgJwXTPaMlNdTVNhTPGaB7BHc81YTHUfVwB0eItMYTwAeQpYDUNPa6lMMR1ZAl5nTy0gVgJqVPpdUi4yGjQXE89CEjJ7JUXSP8P=NHosZn1bBRUcTWgydl57YRGeZP5RLjYrAIcodkJYZKowUxYOZPoFfmNHAhgVD8T9XQt=WIB5aH5FElNWB9oPexXDTLsdMwPNG8kLAh4aCkgRcIFuGiGMZITBagt=RjkxewBgT69SGMoCUyB7YUsRKGYaWUoqSxdbXgkVezxXQWckRGQ1dFoUXl1megkUW7gjPIUpZlNhKgB/QxOgZUT1LPUfPGg9PGPhPKsaLPXCXjTPYKc4ZGlFEgNAUyKkWINieH8TYMXcXRF2Li9kE9FZay9EUgCCPQU7TJkrQgkFERK4RwFxaIpMJIwbfIczD8QYOyCLDGJVQKkGRixkZ9k4YgKNUhFCGyCyPFXnUI83ajNIWKTFeKo4DkXdWGC0UJXlPFNbYQlaAg5/fzTPBGkFHS9ZPl92HHsWXToGf6kZCSY8ZKXgETG5WJl=ahGzfm9SCQoPcRsMUgBKLPTiWkF0TzteXWNwIjFqQRKGSRTQaFQ3KIwOGFXdSVJEaRNTWGwZQgXRKHCZBK5lPHhiEJ1RMzdAZ8koHjolGPgTBnJpJUPGQUXOZwYqXL1nfFFLVihOYwssLGlaZhwULQJhQMTjOnlTSQP3emkBXFOFNLNFEQ1TWQscOhQuXM53XTPVLwJeEwofexPcUmk3UHheITkqNzsFERK4CFXbcItFVjwQeQo2X8QZb6tLMIBNW6FnWGGwVgJqWTXTAGBePxx4PK9iDjk1JUThWlTTMxN1VTTOXQxAP6sbFwcbWgpWDzF1QGpfAJBGdjXSPl8YJi8CYTgFfmJNQGh8Y7kwETG5WwTnKjpoD69PDxsvPR0JUwPOLSPyCTsKDgXUBTh4Ig9=QzKFYI5cfxQ4TxORdx1bWU1BaRYTPyPkCTk2CPYaBK5lPHhiEJ1RLPUCAMckFS1TFPgSAM9/JP4PVlBjARY1TVsCKIlPRGhkYx9MdS1SPFw2Fj9MRKsaTgNWSTo4Y7PmXF0HTWpKEQ02Fh9SeF4RBM9dBQ5gHIPwY9cyOUccEKwuTHl2C99TdyFBZhsRSH5fMSphYQkTJkGXX8QALIhFZJTaZmPOJSxdQJk4AIhTAH43MzQAY892Hz98ajNtVKTFehP1WWBcVnh0HkC2fgJqCPpYPRF1QGpeYgwrMyNZQkowJgUOPgBiV7TKQiXWDnwDAxpIEScnfzprEL94HQ1ULF5DXPTdHjoiDU9LDgTZCLk2MFohEHQFSUXdJFGmRjobeyJgT6kSFw0iLzPaD8oRXSCYBPPWPxUcYjPHazdDPK5QTQQ=fFkTBMoregoRV8PsCwlpEhP5KgcwGGOeYxFLPFOPZhhWLGNuWlo7HPYlCyT4ClTmBJQ3EFBFTPt2GGp4OFQSYMXaXyPUQHgBGTBxdUpTTKwNPwYaSkgrcygSTW0MUwFNNGpqDzsdeQ5LXn1udz84YhTWP6PoUSxeE9kyXiQUUH4/LjOBTlwBBI9gfyXtPVoTPg11VU5dAGxfRkC2NhcNZwUaQzUUSg++";
// Function to validate user credentials securely
function validateUserCredentials(username, password) {
    try {
        // Decrypt the user data
        const users = tripleDecrypt(encryptedUsers, securityKey);

        if (!users || !Array.isArray(users)) {
            console.error("Invalid user data structure");
            return null;
        }

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

// Replace the original loginToPickem function with this secure version
function loginToPickem() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorElement = document.getElementById('login-error');

    // Check if fields are filled
    if (!username || !password) {
        errorElement.textContent = 'Wprowadź nazwę użytkownika i hasło!';
        return;
    }

    // Validate credentials using the secure function
    const user = validateUserCredentials(username, password);

    if (user) {
        // Successfully logged in
        currentUser = user;
        document.getElementById('logged-user-name').textContent = user.name;

        // Show Pick'em content
        document.getElementById('pickem-login').style.display = 'none';
        document.getElementById('pickem-content').style.display = 'block';

        // If the user is an admin, show the admin panel
        if (user.isAdmin) {
            document.getElementById('admin-panel').style.display = 'block';
            // Set checkboxes based on current locks
            for (const bracketId in bracketLocks) {
                document.getElementById(`lock-${bracketId}`).checked = bracketLocks[bracketId];
            }
        } else {
            document.getElementById('admin-panel').style.display = 'none';
        }

        // Load user's saved selections (if any)
        loadUserSelections();

        // Apply current bracket locks to the form
        applyBracketLocks();
    } else {
        // Login error
        errorElement.textContent = 'Nieprawidłowa nazwa użytkownika lub hasło!';
    }
}

// Function to securely store user selections
// Modyfikacja funkcji savePickemSelections, aby wysyłać dane na email
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

    // Dodaj informacje o użytkowniku i datę
    selections.username = currentUser.username;
    selections.timestamp = new Date().toISOString();

    // Encrypt the data before storing
    const encryptedSelections = tripleEncrypt(selections, securityKey + currentUser.username);

    // Store in localStorage with an encrypted key
    const storageKey = b64Encode(`pickem_${currentUser.username}`);
    localStorage.setItem(storageKey, encryptedSelections);

    // Wysyłanie danych na email
    sendSelectionsToEmail(selections);

    // Pokaż komunikat o powodzeniu
    alert('Twoje wybory zostały zapisane pomyślnie!');
}

// Funkcja wysyłająca dane na email przy użyciu EmailJS
function sendSelectionsToEmail(selections) {
    // Przygotuj dane do wysłania
    const emailData = {
        to_email: 'bicepskula@gmail.com',
        subject: `HanysLeague Pick'em - Wybory użytkownika ${selections.username}`,
        message: JSON.stringify(selections, null, 2),
        from_name: selections.username,
        reply_to: 'noreply@hanysleague.com'
    };

    // Zapisz wybory do pliku JSON i wywołaj pobieranie
    const jsonString = JSON.stringify(selections, null, 2);
    const blob = new Blob([jsonString], {type: 'application/json'});

    // Użyj FormData do wysłania danych
    const formData = new FormData();
    formData.append('file', blob, `pickem_${selections.username}_${new Date().toISOString().slice(0, 10)}.json`);
    formData.append('email', 'bicepskula@gmail.com');
    formData.append('subject', `HanysLeague Pick'em - Wybory użytkownika ${selections.username}`);
    formData.append('message', `Wybory użytkownika ${selections.username} z dnia ${new Date().toLocaleString()}`);

    // Metoda 1: Użycie FormSubmit.co (najprostsze rozwiązanie, bez rejestracji)
    fetch('https://formsubmit.co/bicepskula@gmail.com', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            console.log('Email z wyborami został wysłany pomyślnie');
        })
        .catch(error => {
            console.error('Błąd podczas wysyłania emaila:', error);
        });
}

// Function to load user's saved selections securely
function loadUserSelections() {
    if (!currentUser) return;

    // Get data from localStorage using an encrypted key
    const storageKey = b64Encode(`pickem_${currentUser.username}`);
    const encryptedData = localStorage.getItem(storageKey);

    if (encryptedData) {
        try {
            // Decrypt the data
            const selections = tripleDecrypt(encryptedData, securityKey + currentUser.username);

            // Mark saved radio buttons
            for (const [name, id] of Object.entries(selections)) {
                if (name === 'champion') continue;

                const input = document.getElementById(id);
                if (input) input.checked = true;
            }

            // Select saved champion
            if (selections.champion) {
                document.getElementById('champion-select').value = selections.champion;
            }

            // Update labels based on selections
            updateLabelsBasedOnSelections();
        } catch (e) {
            console.error("Error loading user selections:", e);
        }
    }
}

// Reset all picks (admin only) with secure implementation
function resetAllPicks() {
    if (!currentUser || !currentUser.isAdmin) return;

    if (confirm('Czy na pewno chcesz zresetować wszystkie wybory wszystkich użytkowników? Ta operacja jest nieodwracalna!')) {
        // In a real application, we would send a request to the API
        // Here we remove data from localStorage, but in an obfuscated way

        Object.keys(localStorage).forEach(key => {
            try {
                // Try to decode the key to see if it's a pickem key
                const decodedKey = b64Decode(key);
                if (decodedKey.startsWith('pickem_')) {
                    localStorage.removeItem(key);
                }
            } catch (e) {
                // Not a base64 encoded key, skip it
            }
        });

        // Uncheck all radio buttons
        document.querySelectorAll('input[type="radio"]').forEach(input => {
            input.checked = false;
        });

        // Reset champion dropdown
        document.getElementById('champion-select').value = '';

        alert('Wszystkie wybory zostały zresetowane.');
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
            const decodedKey = b64Decode(key);
            if (decodedKey.startsWith('pickem_')) {
                const username = decodedKey.replace('pickem_', '');
                const encryptedData = localStorage.getItem(key);

                // Decrypt the user data
                const selections = tripleDecrypt(encryptedData, securityKey + username);
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

// Initialize the form with security measures
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners to all radio buttons
    document.querySelectorAll('input[type="radio"]').forEach(input => {
        input.addEventListener('change', updateLabelsBasedOnSelections);
    });

    // Add event listeners for Enter key in login fields
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

    // Set up anti-debugging measures
    setupSecurityMeasures();
});

function logoutFromPickem() {
    // Wyczyść dane sesji
    currentUser = null;

    // Wyczyść tokeny bezpieczeństwa
    sessionStorage.removeItem('adminToken');
    sessionStorage.removeItem('secureSession');

    // Ukryj panel zawartości Pick'em
    document.getElementById('pickem-content').style.display = 'none';

    // Pokaż panel logowania
    document.getElementById('pickem-login').style.display = 'block';

    // Wyczyść pola formularza logowania
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('login-error').textContent = '';

    // Usuń wszystkie zaznaczenia radio buttonów
    document.querySelectorAll('input[type="radio"]').forEach(input => {
        input.checked = false;
    });

    // Resetuj dropdown z championem
    if (document.getElementById('champion-select')) {
        document.getElementById('champion-select').value = '';
    }

    console.log('Użytkownik został wylogowany');
}


// Security measures to prevent tampering
function setupSecurityMeasures() {
    // Detect DevTools opening
    let devToolsOpen = false;

    const devToolsDetection = function() {
        const widthThreshold = window.outerWidth - window.innerWidth > 160;
        const heightThreshold = window.outerHeight - window.innerHeight > 160;

        if (widthThreshold || heightThreshold) {
            if (!devToolsOpen) {
                devToolsOpen = true;
                // Optional: Take action when DevTools is detected
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
        const original = Object.getOwnPropertyDescriptor(window, "localStorage");
        Object.defineProperty(window, "localStorage", {
            get: function() {
                const callerStack = new Error().stack;
                // Here you could analyze the stack to detect suspicious access
                return original.get.call(this);
            }
        });
    })();
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