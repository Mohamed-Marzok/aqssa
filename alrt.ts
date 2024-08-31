document.addEventListener('DOMContentLoaded', () => {
    // Get references to DOM elements
    const hourSelect = document.getElementById("hour-select") as HTMLSelectElement;
    const minuteSelect = document.getElementById("minute-select") as HTMLSelectElement;
    const ampmSelect = document.getElementById("ampm-select") as HTMLSelectElement;
    const setAlarmButton = document.getElementById("set-alarm") as HTMLButtonElement;
    const snoozeButton = document.getElementById("snooze") as HTMLButtonElement;
    const stopButton = document.getElementById("stop") as HTMLButtonElement;
    const customAlert = document.getElementById("custom-alert") as HTMLElement;
    const alertMessage = document.getElementById("alert-message") as HTMLElement;
    const alertOkButton = document.getElementById("alert-ok-button") as HTMLButtonElement;
    const alarmSound = document.getElementById("alarm-sound") as HTMLAudioElement;

    // Variables to track alarm state
    let alarmTime: string | null = null; // Stores the set alarm time
    let alarmInterval: NodeJS.Timeout | null = null; // Interval to check the current time
    let snoozeTimeout: NodeJS.Timeout | null = null; // Timeout for snooze functionality
    let alarmTimeout: NodeJS.Timeout | null = null; // Timeout to stop the alarm after 30 seconds

    // Initially hide the snooze and stop buttons
    snoozeButton.style.display = 'none';
    stopButton.style.display = 'none';

    // Function to populate hour and minute select options
    function populateOptions() {
        // Populate hour options (1-12)
        for (let i = 1; i <= 12; i++) {
            const hourOption = document.createElement('option');
            hourOption.value = String(i).padStart(2, '0');
            hourOption.textContent = String(i).padStart(2, '0');
            hourSelect.appendChild(hourOption);
        }

        // Populate minute options (00-59)
        for (let i = 0; i < 60; i++) {
            const minuteOption = document.createElement('option');
            minuteOption.value = String(i).padStart(2, '0');
            minuteOption.textContent = String(i).padStart(2, '0');
            minuteSelect.appendChild(minuteOption);
        }
    }

    // Function to update the current time display every second
    function updateTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        currentTimeDisplay.textContent = `${hours}:${minutes}:${seconds}`;
        
        // Check if current time matches the alarm time
        if (alarmTime && `${hours}:${minutes}` === alarmTime) {
            triggerAlarm();
        }
    }

    // Function to trigger the alarm
    function triggerAlarm() {
        // Stop checking time when the alarm rings
        if (alarmInterval) {
            clearInterval(alarmInterval);
        }

        // Clear any existing snooze timeouts
        if (snoozeTimeout) {
            clearTimeout(snoozeTimeout);
        }

        // Play the alarm sound
        if (alarmSound) {
            alarmSound.play();
        }

        // Show the snooze and stop buttons
        snoozeButton.style.display = 'block';
        stopButton.style.display = 'block';

        // Set a timeout to stop the alarm after 30 seconds if no action is taken
        alarmTimeout = setTimeout(() => {
            stopAlarm();
        }, 30 * 1000); // 30 seconds timeout
    }

    // Function to set the alarm based on user input
    function setAlarm() {
        const hour = hourSelect.value;
        const minute = minuteSelect.value;
        const ampm = ampmSelect.value;

        // Validate that all inputs are selected
        if (hour && minute && ampm) {
            // Convert the selected time to 24-hour format
            alarmTime = `${hour}:${minute}`;
            if (ampm === 'PM' && hour !== '12') {
                alarmTime = `${String(Number(hour) + 12).padStart(2, '0')}:${minute}`;
            } else if (ampm === 'AM' && hour === '12') {
                alarmTime = `00:${minute}`;
            }

            // Display the set alarm time
            alarmTimeDisplay.textContent = `Alarm is set for ${hour}:${minute} ${ampm}`;
        } else {
            alarmTimeDisplay.textContent = 'Please select a valid time.';
            return;
        }

        // Clear any existing interval before setting a new one
        if (alarmInterval) {
            clearInterval(alarmInterval);
        }

        // Set an interval to check the time every second
        alarmInterval = setInterval(updateTime, 1000);

        // Reset alarm time display when a new alarm is set
        snoozeButton.style.display = 'none';
        stopButton.style.display = 'none';
    }

    // Function to snooze the alarm for 5 minutes
    function snoozeAlarm() {
        // Pause the alarm sound and reset it to the beginning
        if (alarmSound) {
            alarmSound.pause();
            alarmSound.currentTime = 0;
        }

        // Disable the snooze and stop buttons during the snooze period
        snoozeButton.disabled = true;
        stopButton.disabled = true;

        // Clear the 30-second timeout to stop the alarm
        if (alarmTimeout) {
            clearTimeout(alarmTimeout);
        }

        // Set a timeout to trigger the alarm again after 5 minutes
        snoozeTimeout = setTimeout(() => {
            triggerAlarm();
        }, 5 * 60 * 1000); // Snooze for 5 minutes

        // Update alarm time display
        alarmTimeDisplay.textContent = 'Alarm snoozed for 5 minutes.';
    }

    // Function to stop the alarm
    function stopAlarm() {
        // Pause the alarm sound and reset it to the beginning
        if (alarmSound) {
            alarmSound.pause();
            alarmSound.currentTime = 0;
        }

        // Clear the interval and any snooze timeouts
        if (alarmInterval) {
            clearInterval(alarmInterval);
        }
        if (snoozeTimeout) {
            clearTimeout(snoozeTimeout);
        }

        // Clear the 30-second timeout to stop the alarm
        if (alarmTimeout) {
            clearTimeout(alarmTimeout);
        }

        // Disable the snooze and stop buttons and hide them
        snoozeButton.disabled = true;
        stopButton.disabled = true;
        snoozeButton.style.display = 'none';
        stopButton.style.display = 'none';

        // Reset the alarm time
        alarmTime = null;

        // Update alarm time display
        alarmTimeDisplay.textContent = 'Alarm stopped.';
    }

    // Initialize the hour and minute options
    populateOptions();

    // Add event listeners for the set, snooze, and stop buttons
    setAlarmButton.addEventListener('click', setAlarm);
    snoozeButton.addEventListener('click', snoozeAlarm);
    stopButton.addEventListener('click', stopAlarm);

    // Initial call to display the current time immediately
    updateTime();

    // Update the time display every second
    setInterval(updateTime, 1000);
});
