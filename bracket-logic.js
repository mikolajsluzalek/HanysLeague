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

    // Helper function to safely set text content
    function setLabelText(id, text) {
        const element = document.getElementById(id);
        if (element && text) {
            element.textContent = text;
            logDebug(`Set ${id} to "${text}"`);
            return true;
        }
        return false;
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

    // Helper function to check if radio button is checked
    function isRadioChecked(id) {
        const radio = document.getElementById(id);
        return radio && radio.checked;
    }

    // Setup the lower bracket with correct matchups
    function setupLowerBracket() {
        try {
            logDebug('Setting up lower bracket');

            // Update Round 1 labels to show Q1 vs Q3 and Q2 vs Q4
            setLabelText('lower1-team1-label', 'Przegrany Q1');
            setLabelText('lower1-team2-label', 'Przegrany Q3');
            setLabelText('lower2-team1-label', 'Przegrany Q2');
            setLabelText('lower2-team2-label', 'Przegrany Q4');

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
            let match1Winner = null;
            if (isRadioChecked('match1-team1')) {
                match1Winner = getLabelTextForInput('match1-team1');
                logDebug('Match 1 winner is Team 1:', match1Winner);
            } else if (isRadioChecked('match1-team2')) {
                match1Winner = getLabelTextForInput('match1-team2');
                logDebug('Match 1 winner is Team 2:', match1Winner);
            }

            let match2Winner = null;
            if (isRadioChecked('match2-team1')) {
                match2Winner = getLabelTextForInput('match2-team1');
                logDebug('Match 2 winner is Team 1:', match2Winner);
            } else if (isRadioChecked('match2-team2')) {
                match2Winner = getLabelTextForInput('match2-team2');
                logDebug('Match 2 winner is Team 2:', match2Winner);
            }

            let match3Winner = null;
            if (isRadioChecked('match3-team1')) {
                match3Winner = getLabelTextForInput('match3-team1');
                logDebug('Match 3 winner is Team 1:', match3Winner);
            } else if (isRadioChecked('match3-team2')) {
                match3Winner = getLabelTextForInput('match3-team2');
                logDebug('Match 3 winner is Team 2:', match3Winner);
            }

            let match4Winner = null;
            if (isRadioChecked('match4-team1')) {
                match4Winner = getLabelTextForInput('match4-team1');
                logDebug('Match 4 winner is Team 1:', match4Winner);
            } else if (isRadioChecked('match4-team2')) {
                match4Winner = getLabelTextForInput('match4-team2');
                logDebug('Match 4 winner is Team 2:', match4Winner);
            }

            // Update semifinal labels
            setLabelText('semi1-team1-label', match1Winner);
            setLabelText('semi1-team2-label', match2Winner);
            setLabelText('semi2-team1-label', match3Winner);
            setLabelText('semi2-team2-label', match4Winner);

            // Update lower bracket round 1 with losers
            updateLowerBracketRound1();

            logDebug('Semifinals update complete');
        } catch (e) {
            logError('Error updating semifinals', e);
        }
    }

    // Update lower bracket round 1 with quarterfinals losers
    function updateLowerBracketRound1() {
        try {
            logDebug('Updating lower bracket round 1');

            // Check Match 1 teams
            if (isRadioChecked('match1-team1')) {
                // If team 1 won, team 2 is the loser
                setLabelText('lower1-team1-label', teamNames['match1-team2']);
            } else if (isRadioChecked('match1-team2')) {
                // If team 2 won, team 1 is the loser
                setLabelText('lower1-team1-label', teamNames['match1-team1']);
            }

            // Check Match 3 teams
            if (isRadioChecked('match3-team1')) {
                // If team 1 won, team 2 is the loser
                setLabelText('lower1-team2-label', teamNames['match3-team2']);
            } else if (isRadioChecked('match3-team2')) {
                // If team 2 won, team 1 is the loser
                setLabelText('lower1-team2-label', teamNames['match3-team1']);
            }

            // Check Match 2 teams
            if (isRadioChecked('match2-team1')) {
                // If team 1 won, team 2 is the loser
                setLabelText('lower2-team1-label', teamNames['match2-team2']);
            } else if (isRadioChecked('match2-team2')) {
                // If team 2 won, team 1 is the loser
                setLabelText('lower2-team1-label', teamNames['match2-team1']);
            }

            // Check Match 4 teams
            if (isRadioChecked('match4-team1')) {
                // If team 1 won, team 2 is the loser
                setLabelText('lower2-team2-label', teamNames['match4-team2']);
            } else if (isRadioChecked('match4-team2')) {
                // If team 2 won, team 1 is the loser
                setLabelText('lower2-team2-label', teamNames['match4-team1']);
            }

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
            let semi1Winner = null;
            if (isRadioChecked('semi1-team1')) {
                semi1Winner = document.getElementById('semi1-team1-label').textContent;
                logDebug('Semifinal 1 winner is Team 1:', semi1Winner);
            } else if (isRadioChecked('semi1-team2')) {
                semi1Winner = document.getElementById('semi1-team2-label').textContent;
                logDebug('Semifinal 1 winner is Team 2:', semi1Winner);
            }

            let semi2Winner = null;
            if (isRadioChecked('semi2-team1')) {
                semi2Winner = document.getElementById('semi2-team1-label').textContent;
                logDebug('Semifinal 2 winner is Team 1:', semi2Winner);
            } else if (isRadioChecked('semi2-team2')) {
                semi2Winner = document.getElementById('semi2-team2-label').textContent;
                logDebug('Semifinal 2 winner is Team 2:', semi2Winner);
            }

            // Update upper final labels
            setLabelText('upperfinal-team1-label', semi1Winner);
            setLabelText('upperfinal-team2-label', semi2Winner);

            // Update lower bracket round 2 with semifinal losers
            updateLowerBracketRound2WithSemifinalsLosers();

            logDebug('Upper final update complete');
        } catch (e) {
            logError('Error updating upper final', e);
        }
    }

    // Update lower bracket round 2 with semifinals losers
    function updateLowerBracketRound2WithSemifinalsLosers() {
        try {
            logDebug('Updating lower bracket round 2 with semifinal losers');

            // Get semifinal 1 loser
            if (isRadioChecked('semi1-team1')) {
                // If team 1 won, team 2 is the loser
                const loser = document.getElementById('semi1-team2-label').textContent;
                setLabelText('lower4-team2-label', loser);
                logDebug('Semifinal 1 loser (Team 2):', loser);
            } else if (isRadioChecked('semi1-team2')) {
                // If team 2 won, team 1 is the loser
                const loser = document.getElementById('semi1-team1-label').textContent;
                setLabelText('lower4-team2-label', loser);
                logDebug('Semifinal 1 loser (Team 1):', loser);
            }

            // Get semifinal 2 loser
            if (isRadioChecked('semi2-team1')) {
                // If team 1 won, team 2 is the loser
                const loser = document.getElementById('semi2-team2-label').textContent;
                setLabelText('lower3-team2-label', loser);
                logDebug('Semifinal 2 loser (Team 2):', loser);
            } else if (isRadioChecked('semi2-team2')) {
                // If team 2 won, team 1 is the loser
                const loser = document.getElementById('semi2-team1-label').textContent;
                setLabelText('lower3-team2-label', loser);
                logDebug('Semifinal 2 loser (Team 1):', loser);
            }

            logDebug('Lower bracket round 2 update with semifinal losers complete');
        } catch (e) {
            logError('Error updating lower bracket round 2 with semifinal losers', e);
        }
    }

    // Update lower round 2 based on lower round 1 selections
    function updateLowerRound2() {
        try {
            logDebug('Updating lower round 2');

            // Get winner from lower round 1, match 1
            const lower1Winner = getSelectedTeamLabel('lower1');
            if (lower1Winner) {
                setLabelText('lower3-team1-label', lower1Winner);
                logDebug('Lower Round 1 Match 1 winner:', lower1Winner);
            }

            // Get winner from lower round 1, match 2
            const lower2Winner = getSelectedTeamLabel('lower2');
            if (lower2Winner) {
                setLabelText('lower4-team1-label', lower2Winner);
                logDebug('Lower Round 1 Match 2 winner:', lower2Winner);
            }

            logDebug('Lower round 2 update complete');
        } catch (e) {
            logError('Error updating lower round 2', e);
        }
    }

    // Update lower semifinal based on lower round 2 selections
    function updateLowerSemiFinal() {
        try {
            logDebug('Updating lower semifinal');

            // Get winner from lower round 2, match 1
            const lower3Winner = getSelectedTeamLabel('lower3');
            if (lower3Winner) {
                setLabelText('lowersemi-team1-label', lower3Winner);
                logDebug('Lower Round 2 Match 1 winner:', lower3Winner);
            }

            // Get winner from lower round 2, match 2
            const lower4Winner = getSelectedTeamLabel('lower4');
            if (lower4Winner) {
                setLabelText('lowersemi-team2-label', lower4Winner);
                logDebug('Lower Round 2 Match 2 winner:', lower4Winner);
            }

            logDebug('Lower semifinal update complete');
        } catch (e) {
            logError('Error updating lower semifinal', e);
        }
    }

    // Update small final based on upper final and lower semifinal selections
    function updateSmallFinal() {
        try {
            logDebug('Updating small final');

            // Get winner from lower semifinal
            const lowerSemiWinner = getSelectedTeamLabel('lowersemi');
            if (lowerSemiWinner) {
                setLabelText('smallfinal-team2-label', lowerSemiWinner);
                logDebug('Lower semifinal winner:', lowerSemiWinner);
            }

            // Update small final with upper final loser
            updateSmallFinalWithUpperFinalLoser();

            logDebug('Small final update complete');
        } catch (e) {
            logError('Error updating small final', e);
        }
    }

    // Update small final with upper final loser
    function updateSmallFinalWithUpperFinalLoser() {
        try {
            logDebug('Updating small final with upper final loser');

            // Get upper final loser
            if (isRadioChecked('upperfinal-team1')) {
                // If team 1 won, team 2 is the loser
                const loser = document.getElementById('upperfinal-team2-label').textContent;
                setLabelText('smallfinal-team1-label', loser);
                logDebug('Upper final loser (Team 2):', loser);
            } else if (isRadioChecked('upperfinal-team2')) {
                // If team 2 won, team 1 is the loser
                const loser = document.getElementById('upperfinal-team1-label').textContent;
                setLabelText('smallfinal-team1-label', loser);
                logDebug('Upper final loser (Team 1):', loser);
            }

            logDebug('Small final update with upper final loser complete');
        } catch (e) {
            logError('Error updating small final with upper final loser', e);
        }
    }

    // Update grand final based on upper final and small final selections
    function updateGrandFinal() {
        try {
            logDebug('Updating grand final');

            // Get upper final winner
            let upperFinalWinner = null;
            if (isRadioChecked('upperfinal-team1')) {
                upperFinalWinner = document.getElementById('upperfinal-team1-label').textContent;
                logDebug('Upper final winner (Team 1):', upperFinalWinner);
            } else if (isRadioChecked('upperfinal-team2')) {
                upperFinalWinner = document.getElementById('upperfinal-team2-label').textContent;
                logDebug('Upper final winner (Team 2):', upperFinalWinner);
            }

            // Get small final winner
            const smallFinalWinner = getSelectedTeamLabel('smallfinal');
            logDebug('Small final winner:', smallFinalWinner);

            // Update grand final labels
            setLabelText('grandfinal-team1-label', upperFinalWinner);
            setLabelText('grandfinal-team2-label', smallFinalWinner);

            logDebug('Grand final update complete');
        } catch (e) {
            logError('Error updating grand final', e);
        }
    }

    // Helper function to get the selected team label text
    function getSelectedTeamLabel(matchName) {
        try {
            // Construct the radio input IDs
            const team1Id = `${matchName}-team1`;
            const team2Id = `${matchName}-team2`;

            // Check which team is selected
            if (isRadioChecked(team1Id)) {
                const labelText = document.getElementById(`${team1Id}-label`).textContent;
                logDebug(`${matchName} winner is Team 1:`, labelText);
                return labelText;
            } else if (isRadioChecked(team2Id)) {
                const labelText = document.getElementById(`${team2Id}-label`).textContent;
                logDebug(`${matchName} winner is Team 2:`, labelText);
                return labelText;
            }

            return null;
        } catch (e) {
            logError(`Error getting selected team label for ${matchName}`, e);
            return null;
        }
    }

    // Function to update all bracket labels based on current selections
    function updateAllBracketLabels() {
        logDebug('Updating all bracket labels');
        updateSemifinals();
        updateUpperFinal();
        updateLowerRound2();
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
                    element.addEventListener('click', callback);
                    logDebug(`Added click listener to ${element.id || 'element'}`);
                });
            }

            // Upper Bracket event listeners
            addEventListenersToSelector('.upper-quarterfinals-pick', updateSemifinals);
            addEventListenersToSelector('.upper-semifinals-pick', updateUpperFinal);
            addEventListenersToSelector('.upper-final-pick', function() {
                updateSmallFinalWithUpperFinalLoser();
                updateGrandFinal();
            });

            // Lower Bracket event listeners
            addEventListenersToSelector('#lower-round1 .lower-rounds-pick', updateLowerRound2);
            addEventListenersToSelector('#lower-round2 .lower-rounds-pick', updateLowerSemiFinal);
            addEventListenersToSelector('#lower-semifinal .lower-rounds-pick', updateSmallFinal);
            addEventListenersToSelector('#small-final .finals-pick', updateGrandFinal);

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
        setupLowerBracket: setupLowerBracket,
        updateSemifinals: updateSemifinals,
        updateUpperFinal: updateUpperFinal,
        updateLowerBracketRound1: updateLowerBracketRound1,
        updateLowerRound2: updateLowerRound2,
        updateLowerSemiFinal: updateLowerSemiFinal,
        updateSmallFinal: updateSmallFinal,
        updateSmallFinalWithUpperFinalLoser: updateSmallFinalWithUpperFinalLoser,
        updateGrandFinal: updateGrandFinal,
        updateAllBracketLabels: updateAllBracketLabels,
        initialize: initialize
    };

    // Initialize when the DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        // DOM is already ready, initialize immediately
        initialize();
    }
})();