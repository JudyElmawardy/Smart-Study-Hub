// DOM Elements
const quoteText = document.getElementById('quoteText');
const quoteAuthor = document.getElementById('quoteAuthor');
const nextBtn = document.getElementById('nextBtn');
const shareBtn = document.getElementById('shareBtn');

// Motivational Quotes API
const API_URL = "https://api.adviceslip.com/advice";

// Load the daily quote when page opens
loadDailyQuote();

// Button to manually load new quote
nextBtn.addEventListener("click", getNewQuote);
shareBtn.addEventListener("click", copyQuote);

// ---- FUNCTIONS ----

// Load the stored quote OR get a fresh one every 24 hours
function loadDailyQuote() {
    const savedQuote = localStorage.getItem("dailyQuote");
    const savedDate = localStorage.getItem("quoteDate");
    const today = new Date().toDateString();
    
    if (savedQuote && savedDate === today) {
        // Show stored quote
        quoteText.textContent = `"${savedQuote}"`;
        quoteAuthor.textContent = "";
    } else {
        // Get a new quote from API
        getNewDailyQuote();
    }
}

// Get a NEW quote and save it for 24 hours
function getNewDailyQuote() {
    quoteText.textContent = "Loading quote…";
    quoteAuthor.textContent = "";
    
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            const quote = data.slip.advice;
            quoteText.textContent = `"${quote}"`;
            quoteAuthor.textContent = "";
            
            // Save for next 24 hours
            localStorage.setItem("dailyQuote", quote);
            localStorage.setItem("quoteDate", new Date().toDateString());
        })
        .catch(() => {
            quoteText.textContent = "Failed to load quote. Try again.";
        });
}

// Button: Get a fresh quote (does NOT change the daily one)
function getNewQuote() {
    nextBtn.disabled = true;
    quoteText.textContent = "Loading quote…";
    quoteAuthor.textContent = "";
    
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            quoteText.textContent = `"${data.slip.advice}"`;
            quoteAuthor.textContent = "";
        })
        .catch(() => {
            quoteText.textContent = "Could not load new quote.";
        })
        .finally(() => {
            nextBtn.disabled = false;
        });
}

// Copy Quote Function
async function copyQuote() {
    const text = quoteText.textContent;
    
    if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        shareBtn.textContent = "Copied!";
        setTimeout(() => (shareBtn.textContent = "Copy"), 1200);
    }
}