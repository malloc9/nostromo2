document.addEventListener('DOMContentLoaded', () => {
    const terminal = document.getElementById('terminal');
    let commandHistory = [];
    let historyIndex = -1;
    let inDestructSequence = false;
    let destructStep = 0;
    const destructCode = "MUTHUR";

    function writeToTerminal(element) {
        const inputContainer = document.getElementById('input-container');
        if (inputContainer) {
            terminal.insertBefore(element, inputContainer);
        } else {
            terminal.appendChild(element);
        }
        scrollToBottom();
    }

    function scrollToBottom() {
        window.scrollTo(0, document.body.scrollHeight);
    }

    const bootSequence = [
        'INITIALIZING USCSS NOSTROMO TERMINAL...',
        'SYSTEM CHECK IN PROGRESS...',
        'MEMORY: 28K RAM OK',
        'LOADING CORE SYSTEMS...',
        'CONNECTING TO MU/TH/UR 6000...',
        'CONNECTION ESTABLISHED.',
        'LOADING SHIP DATABANKS...',
        'CREW ROSTER: LOADED',
        'SHIP STATUS: LOADED',
        'NAVIGATION: LOADED',
        'LOGS: LOADED',
        'BOOT SEQUENCE COMPLETE.',
    ];

    let i = 0;
    function typeBootSequence() {
        if (i < bootSequence.length) {
            const p = document.createElement('p');
            p.textContent = bootSequence[i];
            terminal.appendChild(p);
            i++;
            setTimeout(typeBootSequence, 200);
            scrollToBottom();
        } else {
            showMainMenu();
            createInput();
        }
    }

    function showMainMenu() {
        const p = document.createElement('p');
        p.innerHTML = `
            <p>AWAITING COMMAND...</p>
            <p>AVAILABLE MODULES:</p>
            <ul>
                <li>CREW</li>
                <li>STATUS</li>
                <li>NAV</li>
                <li>LOG</li>
                <li>DESTRUCT</li>
                <li>MENU</li>
            </ul>
        `;
        writeToTerminal(p);
    }

    function createInput() {
        const inputContainer = document.createElement('div');
        inputContainer.id = 'input-container';
        const span = document.createElement('span');
        span.textContent = '> ';
        const input = document.createElement('input');
        input.type = 'text';
        input.id = 'command-input';
        input.autofocus = true;

        inputContainer.appendChild(span);
        inputContainer.appendChild(input);
        terminal.appendChild(inputContainer);

        input.focus();

        input.addEventListener('keydown', handleCommand);
        scrollToBottom();
    }

    function handleCommand(e) {
        if (e.key === 'Enter') {
            const command = e.target.value.trim().toUpperCase();
            const output = document.createElement('p');
            output.textContent = `> ${command}`;
            writeToTerminal(output);

            if (inDestructSequence) {
                handleDestructCommand(command);
            } else {
                commandHistory.unshift(command);
                historyIndex = -1;
                processCommand(command);
            }
            e.target.value = '';
        } else if (e.key === 'ArrowUp') {
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                e.target.value = commandHistory[historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            if (historyIndex > 0) {
                historyIndex--;
                e.target.value = commandHistory[historyIndex];
            } else if (historyIndex === 0) {
                historyIndex = -1;
                e.target.value = '';
            }
        }
    }

    function processCommand(command) {
        switch (command) {
            case 'CREW':
                showCrewRoster();
                break;
            case 'STATUS':
                showShipStatus();
                break;
            case 'NAV':
                showNavigation();
                break;
            case 'LOG':
                showLog();
                break;
            case 'DESTRUCT':
                initiateSelfDestruct();
                break;
            case 'MENU':
                showMainMenu();
                break;
            default:
                const p = document.createElement('p');
                p.textContent = `UNKNOWN COMMAND: ${command}`;
                writeToTerminal(p);
        }
    }

    function showCrewRoster() {
        const crew = [
            { name: 'Arthur Dallas', role: "Captain/Ship's Master" },
            { name: 'Thomas Kane', role: 'Executive Officer' },
            { name: 'Ellen Ripley', role: 'Warrant Officer' },
            { name: 'Ash', role: 'Science Officer' },
            { name: 'Joan Lambert', role: 'Navigation Officer' },
            { name: 'Dennis Parker', role: 'Chief Engineer' },
            { name: 'Samuel Brett', role: 'Engineers Mate/Engineering Technician' },
            { name: 'Jones', role: "Ship's cat" }
        ];

        const p = document.createElement('p');
        p.innerHTML = '<h3>CREW ROSTER</h3>';
        const ul = document.createElement('ul');
        crew.forEach(member => {
            const li = document.createElement('li');
            li.textContent = `${member.name} - ${member.role}`;
            ul.appendChild(li);
        });
        p.appendChild(ul);
        writeToTerminal(p);
    }

    function showShipStatus() {
        const status = {
            position: 'Orbiting LV-426, Zeta-2 Reticuli System',
            destination: 'Sol System (Rerouted)',
            energyLevel: '75% (Minor fluctuations detected)',
            speed: 'Sub-light, maintaining stable orbit',
            oxygenLevel: '98% (Nominal)',
            lifeSupport: 'ONLINE',
            engines: 'ONLINE (Requires maintenance)',
            communications: 'OFFLINE (Atmospheric interference)'
        };

        const p = document.createElement('p');
        p.innerHTML = '<h3>SHIP STATUS</h3>';
        const ul = document.createElement('ul');
        for (const key in status) {
            const li = document.createElement('li');
            const capitalizedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, function(str){ return str.toUpperCase() });
            li.textContent = `${capitalizedKey}: ${status[key]}`;
            ul.appendChild(li);
        }
        p.appendChild(ul);
        writeToTerminal(p);
    }

    function showNavigation() {
        const p = document.createElement('p');
        p.innerHTML = `
            <h3>NAVIGATION</h3>
            <p>CURRENT COURSE: Rerouted to LV-426, Zeta-2 Reticuli System</p>
            <p>ORIGINAL DESTINATION: Sol System</p>
            <br>
            <pre>
    * (Sol System) <--[Route Home]-- * (Thedus)
                                        |
                                        | [Current Position]
                                        V
                                    * (LV-426)
            </pre>
        `;
        writeToTerminal(p);
    }

    function showLog() {
        const log = `
<pre>
LOG: USCSS NOSTROMO - LAST VOYAGE

DEPARTURE: Earth, 2120
- Departed Earth on a one-month trip to Neptune.
- Connected with cargo hauler at Neptune.
- Departed for Thedus on an eight-month interstellar journey.

ARRIVAL: Thedus
- Spent eight weeks loading cargo.
- Shuttle 'Salmacis' damaged in a loading accident.
- Science Officer replaced with Ash (Synthetic) two days before departure.
- Departed Thedus for Sol System.

INCIDENT: LV-426, June 3, 2122
- Return trip rerouted to investigate an unidentified signal from Acheron (LV-426).
- Ship damaged during landing due to dust in an engine intake, causing an electrical fire.
- Executive Officer Thomas Kane brought back to the ship with an unknown organism attached.
- Quarantine procedure broken by Science Officer Ash.
- Departed LV-426 despite several non-critical systems remaining unrepaired.
</pre>
        `;
        const p = document.createElement('p');
        p.innerHTML = '<h3>SHIP\'S LOG</h3>' + log;
        writeToTerminal(p);
    }

    function initiateSelfDestruct() {
        inDestructSequence = true;
        destructStep = 1;
        const p = document.createElement('p');
        p.textContent = 'WARNING: Are you sure you want to initiate the self-destruct sequence? (YES/NO)';
        writeToTerminal(p);
    }

    function handleDestructCommand(command) {
        if (destructStep === 1) {
            if (command === 'YES') {
                const p = document.createElement('p');
                p.textContent = 'Enter activation code:';
                writeToTerminal(p);
                destructStep = 2;
            } else {
                abortDestruct();
            }
        } else if (destructStep === 2) {
            if (command === destructCode) {
                startDestructCountdown();
            } else {
                const p = document.createElement('p');
                p.textContent = 'Incorrect code.';
                writeToTerminal(p);
                abortDestruct();
            }
        }
    }

    function abortDestruct() {
        const p = document.createElement('p');
        p.textContent = 'Self-destruct sequence aborted.';
        writeToTerminal(p);
        inDestructSequence = false;
        destructStep = 0;
    }

    function startDestructCountdown() {
        const p = document.createElement('p');
        p.textContent = 'Self-destruct sequence activated. T-minus 10 seconds.';
        writeToTerminal(p);
        let countdown = 10;
        const interval = setInterval(() => {
            countdown--;
            const p = document.createElement('p');
            p.textContent = `T-${countdown}`;
            writeToTerminal(p);
            if (countdown === 0) {
                clearInterval(interval);
                const finalP = document.createElement('p');
                finalP.textContent = 'SHIP WILL DETONATE IN T-MINUS 0 SECONDS. GOODBYE.';
                writeToTerminal(finalP);
                document.getElementById('command-input').disabled = true;
            }
        }, 1000);
    }

    typeBootSequence();
});
