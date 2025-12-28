// Timer Variables
let timerInterval = null;
let totalSeconds = 0;
let isRunning = false;
let currentMode = 'focus';
let totalFocusSeconds = 0;
let totalBreakSeconds = 0;

// DOM Elements
const minutesInput = document.getElementById('minutes-input');
const secondsInput = document.getElementById('seconds-input');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const focusModeBtn = document.getElementById('focus-mode');
const breakModeBtn = document.getElementById('break-mode');
const focusTimeDisplay = document.getElementById('focus-time');
const breakTimeDisplay = document.getElementById('break-time');
const soundCheckbox = document.getElementById('sound-checkbox');
const presetButtons = document.querySelectorAll('.preset-btn');

// Todo List Elements
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const todoList = document.getElementById('todo-list');
const clearCompletedBtn = document.getElementById('clear-completed-btn');

// Timer Functions
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function updateDisplay() {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    minutesInput.value = String(mins).padStart(2, '0');
    secondsInput.value = String(secs).padStart(2, '0');
}

function getTimeFromInputs() {
    const mins = parseInt(minutesInput.value) || 0;
    const secs = parseInt(secondsInput.value) || 0;
    return (mins * 60) + secs;
}

function updateStats() {
    focusTimeDisplay.textContent = formatTime(totalFocusSeconds);
    breakTimeDisplay.textContent = formatTime(totalBreakSeconds);
}

function startTimer() {
    if (isRunning) return;
    
    if (totalSeconds === 0) {
        totalSeconds = getTimeFromInputs();
        if (totalSeconds === 0) {
            alert('Please set a time!');
            return;
        }
    }
    
    minutesInput.disabled = true;
    secondsInput.disabled = true;
    
    isRunning = true;
    timerInterval = setInterval(function() {
        if (totalSeconds > 0) {
            totalSeconds--;
            updateDisplay();
            
            if (currentMode === 'focus') {
                totalFocusSeconds++;
            } else {
                totalBreakSeconds++;
            }
            updateStats();
            
            if (soundCheckbox.checked) {
                playTickSound();
            }
        } else {
            pauseTimer();
            playAlarmSound();
        }
    }, 1000);
}

function pauseTimer() {
    isRunning = false;
    clearInterval(timerInterval);
    minutesInput.disabled = false;
    secondsInput.disabled = false;
}

function resetTimer() {
    pauseTimer();
    totalSeconds = 0;
    minutesInput.value = '00';
    secondsInput.value = '00';
    minutesInput.disabled = false;
    secondsInput.disabled = false;
}

function setTimer(minutes) {
    resetTimer();
    totalSeconds = minutes * 60;
    minutesInput.value = String(minutes).padStart(2, '0');
    secondsInput.value = '00';
}

function switchMode(mode) {
    currentMode = mode;
    
    if (mode === 'focus') {
        focusModeBtn.classList.add('active');
        breakModeBtn.classList.remove('active');
    } else {
        breakModeBtn.classList.add('active');
        focusModeBtn.classList.remove('active');
    }
    
    resetTimer();
}

function playTickSound() {
    if (soundCheckbox.checked) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        gainNode.gain.value = 0.1;
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.05);
    }
}

function playAlarmSound() {
    if (currentMode === 'focus') {
        alert('Time is up! Take a break!');
    } else {
        alert('Break is over! Ready to focus?');
    }
}

// Event Listeners
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

focusModeBtn.addEventListener('click', function() {
    switchMode('focus');
});

breakModeBtn.addEventListener('click', function() {
    switchMode('break');
});

presetButtons.forEach(function(button) {
    button.addEventListener('click', function() {
        const minutes = parseInt(this.getAttribute('data-minutes'));
        setTimer(minutes);
    });
});

// Todo List Functions
function createTaskElement(taskText) {
    const li = document.createElement('li');
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.addEventListener('change', function() {
        if (this.checked) {
            li.classList.add('completed');
        } else {
            li.classList.remove('completed');
        }
    });
    
    const span = document.createElement('span');
    span.textContent = taskText;
    
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '❌';
    deleteBtn.style.marginLeft = 'auto';
    deleteBtn.style.border = 'none';
    deleteBtn.style.background = 'transparent';
    deleteBtn.style.cursor = 'pointer';
    deleteBtn.style.fontSize = '16px';
    deleteBtn.addEventListener('click', function() {
        li.remove();
    });
    
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);
    
    return li;
}

function addTask() {
    const taskText = taskInput.value.trim();
    
    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }
    
    const taskElement = createTaskElement(taskText);
    todoList.appendChild(taskElement);
    taskInput.value = '';
}

function clearCompletedTasks() {
    const completedTasks = document.querySelectorAll('#todo-list li.completed');
    completedTasks.forEach(function(task) {
        task.remove();
    });
}

// Event Listeners
addTaskBtn.addEventListener('click', addTask);

taskInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addTask();
    }
});

clearCompletedBtn.addEventListener('click', clearCompletedTasks);

// Initialize
minutesInput.value = '00';
secondsInput.value = '00';
updateStats();

// Validate inputs
minutesInput.addEventListener('input', function() {
    let value = parseInt(this.value);
    if (value > 99) this.value = 99;
    if (value < 0) this.value = 0;
});

secondsInput.addEventListener('input', function() {
    let value = parseInt(this.value);
    if (value > 59) this.value = 59;
    if (value < 0) this.value = 0;
});