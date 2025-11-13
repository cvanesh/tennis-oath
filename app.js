// ========================================
// OATH QUESTIONS
// ========================================

const OATH_QUESTIONS = [
    {
        icon: '😊',
        text: 'I am here to have fun and enjoy the game of tennis.'
    },
    {
        icon: '📈',
        text: 'I commit to focus on my improvement and growth, not on winning or losing.'
    },
    {
        icon: '🎯',
        text: 'I will stay process-oriented and trust my preparation.'
    },
    {
        icon: '💭',
        text: 'I accept that mistakes are part of learning. I will not vent or get upset with myself.'
    },
    {
        icon: '🧠',
        text: 'I will keep a clear mind and stay present during every point.'
    },
    {
        icon: '🤝',
        text: 'I respect my opponent and will compete with integrity and sportsmanship.'
    },
    {
        icon: '💪',
        text: 'I will be tough when it matters and let go of what doesn\'t.'
    },
    {
        icon: '❤️',
        text: 'I love tennis. There is nowhere else I want to be right now.'
    },
    {
        icon: '🏆',
        text: 'I am not here to prove anything to anyone, only to challenge myself.'
    },
    {
        icon: '🎾',
        text: 'I will treat my racket with care and respect, because it represents someone\'s hard work and sacrifice.'
    },
    {
        icon: '🧹',
        text: 'Before each point, I will clear any stray balls from the court for safe, clean play.'
    },
    {
        icon: '✌️',
        text: 'I commit to giving my best effort and leaving everything on the court.'
    }
];

// ========================================
// STATE MANAGEMENT
// ========================================

class OathApp {
    constructor() {
        this.acknowledged = new Set();
        this.signedDates = [];
        this.viewMonth = new Date();  // Track current viewing month
        this.viewMonth.setHours(0, 0, 0, 0);
        this.init();
    }

    init() {
        this.loadData();
        this.loadTheme();
        this.renderQuestions();
        this.renderCalendar();
        this.updateStreakDisplay();
        this.updateStats();
        this.setupEventListeners();
    }

    // ========================================
    // LOCAL STORAGE MANAGEMENT
    // ========================================

    saveData() {
        const data = {
            acknowledged: Array.from(this.acknowledged),
            signedDates: this.signedDates
        };
        localStorage.setItem('oathData', JSON.stringify(data));
    }

