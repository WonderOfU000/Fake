document.addEventListener("DOMContentLoaded", function() {
    const commands = {
        'nmap -sP 192.168.1.0/24': 'Host is up (0.0024s latency).',
        'ping -c 4 google.com': '64 bytes from google.com: icmp_seq=1 ttl=54 time=10.1 ms',
        'ssh user@192.168.1.10': 'Connection established to 192.168.1.10',
        'telnet 192.168.1.20 80': 'Trying 192.168.1.20... Connected.',
        'curl -I http://example.com': 'HTTP/1.1 200 OK',
        'clear': ''
    };

    const errors = [
        'Permission Denied',
        'Intrusion Detected',
        'Access Denied',
        'Command not found'
    ];

    const outputDiv = document.getElementById('output');
    const userInput = document.getElementById('userInput');
    const cursor = document.querySelector('.blinking-cursor');
    const terminal = document.querySelector('.terminal');
    const modal = document.getElementById('modal');
    const modalMessage = document.getElementById('modalMessage');

    let lastProgressTime = 0;

    function generateError() {
        const randomIndex = Math.floor(Math.random() * errors.length);
        return errors[randomIndex];
    }

    function addLogEntry(command, response, isError = false) {
        const logEntry = document.createElement('div');
        logEntry.innerHTML = `<span class="command">${command}</span><br><span class="response ${isError ? 'error' : ''}">${response}</span>`;
        outputDiv.appendChild(logEntry);
        outputDiv.scrollTop = outputDiv.scrollHeight; // Vertical auto-scroll
    }

    function addProgressBar() {
        const progressBarContainer = document.createElement('div');
        progressBarContainer.classList.add('progress-bar');
        const progressBar = document.createElement('div');
        progressBar.classList.add('progress');
        progressBarContainer.appendChild(progressBar);
        outputDiv.appendChild(progressBarContainer);

        let width = 0;
        const interval = setInterval(() => {
            width += 1;
            progressBar.style.width = width + '%';
            outputDiv.scrollTop = outputDiv.scrollHeight; // Vertical auto-scroll
            if (width >= 100) clearInterval(interval);
        }, 50); // Increment width every 50ms for smooth progress

        outputDiv.scrollTop = outputDiv.scrollHeight; // Vertical auto-scroll
    }

    function autoTypeCommand(command) {
        let i = 0;
        const typingInterval = setInterval(() => {
            userInput.value += command[i];
            cursor.style.left = userInput.value.length * 0.6 + 'em'; // Move cursor dynamically
            i++;
            if (i === command.length) {
                clearInterval(typingInterval);
                userInput.dispatchEvent(new KeyboardEvent('keypress', {'key': 'Enter'}));
            }
        }, 100);
    }

    function handleCommand(command) {
        if (command === 'clear') {
            outputDiv.innerHTML = '';
            userInput.value = '';
            cursor.style.left = '0';
            return;
        }

        const response = commands[command];
        const currentTime = new Date().getTime();
        const shouldShowProgress = currentTime - lastProgressTime > 20000;

        if (response) {
            setTimeout(() => {
                addLogEntry(command, 'Connecting to darknet...', false);
                if (shouldShowProgress) {
                    addProgressBar();
                    lastProgressTime = currentTime;
                }
                setTimeout(() => {
                    addLogEntry(command, response, false);
                    userInput.value = '';
                    cursor.style.left = '0';
                    // Add interactive effects
                    terminal.classList.add('shake');
                    setTimeout(() => terminal.classList.remove('shake'), 500); // Shake effect
                    showNotification('Connected to darknet');
                }, shouldShowProgress ? 5000 : 0); // Simulate processing time with progress bar
            }, 500); // Initial delay before showing processing message
        } else {
            setTimeout(() => {
                addLogEntry(command, 'Attempting access...', false);
                if (shouldShowProgress) {
                    addProgressBar();
                    lastProgressTime = currentTime;
                }
                setTimeout(() => {
                    addLogEntry(command, generateError(), true);
                    userInput.value = '';
                    cursor.style.left = '0';
                    // Add interactive effects
                    terminal.classList.add('shake');
                    setTimeout(() => terminal.classList.remove('shake'), 500); // Shake effect
                    showNotification('Access Denied', true);
                }, shouldShowProgress ? 5000 : 0); // Simulate processing time for error with progress bar
            }, 500); // Initial delay before showing processing message
        }
    }

    function showNotification(message, isError = false) {
        modalMessage.textContent = message;
        modal.style.borderColor = isError ? 'red' : '#00ff00';
        modal.classList.add('show');
        setTimeout(() => modal.classList.remove('show'), 3000);
    }

    userInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            const command = userInput.value;
            if (command.trim() !== '') {
                handleCommand(command);
            } else {
                addProgressBar(); // Show progress bar for blank inputs
                setTimeout(() => {
                    addLogEntry(command, 'No command entered', true);
                    userInput.value = '';
                    cursor.style.left = '0';
                }, 5000); // Simulate processing time for blank input with progress bar
            }
        }
    });

    // Auto-typing example
    document.addEventListener('keydown', function(event) {
        if (event.key === 'F2') { // Press F2 to auto-type a command
            const randomCommand = Object.keys(commands)[Math.floor(Math.random() * Object.keys(commands).length)];
            autoTypeCommand(randomCommand);
        }
    });

    // Move cursor inside the input container
    document.querySelector('.input-container').appendChild(cursor);
});

function closeModal() {
    const modal = document.getElementById('modal');
    modal.classList.remove('show');
}
