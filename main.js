document.addEventListener('DOMContentLoaded', function () {
    // Get references to DOM elements
    var hourSelect = document.getElementById("hour-select");
    var minuteSelect = document.getElementById("minute-select");
    var ampmSelect = document.getElementById("ampm-select");
    var setAlarmButton = document.getElementById("set-alarm");
    var snoozeButton = document.getElementById("snooze");
    var stopButton = document.getElementById("stop");
    var customAlert = document.getElementById("custom-alert");
    var alertMessage = document.getElementById("alert-message");
    var alertOkButton = document.getElementById("alert-ok-button");
    var alarmSound = document.getElementById("alarm-sound");
    var currentTimeDisplay = document.getElementById("current-time");
    var alarmTimeDisplay = document.getElementById("alarm-time-display");
    // Variables to track alarm state
    var alarmTime = null; // Stores the set alarm time
    var alarmInterval = null; // Interval to check the current time
    var snoozeTimeout = null; // Timeout for snooze functionality
    var alarmTimeout = null; // Timeout to stop the alarm after 30 seconds
    // Initially hide the snooze and stop buttons
    snoozeButton.style.display = 'none';
    stopButton.style.display = 'none';
    // Function to populate hour and minute select options
    function populateOptions() {
        // Populate hour options (1-12)
        for (var i = 1; i <= 12; i++) {
            var hourOption = document.createElement('option');
            hourOption.value = String(i).padStart(2, '0');
            hourOption.textContent = String(i).padStart(2, '0');
            hourSelect.appendChild(hourOption);
        }
        // Populate minute options (00-59)
        for (var i = 0; i < 60; i++) {
            var minuteOption = document.createElement('option');
            minuteOption.value = String(i).padStart(2, '0');
            minuteOption.textContent = String(i).padStart(2, '0');
            minuteSelect.appendChild(minuteOption);
        }
    }
    // Function to update the current time display every second
    function updateTime() {
        var now = new Date();
        var hours = String(now.getHours()).padStart(2, '0');
        var minutes = String(now.getMinutes()).padStart(2, '0');
        var seconds = String(now.getSeconds()).padStart(2, '0');
        if (currentTimeDisplay) {
            currentTimeDisplay.textContent = "".concat(hours, ":").concat(minutes, ":").concat(seconds);
        }
        // Check if current time matches the alarm time
        if (alarmTime && "".concat(hours, ":").concat(minutes) === alarmTime) {
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
        alarmTimeout = setTimeout(function () {
            stopAlarm();
        }, 30 * 1000); // 30 seconds timeout
    }
    // Function to set the alarm based on user input
    function setAlarm() {
        var hour = hourSelect.value;
        var minute = minuteSelect.value;
        var ampm = ampmSelect.value;
        // Validate that all inputs are selected
        if (hour && minute && ampm) {
            // Convert the selected time to 24-hour format
            alarmTime = "".concat(hour, ":").concat(minute);
            if (ampm === 'PM' && hour !== '12') {
                alarmTime = "".concat(String(Number(hour) + 12).padStart(2, '0'), ":").concat(minute);
            }
            else if (ampm === 'AM' && hour === '12') {
                alarmTime = "00:".concat(minute);
            }
            // Display the set alarm time
            if (alarmTimeDisplay) {
                alarmTimeDisplay.textContent = "Alarm is set for ".concat(hour, ":").concat(minute, " ").concat(ampm);
            }
        }
        else {
            if (alarmTimeDisplay) {
                alarmTimeDisplay.textContent = 'Please select a valid time.';
            }
            return;
        }
        // Clear any existing interval before setting a new one
        if (alarmInterval) {
            clearInterval(alarmInterval);
        }
        // Set an interval to check the time every second
        alarmInterval = setInterval(updateTime, 1000);
        // Reset snooze and stop button states
        snoozeButton.style.display = 'none';
        stopButton.style.display = 'none';
        snoozeButton.disabled = false;
        stopButton.disabled = false;
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
        snoozeTimeout = setTimeout(function () {
            triggerAlarm();
        }, 5 * 60 * 1000); // Snooze for 5 minutes
        // Update alarm time display
        if (alarmTimeDisplay) {
            alarmTimeDisplay.textContent = 'Alarm snoozed for 5 minutes.';
        }
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
        // Disable and hide the snooze and stop buttons
        snoozeButton.disabled = true;
        stopButton.disabled = true;
        snoozeButton.style.display = 'none';
        stopButton.style.display = 'none';
        // Reset the alarm time
        alarmTime = null;
        // Update alarm time display
        if (alarmTimeDisplay) {
            alarmTimeDisplay.textContent = 'Alarm stopped.';
        }
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
