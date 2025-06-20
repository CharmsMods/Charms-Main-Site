document.addEventListener('DOMContentLoaded', () => {
    const cssOptionsPanel = document.getElementById('css-options');
    const jsOptionsPanel = document.getElementById('js-options');
    const cssOutput = document.getElementById('css-output');
    const jsOutput = document.getElementById('js-output');
    const cssTabBtn = document.querySelector('.tab-btn[data-tab="css"]');
    const jsTabBtn = document.querySelector('.tab-btn[data-tab="js"]');
    const copyCodeBtn = document.getElementById('copy-code');
    const downloadCodeBtn = document.getElementById('download-code');
    const jsCodePre = document.getElementById('js-code');

    // Function to update slider value display and trigger code generation
    document.querySelectorAll('input[type="range"]').forEach(slider => {
        const valueSpan = slider.nextElementSibling; // Assuming span is immediately after slider
        if (valueSpan && valueSpan.classList.contains('slider-value')) {
            valueSpan.textContent = slider.value;
            slider.addEventListener('input', () => {
                valueSpan.textContent = slider.value;
                if (jsOptionsPanel.classList.contains('active')) { // Only generate if JS tab is active
                    generateJavaScriptCode();
                }
            });
        }
    });

    // Event listeners for checkboxes, selects, text inputs, and color inputs
    jsOptionsPanel.querySelectorAll('input[type="checkbox"], select, input[type="text"], input[type="color"], textarea').forEach(input => {
        input.addEventListener('change', () => {
            if (jsOptionsPanel.classList.contains('active')) { // Only generate if JS tab is active
                generateJavaScriptCode();
            }
        });
        if (input.type === 'text' || input.tagName === 'TEXTAREA') {
            input.addEventListener('input', () => { // Use 'input' for live text updates
                if (jsOptionsPanel.classList.contains('active')) { // Only generate if JS tab is active
                    generateJavaScriptCode();
                }
            });
        }
    });

    // Tab switching logic
    cssTabBtn.addEventListener('click', () => {
        cssOptionsPanel.classList.add('active');
        jsOptionsPanel.classList.remove('active');
        cssOutput.classList.add('active');
        jsOutput.classList.remove('active');
        cssTabBtn.classList.add('active');
        jsTabBtn.classList.remove('active');
        // If you had a CSS generator function, you'd call it here
        // generateCssCode();
        Prism.highlightAll();
    });

    jsTabBtn.addEventListener('click', () => {
        jsOptionsPanel.classList.add('active');
        cssOptionsPanel.classList.remove('active');
        jsOutput.classList.add('active');
        cssOutput.classList.remove('active');
        jsTabBtn.classList.add('active');
        cssTabBtn.classList.remove('active');
        generateJavaScriptCode(); // Ensure JS code is generated when its tab is selected
        Prism.highlightAll();
    });

    // Copy and Download functionality
    copyCodeBtn.addEventListener('click', () => {
        const activeOutput = document.querySelector('.file-output.active code');
        if (activeOutput) {
            navigator.clipboard.writeText(activeOutput.textContent).then(() => {
                const originalText = copyCodeBtn.textContent;
                copyCodeBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyCodeBtn.textContent = originalText;
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy code: ', err);
            });
        }
    });

    downloadCodeBtn.addEventListener('click', () => {
        const activeOutput = document.querySelector('.file-output.active code');
        if (activeOutput) {
            const fileContent = activeOutput.textContent;
            const isCss = activeOutput.id === 'css-code';
            const filename = isCss ? 'mod.css' : 'mod.js';
            const blob = new Blob([fileContent], { type: isCss ? 'text/css' : 'text/javascript' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    });

    // Utility to convert hex to PlayCanvas Color object (only if needed by an option)
    function hexToPcColor(hex) {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;
        return new pc.Color(r, g, b, 1);
    }

    // Function to find an entity by name (recursive) - included as it was in original JS
    function findByName(entity, name) {
        if (!entity) return null;
        if (entity.name === name) return entity;
        for (let i = 0; i < entity.children.length; i++) {
            const found = findByName(entity.children[i], name);
            if (found) return found;
        }
        return null;
    }

    function generateJavaScriptCode() {
        // Get values from HTML elements using their correct IDs from index.html
        const adLeaderboardDisplay = document.getElementById('adLeaderboardDisplayCheckbox').checked;
        const featuredStreamerDisplay = document.getElementById('featuredStreamerDisplayCheckbox').checked;
        const menuBackgroundOpacity = document.getElementById('menuBackgroundOpacitySlider').value;
        const menuButtonsBackgroundColor = document.getElementById('menuButtonsBackgroundColorInput').value;
        const autoReadyMatch = document.getElementById('autoReadyMatchCheckbox').checked;
        const autoRespawn = document.getElementById('autoRespawnCheckbox').checked;
        const autoReload = document.getElementById('autoReloadCheckbox').checked;
        const weaponSwapDelay = document.getElementById('weaponSwapDelaySlider').value;
        const crosshairColor = document.getElementById('crosshairColorInput').value;
        const crosshairThickness = document.getElementById('crosshairThicknessSlider').value;
        const customMessageEnabled = document.getElementById('customMessageEnabledCheckbox').checked;
        const customMessageContent = document.getElementById('customMessageContentTextarea').value;
        const randomMessageHotkey = document.getElementById('randomMessageHotkeySelect').value;
        const chatCommand = document.getElementById('chatCommandInput').value;
        const customFunctionEnabled = document.getElementById('customFunctionEnabledCheckbox').checked;
        const customFunctionCode = document.getElementById('customFunctionCodeTextarea').value;


        let jsCode = `
// Game Mod JavaScript Code Generated by Dynamic Game Mod Code Generator

// Utility to convert hex to PlayCanvas Color object
function hexToPcColor(hex) {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return new pc.Color(r, g, b, 1);
}

// Function to find an entity by name (recursive)
function findByName(entity, name) {
    if (!entity) return null;
    if (entity.name === name) return entity;
    for (let i = 0; i < entity.children.length; i++) {
        const found = findByName(entity.children[i], name);
        if (found) return found;
    }
    return null;
}

pc.app.on("Map:Loaded", () => {
    setTimeout(() => {
        applyModifications();
    }, 500); // Small delay to ensure all game assets are loaded
});

function applyModifications() {
    console.log("Applying JavaScript modifications...");

    const menuRoot = pc.app.root.findByName("Menu"); // Assuming a root entity for the menu
    if (menuRoot) {
        // Display toggles
        const adLeaderboard = menuRoot.findByName("AdLeaderboard"); // Assuming name
        if (adLeaderboard) adLeaderboard.enabled = ${adLeaderboardDisplay};
        const featuredStreamer = menuRoot.findByName("FeaturedStreamer"); // Assuming name
        if (featuredStreamer) featuredStreamer.enabled = ${featuredStreamerDisplay};
    }

    // Opacity
    const menuBackground = pc.app.root.findByName("MenuBackground"); // Assuming entity for background
    if (menuBackground && menuBackground.element) {
        menuBackground.element.opacity = ${menuBackgroundOpacity};
    }

    // Buttons Styling (placeholder, relies on game's internal structure)
    // Example: menuRoot.findByName("PlayButton")?.element.color = hexToPcColor("${menuButtonsBackgroundColor}");
    if ("${menuButtonsBackgroundColor}" !== "#000000") { // Only apply if not default black
        console.log("Menu button background color set to: ${menuButtonsBackgroundColor}. Actual implementation depends on game's specific API for UI elements.");
    }
    
    // Gameplay Features
    if (${autoReadyMatch}) {
        pc.app.on("Match:Waiting", () => {
            if (pc.app.fire("Network:IsHost")) { // Or other condition to prevent spamming
                pc.app.fire("Network:Ready");
                console.log("Auto-readying for match.");
            }
        });
    }

    if (${autoRespawn}) {
        pc.app.on("Player:Death", () => {
            setTimeout(() => {
                pc.app.fire("Network:Respawn");
                console.log("Auto-respawning.");
            }, 1000); // Adjust delay as needed
        });
    }

    if (${autoReload}) {
        pc.app.on("Weapon:Empty", (weapon) => {
            if (weapon && typeof weapon.reload === 'function') { // Ensure weapon and reload method exist
                weapon.reload();
                console.log("Auto-reloading " + weapon.name);
            }
        });
    }

    // Weapon Swap Delay
    if (${weaponSwapDelay} > 0) {
        console.log(\`Weapon swap delay set to ${weaponSwapDelay}ms. Implementation depends on game's specific API.\`);
        // Conceptual implementation - highly game specific
        // pc.app.scripts.list().forEach(script => {
        //     if (script.prototype.swapWeapon) {
        //         const originalSwapWeapon = script.prototype.swapWeapon;
        //         script.prototype.swapWeapon = function(...args) {
        //             setTimeout(() => {
        //                 originalSwapWeapon.apply(this, args);
        //             }, ${weaponSwapDelay});
        //         };
        //     }
        // });
    }

    // Crosshair
    pc.app.on("UI:Ready", () => {
        const crosshairEntity = pc.app.root.findByName("Crosshair"); // Replace with actual crosshair entity name
        if (crosshairEntity && crosshairEntity.element) {
            crosshairEntity.element.color = hexToPcColor("${crosshairColor}");
            // Assuming crosshair thickness affects scale or a specific dimension
            crosshairEntity.setLocalScale(${crosshairThickness}, ${crosshairThickness}, 1);
            console.log("Crosshair style updated.");
        }
    });

    // Custom Chat Message
    if (${customMessageEnabled}) {
        const messages = [\`${customMessageContent.replace(/`/g, '\\`')}\`]; // Escape backticks in content
        function sendRandomMessage() {
            const randomIndex = Math.floor(Math.random() * messages.length);
            const message = messages[randomIndex];
            pc.app.fire("Network:Chat", message);
            console.log("Sent custom message:", message);
        }

        document.addEventListener("keydown", (event) => {
            if (event.key === "${randomMessageHotkey}" && messages[0].length > 0) { // Only send if message exists
                sendRandomMessage();
            }
        });
        console.log(\`Custom chat message enabled. Hotkey: ${randomMessageHotkey}\`);
    }

    // Custom Chat Command
    if (\`${chatCommand}\`.trim() !== "") {
        pc.app.on("Network:Chat", (messageData) => {
            if (messageData.message.startsWith("${chatCommand}")) {
                const commandArgs = messageData.message.substring("${chatCommand}".length).trim();
                console.log(\`Custom command "${chatCommand}" executed with args: \${commandArgs}\`);
                // Implement your custom command logic here based on commandArgs
                // Example: pc.app.fire("Game:DoSomething", commandArgs);
            }
        });
        console.log(\`Custom chat command enabled: ${chatCommand}\`);
    }

    // Custom Function Execution
    if (${customFunctionEnabled}) {
        try {
            eval(\`${customFunctionCode.replace(/`/g, '\\`')}\`); // DANGER: Use with extreme caution. Only with trusted code.
            console.log("Custom function code executed.");
        } catch (e) {
            console.error("Error executing custom function code:", e);
        }
    }

} // End applyModifications function

// Initial code generation on page load and tab switch
generateJavaScriptCode();
Prism.highlightAll(); // Re-highlight the code
`;

        jsCodePre.textContent = jsCode;
        Prism.highlightElement(jsCodePre);
    }

    // Initial generation on load, ensuring JS tab is shown
    jsOptionsPanel.classList.add('active');
    jsOutput.classList.add('active');
    jsTabBtn.classList.add('active'); // Ensure the JS tab button itself is active
    generateJavaScriptCode();
});