    loadData() {
        const saved = localStorage.getItem('oathData');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.acknowledged = new Set(data.acknowledged || []);
                this.signedDates = data.signedDates || [];
            } catch (e) {
                console.error('Error loading data:', e);
                this.acknowledged = new Set();
                this.signedDates = [];
            }
        }
    }

    // ========================================
    // RENDERING
    // ========================================

    renderQuestions() {
        const container = document.getElementById('questionsContainer');
        container.innerHTML = '';

        OATH_QUESTIONS.forEach((question, index) => {
            const questionEl = document.createElement('div');
            questionEl.className = 'question-item';
            if (this.acknowledged.has(index)) {
                questionEl.classList.add('acknowledged');
            }

            questionEl.innerHTML = `
                <div class="question-tick">
                    ✓
                </div>
                <div class="question-content">
                    <div class="question-text">
                        <span class="question-icon">${question.icon}</span>
                        ${question.text}
                    </div>
                </div>
            `;

            questionEl.addEventListener('click', () => this.toggleQuestion(index));
            container.appendChild(questionEl);
        });
    }

    renderCalendar() {
        const container = document.getElementById('calendarGrid');
        container.innerHTML = '';

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const viewYear = this.viewMonth.getFullYear();
        const viewMonthNum = this.viewMonth.getMonth();

        // Add day headers (Mon, Tue, Wed, etc.)
        const dayHeaders = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        dayHeaders.forEach(day => {
            const headerEl = document.createElement('div');
            headerEl.className = 'calendar-day-header';
            headerEl.textContent = day;
            container.appendChild(headerEl);
        });

        // Get first day of month and number of days
        const firstDay = new Date(viewYear, viewMonthNum, 1).getDay();
        // Adjust for Monday start (0 = Sunday in JS, we want Monday = 0)
        const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;
        const daysInMonth = new Date(viewYear, viewMonthNum + 1, 0).getDate();

        // Add empty cells for days before month starts
        for (let i = 0; i < adjustedFirstDay; i++) {
            const emptyEl = document.createElement('div');
            emptyEl.className = 'calendar-day empty';
            container.appendChild(emptyEl);
        }

        // Add days of month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-day';
            dayEl.textContent = day;

            const dateStr = `${viewYear}-${String(viewMonthNum + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const currentDayDate = new Date(viewYear, viewMonthNum, day);
            currentDayDate.setHours(0, 0, 0, 0);

            if (this.signedDates.includes(dateStr)) {
                dayEl.classList.add('visited');
            }

            if (currentDayDate.getTime() === today.getTime()) {
                dayEl.classList.add('today');
            }

            container.appendChild(dayEl);
        }
    }

    updateCalendarMonth(direction) {
        // direction: 1 for next month, -1 for previous month
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const newMonth = new Date(this.viewMonth);
        newMonth.setMonth(newMonth.getMonth() + direction);
        newMonth.setHours(0, 0, 0, 0);

        // Don't allow going beyond current month
        if (newMonth > today) {
            return;
        }

        this.viewMonth = newMonth;
        this.renderCalendar();
        this.updateCalendarHeader();
    }

    updateCalendarHeader() {
        const monthEl = document.getElementById('calendarMonth');
        if (!monthEl) return;

        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                          'July', 'August', 'September', 'October', 'November', 'December'];
        
        const monthName = monthNames[this.viewMonth.getMonth()];
        const year = this.viewMonth.getFullYear();
        monthEl.textContent = `${monthName} ${year}`;

        // Disable prev button if at the oldest month with signed dates
        const prevBtn = document.getElementById('calendarPrev');
        const nextBtn = document.getElementById('calendarNext');
        
        if (prevBtn) {
            // Check if there are any signed dates before this month
            const oldestDate = this.signedDates.length > 0 
                ? new Date(this.signedDates.sort()[0])
                : new Date();
            oldestDate.setHours(0, 0, 0, 0);
            oldestDate.setDate(1);

            const currentMonthStart = new Date(this.viewMonth);
            currentMonthStart.setDate(1);

            prevBtn.disabled = currentMonthStart <= oldestDate;
        }

        if (nextBtn) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const nextMonth = new Date(this.viewMonth);
            nextMonth.setMonth(nextMonth.getMonth() + 1);
            nextMonth.setDate(1);
            
            nextBtn.disabled = nextMonth > today;
        }
    }

    updateStreakDisplay() {
        const streakEl = document.getElementById('streakDays');
        const streak = this.calculateStreak();
        streakEl.textContent = streak;
    }

    updateStats() {
        const totalEl = document.getElementById('totalSigns');
        const weekEl = document.getElementById('weekSigns');

        totalEl.textContent = this.signedDates.length;

        // Count signs this week
        const today = new Date();
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const weekCount = this.signedDates.filter(dateStr => {
            const date = new Date(dateStr);
            return date >= weekAgo && date <= today;
        }).length;

        weekEl.textContent = weekCount;
    }

    updateSignButton() {
        const signBtn = document.getElementById('signButton');
        const signHelper = document.getElementById('signHelper');
        const allAcknowledged = this.acknowledged.size === OATH_QUESTIONS.length;

        signBtn.disabled = !allAcknowledged;

        if (allAcknowledged) {
            signHelper.textContent = '👋 Ready to sign! Go have fun on the court!';
            signHelper.style.color = 'var(--success-color)';
        } else {
            signHelper.textContent = `Acknowledge all 10 points above (${this.acknowledged.size}/10)`;
            signHelper.style.color = 'var(--text-light)';
        }
    }

    // ========================================
    // INTERACTIONS
    // ========================================

    toggleQuestion(index) {
        if (this.acknowledged.has(index)) {
            this.acknowledged.delete(index);
        } else {
            this.acknowledged.add(index);
        }
        this.saveData();
        
        // Update only the clicked row instead of re-rendering all
        const questionItems = document.querySelectorAll('.question-item');
        if (questionItems[index]) {
            const item = questionItems[index];
            if (this.acknowledged.has(index)) {
                item.classList.add('acknowledged');
            } else {
                item.classList.remove('acknowledged');
            }
        }
        
        this.updateSignButton();
    }

    signOath() {
        if (this.acknowledged.size !== OATH_QUESTIONS.length) {
            return;
        }

        // Add today's date
        const today = new Date();
        const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

        if (!this.signedDates.includes(dateStr)) {
            this.signedDates.push(dateStr);
        }

        this.saveData();
        this.showSuccessMessage();
        this.updateStreakDisplay();
        this.updateStats();
        this.renderCalendar();

        // Reset for next time
        setTimeout(() => {
            this.acknowledged.clear();
            this.renderQuestions();
            this.updateSignButton();
            this.saveData();
        }, 2000);
    }

    calculateStreak() {
        if (this.signedDates.length === 0) return 0;

        // Sort dates in descending order (newest first)
        const sorted = [...this.signedDates].sort().reverse();
        let streak = 1; // Start with 1 since we have at least one date
        let currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        // Get the most recent signed date
        const mostRecentDateStr = sorted[0];
        const mostRecentDate = new Date(mostRecentDateStr);
        mostRecentDate.setHours(0, 0, 0, 0);

        // If most recent date is not today, start from that date
        currentDate = new Date(mostRecentDate);
        currentDate.setDate(currentDate.getDate() - 1);

        // Check for consecutive days
        for (let i = 1; i < sorted.length; i++) {
            const dateStr = sorted[i];
            const date = new Date(dateStr);
            date.setHours(0, 0, 0, 0);

            const diffTime = currentDate.getTime() - date.getTime();
            const diffDays = diffTime / (1000 * 60 * 60 * 24);

            // If dates are consecutive (diffDays === 0), continue streak
            if (diffDays === 0) {
                streak++;
                currentDate.setDate(currentDate.getDate() - 1);
            } else {
                // Streak is broken
                break;
            }
        }

        return streak;
    }

    showSuccessMessage() {
        // Show confirmation
        const signBtn = document.getElementById('signButton');
        const originalText = signBtn.innerHTML;

        signBtn.innerHTML = '<span class="button-icon">🎾</span> Oath Signed!';
        signBtn.style.background = 'linear-gradient(135deg, var(--success-color) 0%, #1e8449 100%)';

        // Create confetti
        this.createConfetti();

        setTimeout(() => {
            signBtn.innerHTML = originalText;
            signBtn.style.background = '';
        }, 2000);
    }

    createConfetti() {
        const container = document.getElementById('confetti-container');
        const confettiPieces = 50;
        const colors = ['#2ecc71', '#3498db', '#f39c12', '#e74c3c', '#9b59b6'];

        for (let i = 0; i < confettiPieces; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = '-10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.width = (Math.random() * 10 + 5) + 'px';
            confetti.style.height = (Math.random() * 10 + 5) + 'px';
            confetti.style.opacity = Math.random();
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;

            container.appendChild(confetti);

            const duration = Math.random() * 1500 + 1500;
            const randomX = (Math.random() - 0.5) * 300;

            confetti.animate([
                {
                    transform: `translateY(0) translateX(0) rotate(0deg)`,
                    opacity: 1
                },
                {
                    transform: `translateY(${window.innerHeight + 100}px) translateX(${randomX}px) rotate(${Math.random() * 720}deg)`,
                    opacity: 0
                }
            ], {
                duration: duration,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                fill: 'forwards'
            });

            setTimeout(() => confetti.remove(), duration);
        }
    }

    // ========================================
    // EVENT LISTENERS
    // ========================================

    setupEventListeners() {
        const signBtn = document.getElementById('signButton');
        signBtn.addEventListener('click', () => this.signOath());

        // Settings button
        const settingsBtn = document.getElementById('settingsBtn');
        const settingsModal = document.getElementById('settingsModal');
        const closeSettings = document.getElementById('closeSettings');
        const appTitle = document.getElementById('appTitle');

        console.log('Settings Elements:', {
            settingsBtn: !!settingsBtn,
            settingsModal: !!settingsModal,
            closeSettings: !!closeSettings
        });

        if (settingsBtn && settingsModal) {
            settingsBtn.addEventListener('click', (e) => {
                console.log('Settings button clicked, adding active class');
                e.preventDefault();
                e.stopPropagation();
                settingsModal.classList.add('active');
                console.log('Modal classes:', settingsModal.className);
            });
        }

        if (closeSettings && settingsModal) {
            closeSettings.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                settingsModal.classList.remove('active');
            });
        }

        if (settingsModal) {
            settingsModal.addEventListener('click', (e) => {
                if (e.target === settingsModal) {
                    settingsModal.classList.remove('active');
                }
            });
        }

        // Theme toggle
        const lightTheme = document.getElementById('lightTheme');
        const darkTheme = document.getElementById('darkTheme');

        console.log('Theme buttons found:', {
            lightTheme: !!lightTheme,
            darkTheme: !!darkTheme
        });

        if (lightTheme) {
            lightTheme.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Light theme clicked - calling setTheme(light)');
                console.log('Before:', {
                    isDark: document.body.classList.contains('dark-mode'),
                    bodyClasses: document.body.className
                });
                this.setTheme('light');
                console.log('After:', {
                    isDark: document.body.classList.contains('dark-mode'),
                    bodyClasses: document.body.className
                });
            });
        }
        if (darkTheme) {
            darkTheme.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Dark theme clicked - calling setTheme(dark)');
                console.log('Before:', {
                    isDark: document.body.classList.contains('dark-mode'),
                    bodyClasses: document.body.className
                });
                this.setTheme('dark');
                console.log('After:', {
                    isDark: document.body.classList.contains('dark-mode'),
                    bodyClasses: document.body.className
                });
            });
        }

        // View toggle
        const viewOath = document.getElementById('viewOath');
        const viewCalendar = document.getElementById('viewCalendar');

        if (viewOath) viewOath.addEventListener('click', () => this.showView('oath'));
        if (viewCalendar) viewCalendar.addEventListener('click', () => this.showView('calendar'));

        // Calendar navigation
        const calendarPrev = document.getElementById('calendarPrev');
        const calendarNext = document.getElementById('calendarNext');

        if (calendarPrev) {
            calendarPrev.addEventListener('click', () => {
                this.updateCalendarMonth(-1);
            });
        }

        if (calendarNext) {
            calendarNext.addEventListener('click', () => {
                this.updateCalendarMonth(1);
            });
        }

        // App title click to go back to main
        if (appTitle) appTitle.addEventListener('click', () => this.showView('oath'));

        // Update sign button state
        this.updateSignButton();
        this.updateThemeButtons();
        this.updateViewButtons();
    }


    setTheme(theme) {
        localStorage.setItem('theme', theme);
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        this.updateThemeButtons();
    }

    loadTheme() {
        const theme = localStorage.getItem('theme') || 'light';
        this.setTheme(theme);
    }

    updateThemeButtons() {
        const lightTheme = document.getElementById('lightTheme');
        const darkTheme = document.getElementById('darkTheme');
        const isDark = document.body.classList.contains('dark-mode');

        console.log('updateThemeButtons called:', {
            lightTheme: !!lightTheme,
            darkTheme: !!darkTheme,
            isDark: isDark,
            bodyClasses: document.body.className
        });

        if (lightTheme) {
            lightTheme.classList.toggle('active', !isDark);
        }
        if (darkTheme) {
            darkTheme.classList.toggle('active', isDark);
        }
    }

    showView(view) {
        const oathSection = document.getElementById('oathSection');
        const calendarSection = document.getElementById('calendarSection');
        const viewOath = document.getElementById('viewOath');
        const viewCalendar = document.getElementById('viewCalendar');
        const settingsModal = document.getElementById('settingsModal');

        if (view === 'oath') {
            oathSection.style.display = 'block';
            calendarSection.style.display = 'none';
            viewOath.classList.add('active');
            viewCalendar.classList.remove('active');
        } else {
            oathSection.style.display = 'none';
            calendarSection.style.display = 'block';
            viewOath.classList.remove('active');
            viewCalendar.classList.add('active');
            this.renderCalendar();
            this.updateCalendarHeader();
        }

        settingsModal.classList.remove('active');
    }

    updateViewButtons() {
        const oathSection = document.getElementById('oathSection');
        const viewOath = document.getElementById('viewOath');
        const viewCalendar = document.getElementById('viewCalendar');

        if (oathSection.style.display !== 'none') {
            viewOath.classList.add('active');
            viewCalendar.classList.remove('active');
        }
    }
}

// ========================================
// INITIALIZE APP
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    window.oathApp = new OathApp();
});
