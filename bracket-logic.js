// Tournament bracket logic for HanysLeague #4
(function() {
    // Console wrapper for debugging
    function logDebug(message, data) {
        console.log(`[Bracket Logic] ${message}`, data || '');
    }

    function logError(message, error) {
        console.error(`[Bracket Logic Error] ${message}`, error);
    }

    // Store team names for easier reference
    const teamNames = {
        'match1-team1': 'DE_STYLACJA',
        'match1-team2': '16:10>4:3',
        'match2-team1': 'shinsoo',
        'match2-team2': 'Cyberpink2025',
        'match3-team1': 'ML DZIK',
        'match3-team2': 'Team Fisting',
        'match4-team1': 'ZABIJAKI3000',
        'match4-team2': 'San Marino007'
    };

    // Helper function to safely set text content and update radio button labels
    function updateBracketLabel(labelId, radioId, text) {
        try {
            const labelElement = document.getElementById(labelId);
            const radioElement = document.getElementById(radioId);

            if (labelElement && text) {
                labelElement.textContent = text;

                // Update corresponding radio button label if exists
                if (radioElement && radioElement.nextElementSibling) {
                    radioElement.nextElementSibling.textContent = text;
                }

                logDebug(`Updated ${labelId} to "${text}"`);
                return true;
            }
            return false;
        } catch (e) {
            logError(`Error updating label ${labelId}`, e);
            return false;
        }
    }

    // Helper function to get selected radio button from a group
    function getSelectedRadio(name) {
        const radios = document.getElementsByName(name);
        for (let i = 0; i < radios.length; i++) {
            if (radios[i].checked) {
                return radios[i];
            }
        }
        return null;
    }

    // Helper function to get label text for a given input ID
    function getLabelTextForInput(inputId) {
        const label = document.querySelector(`label[for="${inputId}"]`);
        return label ? label.textContent : null;
    }

    // Setup the lower bracket with correct matchups
    function setupLowerBracket() {
        try {
            logDebug('Setting up lower bracket');

            // Update Round 1 labels to show initial matchups
            updateBracketLabel('lower1-team1-label', 'lower1-team1', 'Przegrany Q1');
            updateBracketLabel('lower1-team2-label', 'lower1-team2', 'Przegrany Q3');
            updateBracketLabel('lower2-team1-label', 'lower2-team1', 'Przegrany Q2');
            updateBracketLabel('lower2-team2-label', 'lower2-team2', 'Przegrany Q4');

            logDebug('Lower bracket setup complete');
        } catch (e) {
            logError('Error setting up lower bracket', e);
        }
    }

    // Update semifinals based on quarterfinals selections
    function updateSemifinals() {
        try {
            logDebug('Updating semifinals');

            // Get winners from quarterfinals
            const winners = {
                'match1': getSelectedRadio('match1')?.id.includes('team1')
                    ? teamNames['match1-team1']
                    : teamNames['match1-team2'],
                'match2': getSelectedRadio('match2')?.id.includes('team1')
                    ? teamNames['match2-team1']
                    : teamNames['match2-team2'],
                'match3': getSelectedRadio('match3')?.id.includes('team1')
                    ? teamNames['match3-team1']
                    : teamNames['match3-team2'],
                'match4': getSelectedRadio('match4')?.id.includes('team1')
                    ? teamNames['match4-team1']
                    : teamNames['match4-team2']
            };

            // Update semifinal labels
            updateBracketLabel('semi1-team1-label', 'semi1-team1', winners['match1']);
            updateBracketLabel('semi1-team2-label', 'semi1-team2', winners['match2']);
            updateBracketLabel('semi2-team1-label', 'semi2-team1', winners['match3']);
            updateBracketLabel('semi2-team2-label', 'semi2-team2', winners['match4']);

            // Update lower bracket round 1 with losers
            updateLowerBracketRound1(winners);

            logDebug('Semifinals update complete');
        } catch (e) {
            logError('Error updating semifinals', e);
        }
    }

    // Update lower bracket round 1 with quarterfinals losers
    function updateLowerBracketRound1(winners) {
        try {
            logDebug('Updating lower bracket round 1');

            // Determine losers based on winners
            const losers = {
                'match1': winners['match1'] === teamNames['match1-team1']
                    ? teamNames['match1-team2']
                    : teamNames['match1-team1'],
                'match2': winners['match2'] === teamNames['match2-team1']
                    ? teamNames['match2-team2']
                    : teamNames['match2-team1'],
                'match3': winners['match3'] === teamNames['match3-team1']
                    ? teamNames['match3-team2']
                    : teamNames['match3-team1'],
                'match4': winners['match4'] === teamNames['match4-team1']
                    ? teamNames['match4-team2']
                    : teamNames['match4-team1']
            };

            // Update lower bracket labels
            updateBracketLabel('lower1-team1-label', 'lower1-team1', losers['match1']);
            updateBracketLabel('lower1-team2-label', 'lower1-team2', losers['match3']);
            updateBracketLabel('lower2-team1-label', 'lower2-team1', losers['match2']);
            updateBracketLabel('lower2-team2-label', 'lower2-team2', losers['match4']);

            logDebug('Lower bracket round 1 update complete');
        } catch (e) {
            logError('Error updating lower bracket round 1', e);
        }
    }

    // Update upper final based on semifinals selections
    function updateUpperFinal() {
        try {
            logDebug('Updating upper final');

            // Get winners from semifinals
            const winner1 = getSelectedRadio('semi1')?.id.includes('team1')
                ? getLabelTextForInput('semi1-team1')
                : getLabelTextForInput('semi1-team2');
            const winner2 = getSelectedRadio('semi2')?.id.includes('team1')
                ? getLabelTextForInput('semi2-team1')
                : getLabelTextForInput('semi2-team2');

            // Update upper final labels
            updateBracketLabel('upperfinal-team1-label', 'upperfinal-team1', winner1);
            updateBracketLabel('upperfinal-team2-label', 'upperfinal-team2', winner2);

            // Update lower bracket round 2 with semifinal losers
            updateLowerBracketRound2(winner1, winner2);

            logDebug('Upper final update complete');
        } catch (e) {
            logError('Error updating upper final', e);
        }
    }

    // Update lower bracket round 2
    function updateLowerBracketRound2(semi1Winner, semi2Winner) {
        try {
            logDebug('Updating lower bracket round 2');

            // Determine semifinal losers
            const semi1Loser = semi1Winner === teamNames['match1-team1'] || semi1Winner === teamNames['match2-team1']
                ? getLabelTextForInput('semi1-team2')
                : getLabelTextForInput('semi1-team1');
            const semi2Loser = semi2Winner === teamNames['match3-team1'] || semi2Winner === teamNames['match4-team1']
                ? getLabelTextForInput('semi2-team2')
                : getLabelTextForInput('semi2-team1');

            // Update lower bracket round 2 labels
            updateBracketLabel('lower3-team2-label', 'lower3-team2', semi2Loser);
            updateBracketLabel('lower4-team2-label', 'lower4-team2', semi1Loser);

            logDebug('Lower bracket round 2 update complete');
        } catch (e) {
            logError('Error updating lower bracket round 2', e);
        }
    }

    // Update lower semifinal
    function updateLowerSemiFinal() {
        try {
            logDebug('Updating lower semifinal');

            // Get winners from lower round 2
            const lower3Winner = getSelectedRadio('lower3')?.id.includes('team1')
                ? getLabelTextForInput('lower3-team1')
                : getLabelTextForInput('lower3-team2');
            const lower4Winner = getSelectedRadio('lower4')?.id.includes('team1')
                ? getLabelTextForInput('lower4-team1')
                : getLabelTextForInput('lower4-team2');

            // Update lower semifinal labels
            updateBracketLabel('lowersemi-team1-label', 'lowersemi-team1', lower3Winner);
            updateBracketLabel('lowersemi-team2-label', 'lowersemi-team2', lower4Winner);

            logDebug('Lower semifinal update complete');
        } catch (e) {
            logError('Error updating lower semifinal', e);
        }
    }

    // Update small final
    function updateSmallFinal() {
        try {
            logDebug('Updating small final');

            // Get upper final loser
            const upperFinalLoser = getSelectedRadio('upperfinal')?.id.includes('team1')
                ? getLabelTextForInput('upperfinal-team2')
                : getLabelTextForInput('upperfinal-team1');

            // Get lower semifinal winner
            const lowerSemiWinner = getSelectedRadio('lowersemi')?.id.includes('team1')
                ? getLabelTextForInput('lowersemi-team1')
                : getLabelTextForInput('lowersemi-team2');

            // Update small final labels
            updateBracketLabel('smallfinal-team1-label', 'smallfinal-team1', upperFinalLoser);
            updateBracketLabel('smallfinal-team2-label', 'smallfinal-team2', lowerSemiWinner);

            logDebug('Small final update complete');
        } catch (e) {
            logError('Error updating small final', e);
        }
    }

    // Update grand final
    function updateGrandFinal() {
        try {
            logDebug('Updating grand final');

            // Get upper final winner
            const upperFinalWinner = getSelectedRadio('upperfinal')?.id.includes('team1')
                ? getLabelTextForInput('upperfinal-team1')
                : getLabelTextForInput('upperfinal-team2');

            // Get small final winner
            const smallFinalWinner = getSelectedRadio('smallfinal')?.id.includes('team1')
                ? getLabelTextForInput('smallfinal-team1')
                : getLabelTextForInput('smallfinal-team2');

            // Update grand final labels
            updateBracketLabel('grandfinal-team1-label', 'grandfinal-team1', upperFinalWinner);
            updateBracketLabel('grandfinal-team2-label', 'grandfinal-team2', smallFinalWinner);

            logDebug('Grand final update complete');
        } catch (e) {
            logError('Error updating grand final', e);
        }
    }

    // Function to update all bracket labels based on current selections
    function updateAllBracketLabels() {
        logDebug('Updating all bracket labels');
        updateSemifinals();
        updateUpperFinal();
        updateLowerSemiFinal();
        updateSmallFinal();
        updateGrandFinal();
        logDebug('All bracket labels updated');
    }

    // Add event listeners to all bracket elements
    function addAllEventListeners() {
        try {
            logDebug('Adding all event listeners');

            // Helper function to add event listeners
            function addEventListenersToSelector(selector, callback) {
                const elements = document.querySelectorAll(selector);
                logDebug(`Found ${elements.length} elements for selector "${selector}"`);

                elements.forEach(element => {
                    element.addEventListener('change', callback);
                    logDebug(`Added change listener to ${element.id || 'element'}`);
                });
            }

            // Upper Bracket event listeners
            addEventListenersToSelector('input[name="match1"]', updateSemifinals);
            addEventListenersToSelector('input[name="match2"]', updateSemifinals);
            addEventListenersToSelector('input[name="match3"]', updateSemifinals);
            addEventListenersToSelector('input[name="match4"]', updateSemifinals);

            addEventListenersToSelector('input[name="semi1"]', updateUpperFinal);
            addEventListenersToSelector('input[name="semi2"]', updateUpperFinal);

            addEventListenersToSelector('input[name="upperfinal"]', updateSmallFinal);

            addEventListenersToSelector('input[name="lower3"]', updateLowerSemiFinal);
            addEventListenersToSelector('input[name="lower4"]', updateLowerSemiFinal);

            addEventListenersToSelector('input[name="lowersemi"]', updateSmallFinal);

            addEventListenersToSelector('input[name="smallfinal"]', updateGrandFinal);

            logDebug('All event listeners added');
        } catch (e) {
            logError('Error adding event listeners', e);
        }
    }

    // Initialize when the page loads
    function initialize() {
        try {
            logDebug('Initializing bracket logic');

            // Setup the lower bracket
            setupLowerBracket();

            // Add all event listeners
            addAllEventListeners();

            // Update all bracket labels based on current selections
            setTimeout(updateAllBracketLabels, 500);

            logDebug('Bracket logic initialization complete');
        } catch (e) {
            logError('Error initializing bracket logic', e);
        }
    }

    // Export functions to global scope
    window.bracketLogic = {
        setupLowerBracket,
        updateSemifinals,
        updateUpperFinal,
        updateLowerBracketRound1,
        updateLowerBracketRound2,
        updateLowerSemiFinal,
        updateSmallFinal,
        updateGrandFinal,
        updateAllBracketLabels,
        initialize
    };

    // Initialize when the DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        // DOM is already ready, initialize immediately
        initialize();
    }
})();