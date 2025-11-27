document.addEventListener('DOMContentLoaded', () => {
    const bootSequenceContainer = document.getElementById('boot-sequence');
    const dashboardContainer = document.getElementById('dashboard');
    const mainUiContainer = document.getElementById('main-ui');
    const foldersPanel = document.getElementById('folders-panel');
    const contentPanel = document.getElementById('content-panel');
    const footerContainer = document.getElementById('footer');

    let currentFolderIndex = 0;

    const bootSequence = [
        'INITIALIZING USCSS NOSTROMO PERSONAL TERMINAL...',
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
        'PRESS ANY KEY TO CONTINUE...'
    ];

    function typeWriter(text, container, index, callback) {
        if (index < text.length) {
            container.innerHTML += text.charAt(index);
            index++;
            setTimeout(() => typeWriter(text, container, index, callback), 25);
        } else if (callback) {
            callback();
        }
    }

    function runBootSequence() {
        let lineIndex = 0;
        function nextLine() {
            if (lineIndex < bootSequence.length) {
                const p = document.createElement('p');
                bootSequenceContainer.appendChild(p);
                typeWriter(bootSequence[lineIndex], p, 0, nextLine);
                lineIndex++;
            } else {
                document.addEventListener('keydown', showDashboard, { once: true });
            }
        }
        nextLine();
    }

    function showDashboard() {
        bootSequenceContainer.classList.add('hidden');
        dashboardContainer.classList.remove('hidden');
        footerContainer.classList.remove('hidden');
        renderDashboard();
        setTimeout(() => {
             document.addEventListener('keydown', showMainUi, { once: true });
        }, 1000)
    }

    function showMainUi() {
        dashboardContainer.classList.add('hidden');
        mainUiContainer.classList.remove('hidden');
        renderMainUi();
        document.addEventListener('keydown', handleKeyPress);
    }

    function renderDashboard() {
        const status = getShipStatusData();
        const crew = getCrewData();
        dashboardContainer.innerHTML = `
            <div class="box"><h2>SYSTEM DASHBOARD</h2></div>
            <div class="box">
                <h3>SHIP STATUS OVERVIEW</h3>
                <p><strong>POSITION:</strong> ${status.position}</p>
                <p><strong>DESTINATION:</strong> ${status.destination}</p>
                <p><strong>ENERGY LEVEL:</strong> <span class="warning">${status.energyLevel}</span></p>
                <p><strong>LIFE SUPPORT:</strong> ${status.lifeSupport}</p>
            </div>
            <div class="box">
                <h3>CREW OVERVIEW</h3>
                <p><strong>ASSIGNED PERSONNEL:</strong> ${crew.length}</p>
                <p><strong>STATUS:</strong> All crew accounted for.</p>
            </div>
        `;
    }

    const folders = [
        { name: 'CREW ROSTER', content: getCrewContent },
        { name: 'SHIP STATUS', content: getStatusContent },
        { name: 'NAVIGATION', content: getNavContent },
        { name: 'SHIP LOGS', content: getLogContent },
        { name: 'SELF-DESTRUCT', content: getDestructContent }
    ];

    function renderMainUi() {
        foldersPanel.innerHTML = '<h3>FOLDERS</h3>';
        folders.forEach((folder, index) => {
            const div = document.createElement('div');
            div.textContent = folder.name;
            div.classList.add('folder-item');
            if (index === currentFolderIndex) {
                div.classList.add('selected');
            }
            foldersPanel.appendChild(div);
        });
        contentPanel.innerHTML = folders[currentFolderIndex].content();
    }

    function handleKeyPress(e) {
        switch (e.key) {
            case 'ArrowUp':
                currentFolderIndex = (currentFolderIndex > 0) ? currentFolderIndex - 1 : folders.length - 1;
                renderMainUi();
                break;
            case 'ArrowDown':
                currentFolderIndex = (currentFolderIndex < folders.length - 1) ? currentFolderIndex + 1 : 0;
                renderMainUi();
                break;
            case 'PageUp':
                contentPanel.scrollTop -= 100;
                break;
            case 'PageDown':
                contentPanel.scrollTop += 100;
                break;
        }
    }

    // Data and Content Functions
    function getCrewData() {
        return [
            { name: 'Arthur Dallas', role: "Captain/Ship's Master" },
            { name: 'Thomas Kane', role: 'Executive Officer' },
            { name: 'Ellen Ripley', role: 'Warrant Officer' },
            { name: 'Ash', role: 'Science Officer' },
            { name: 'Joan Lambert', role: 'Navigation Officer' },
            { name: 'Dennis Parker', role: 'Chief Engineer' },
            { name: 'Samuel Brett', role: 'Engineers Mate/Engineering Technician' },
            { name: 'Jones', role: "Ship's cat" }
        ];
    }

    function getCrewContent() {
        const crew = getCrewData();
        let content = '<h3>CREW ROSTER</h3>';
        crew.forEach(member => {
            content += `
                <div class="box">
                    <p><strong>NAME:</strong> ${member.name}</p>
                    <p><strong>ROLE:</strong> ${member.role}</p>
                </div>
            `;
        });
        return content;
    }

    function getShipStatusData() {
        return {
            position: 'Orbiting LV-426, Zeta-2 Reticuli System',
            destination: 'Sol System (Rerouted)',
            energyLevel: '75% (Minor fluctuations detected)',
            speed: 'Sub-light, maintaining stable orbit',
            oxygenLevel: '98% (Nominal)',
            lifeSupport: 'ONLINE',
            engines: 'ONLINE (Requires maintenance)',
            communications: 'OFFLINE (Atmospheric interference)'
        };
    }

    function getStatusContent() {
        const status = getShipStatusData();
        let content = '<h3>SHIP STATUS</h3>';
        for (const key in status) {
            const capitalizedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            content += `<p><strong>${capitalizedKey}:</strong> ${status[key]}</p>`;
        }
        return `<div class="box">${content}</div>`;
    }

    function getNavContent() {
        return `
            <div class="box">
                <h3>NAVIGATION</h3>
                <p><strong>CURRENT COURSE:</strong> Rerouted to LV-426, Zeta-2 Reticuli System</p>
                <p><strong>ORIGINAL DESTINATION:</strong> Sol System</p>
                <pre>
        * (Sol System) <--[Route Home]-- * (Thedus)
                                            |
                                            | [Current Position]
                                            V
                                        * (LV-426)
                </pre>
            </div>
        `;
    }

    function getLogContent() {
        return `
            <div class="box">
                <h3>SHIP'S LOG</h3>
                <p><strong>DEPARTURE:</strong> Earth, 2120</p>
                <ul>
                    <li>Departed Earth on a one-month trip to Neptune.</li>
                    <li>Connected with cargo hauler at Neptune.</li>
                    <li>Departed for Thedus on an eight-month interstellar journey.</li>
                </ul>
                <p><strong>ARRIVAL:</strong> Thedus</p>
                <ul>
                    <li>Spent eight weeks loading cargo.</li>
                    <li>Shuttle 'Salmacis' damaged in a loading accident.</li>
                    <li>Science Officer replaced with Ash (Synthetic) two days before departure.</li>
                    <li>Departed Thedus for Sol System.</li>
                </ul>
                <p><strong>INCIDENT:</strong> LV-426, June 3, 2122</p>
                <ul>
                    <li>Return trip rerouted to investigate an unidentified signal from Acheron (LV-426).</li>
                    <li>Ship damaged during landing, causing an electrical fire.</li>
                    <li>Executive Officer Kane brought back with an unknown organism attached.</li>
                    <li>Quarantine broken by Science Officer Ash.</li>
                </ul>
            </div>
        `;
    }

    function getDestructContent() {
        return `
            <div class="box">
                <h3>SELF-DESTRUCT SEQUENCE</h3>
                <p class="warning">WARNING: UNAUTHORIZED ACCESS</p>
                <p>This terminal does not have the required clearance to initiate the self-destruct sequence. Please use the emergency console on the bridge.</p>
            </div>
        `;
    }

    runBootSequence();
});