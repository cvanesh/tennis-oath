// ========================================
// OATH QUESTIONS
// ========================================

const PLAYER_OATH_QUESTIONS = [
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

const PARENT_OATH_QUESTIONS = [
    {
        icon: '❤️',
        text: 'I am here to support my child\'s growth, joy, and love for tennis.'
    },
    {
        icon: '🧘',
        text: 'I will stay calm and composed when my child makes mistakes - they are learning.'
    },
    {
        icon: '😊',
        text: 'I will not show frustration, anger, or disappointment on court. I am my child\'s role model.'
    },
    {
        icon: '🤝',
        text: 'I commit to being gracious and courteous to all players, parents, coaches, and officials.'
    },
    {
        icon: '⚖️',
        text: 'I will not react negatively to questionable calls - sportsmanship comes first.'
    },
    {
        icon: '📚',
        text: 'I understand that mistakes are learning opportunities, not failures.'
    },
    {
        icon: '🌟',
        text: 'I will maintain professional decorum and create a positive learning environment.'
    },
    {
        icon: '💪',
        text: 'I will celebrate my child\'s effort and attitude, not just wins and losses.'
    },
    {
        icon: '🎯',
        text: 'I trust the process and keep the long-term development goal in mind.'
    },
    {
        icon: '🏆',
        text: 'I will encourage resilience and perseverance, even in challenging moments.'
    },
    {
        icon: '🎾',
        text: 'I will respect the game, the equipment, and everyone involved in this journey.'
    },
    {
        icon: '🌈',
        text: 'I am committed to making tennis a positive, enriching experience for my child.'
    }
];

// Keep backward compatibility
const OATH_QUESTIONS = PLAYER_OATH_QUESTIONS;

// ========================================
// STATE MANAGEMENT
// ========================================

class OathApp {
    constructor() {
        this.acknowledged = new Set();
        this.signedDates = [];
        this.viewMonth = new Date();  // Track current viewing month
        this.viewMonth.setHours(0, 0, 0, 0);
        this.currentRole = null;  // 'parent' or 'player'
        this.init();
    }

    init() {
        this.loadData();
        this.loadTheme();

        // Check if role is selected, if not show splash screen
        if (!this.currentRole) {
            this.showSplashScreen();
        } else {
            this.renderQuestions();
            this.renderCalendar();
            this.updateStreakDisplay();
            this.updateStats();
            this.updateRoleBadge();
        }

        this.setupEventListeners();
    }

    // ========================================
    // LOCAL STORAGE MANAGEMENT
    // ========================================

    saveData() {
        const data = {
            acknowledged: Array.from(this.acknowledged),
            signedDates: this.signedDates,
            currentRole: this.currentRole
        };
        localStorage.setItem('oathData', JSON.stringify(data));
    }

    loadData() {
        const saved = localStorage.getItem('oathData');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                // Validate role (must be 'parent', 'player', or null)
                const validRoles = ['parent', 'player'];
                this.currentRole = validRoles.includes(data.currentRole) ? data.currentRole : null;

                // Validate acknowledged indices (filter out invalid ones)
                const validAcknowledged = (data.acknowledged || []).filter(index =>
                    typeof index === 'number' && index >= 0
                );
                this.acknowledged = new Set(validAcknowledged);

                // Migrate old data structure to new format
                if (data.signedDates && data.signedDates.length > 0) {
                    if (typeof data.signedDates[0] === 'string') {
                        // Old format: array of date strings
                        this.signedDates = data.signedDates.map(dateStr => ({
                            date: dateStr,
                            roles: ['player']  // Assume old data was player
                        }));
                    } else {
                        // New format: array of objects - validate structure
                        this.signedDates = data.signedDates.filter(entry =>
                            entry && entry.date && Array.isArray(entry.roles)
                        );
                    }
                } else {
                    this.signedDates = [];
                }
            } catch (e) {
                console.error('Error loading data:', e);
                this.acknowledged = new Set();
                this.signedDates = [];
                this.currentRole = null;
            }
        }
    }

    // ========================================
    // RENDERING
    // ========================================

    renderQuestions() {
        const container = document.getElementById('questionsContainer');
        container.innerHTML = '';

        const questions = this.getCurrentOathQuestions();

        // Update oath header based on role
        this.updateOathHeader();

        questions.forEach((question, index) => {
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

    updateOathHeader() {
        const headerTitle = document.querySelector('.oath-header h2');
        const headerIntro = document.querySelector('.oath-intro');

        if (this.currentRole === 'parent') {
            if (headerTitle) headerTitle.textContent = 'Be the Example 🌟';
            if (headerIntro) headerIntro.textContent = 'Read each commitment and check it off to support your child\'s journey';
        } else {
            if (headerTitle) headerTitle.textContent = 'Lock In & Serve It!';
            if (headerIntro) headerIntro.textContent = 'Read each point and give it a click to check it off 💪';
        }
    }

    getCurrentOathQuestions() {
        return this.currentRole === 'parent' ? PARENT_OATH_QUESTIONS : PLAYER_OATH_QUESTIONS;
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

            // Find if this date has been signed and by which roles
            const signedEntry = this.signedDates.find(entry => entry.date === dateStr);
            if (signedEntry && signedEntry.roles) {
                const hasParent = signedEntry.roles.includes('parent');
                const hasPlayer = signedEntry.roles.includes('player');

                if (hasParent && hasPlayer) {
                    dayEl.classList.add('visited-both');
                } else if (hasParent) {
                    dayEl.classList.add('visited-parent');
                } else if (hasPlayer) {
                    dayEl.classList.add('visited-player');
                }
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
                ? new Date([...this.signedDates].sort((a, b) => a.date.localeCompare(b.date))[0].date)
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

        // Count total signs (each role per day counts as one)
        let totalSigns = 0;
        this.signedDates.forEach(entry => {
            totalSigns += entry.roles ? entry.roles.length : 1;
        });
        totalEl.textContent = totalSigns;

        // Count signs this week
        const today = new Date();
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        let weekCount = 0;
        this.signedDates.forEach(entry => {
            const date = new Date(entry.date);
            if (date >= weekAgo && date <= today) {
                weekCount += entry.roles ? entry.roles.length : 1;
            }
        });

        weekEl.textContent = weekCount;
    }

    updateSignButton() {
        const signBtn = document.getElementById('signButton');
        const signHelper = document.getElementById('signHelper');
        const questions = this.getCurrentOathQuestions();
        const allAcknowledged = this.acknowledged.size === questions.length;

        signBtn.disabled = !allAcknowledged;

        if (allAcknowledged) {
            signHelper.textContent = '👋 Ready to sign! Go have fun on the court!';
            signHelper.style.color = 'var(--success-color)';
        } else {
            signHelper.textContent = `Acknowledge all ${questions.length} points above (${this.acknowledged.size}/${questions.length})`;
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
        const questions = this.getCurrentOathQuestions();
        if (this.acknowledged.size !== questions.length) {
            return;
        }

        // Add today's date with role
        const today = new Date();
        const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

        // Find existing entry for today
        let existingEntry = this.signedDates.find(entry => entry.date === dateStr);

        if (existingEntry) {
            // Add role if not already present
            if (!existingEntry.roles.includes(this.currentRole)) {
                existingEntry.roles.push(this.currentRole);
            }
        } else {
            // Create new entry
            this.signedDates.push({
                date: dateStr,
                roles: [this.currentRole]
            });
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

        // Get unique dates and sort in descending order (newest first)
        const uniqueDates = [...new Set(this.signedDates.map(entry => entry.date))].sort().reverse();
        let streak = 1; // Start with 1 since we have at least one date
        let currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        // Get the most recent signed date
        const mostRecentDateStr = uniqueDates[0];
        const mostRecentDate = new Date(mostRecentDateStr);
        mostRecentDate.setHours(0, 0, 0, 0);

        // If most recent date is not today, start from that date
        currentDate = new Date(mostRecentDate);
        currentDate.setDate(currentDate.getDate() - 1);

        // Check for consecutive days
        for (let i = 1; i < uniqueDates.length; i++) {
            const dateStr = uniqueDates[i];
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
    // ROLE MANAGEMENT
    // ========================================

    showSplashScreen() {
        const splashScreen = document.getElementById('splashScreen');
        const header = document.querySelector('.header');
        const mainContent = document.getElementById('mainContent');
        const footer = document.querySelector('.footer');

        if (splashScreen) {
            splashScreen.classList.add('active');
        }
        // Hide main app during splash
        if (header) header.style.display = 'none';
        if (mainContent) mainContent.style.display = 'none';
        if (footer) footer.style.display = 'none';
    }

    hideSplashScreen() {
        const splashScreen = document.getElementById('splashScreen');
        const header = document.querySelector('.header');
        const mainContent = document.getElementById('mainContent');
        const footer = document.querySelector('.footer');

        if (splashScreen) {
            splashScreen.classList.remove('active');
        }
        // Show main app after splash
        if (header) header.style.display = '';
        if (mainContent) mainContent.style.display = '';
        if (footer) footer.style.display = '';
    }

    selectRole(role) {
        // Clear any previous acknowledgments when selecting a role
        this.acknowledged.clear();
        this.currentRole = role;
        this.saveData();
        this.hideSplashScreen();
        this.renderQuestions();
        this.renderCalendar();
        this.updateStreakDisplay();
        this.updateStats();
        this.updateSignButton();
        this.updateRoleBadge();
    }

    updateRoleBadge() {
        const roleBadge = document.getElementById('roleBadge');
        if (roleBadge && this.currentRole) {
            const roleText = this.currentRole === 'parent' ? '👨‍👩‍👧 Parent' : '🎾 Player';
            roleBadge.innerHTML = `<span class="role-label">Role</span><span class="role-value">${roleText}</span>`;
        }
    }

    showRoleSwitchModal() {
        const modal = document.getElementById('roleSwitchModal');
        if (modal) {
            modal.classList.add('active');
        }
    }

    hideRoleSwitchModal() {
        const modal = document.getElementById('roleSwitchModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    switchRole(newRole) {
        if (newRole === this.currentRole) {
            this.hideRoleSwitchModal();
            return;
        }

        // Clear current acknowledgments
        this.acknowledged.clear();
        this.currentRole = newRole;
        this.saveData();

        // Update UI
        this.renderQuestions(); // This calls updateOathHeader internally
        this.updateSignButton();
        this.updateRoleBadge();
        this.hideRoleSwitchModal();
    }

    // ========================================
    // EVENT LISTENERS
    // ========================================

    setupEventListeners() {
        const signBtn = document.getElementById('signButton');
        if (signBtn) signBtn.addEventListener('click', () => this.signOath());

        // Splash screen role selection
        const parentRoleBtn = document.getElementById('selectParentRole');
        const playerRoleBtn = document.getElementById('selectPlayerRole');
        if (parentRoleBtn) parentRoleBtn.addEventListener('click', () => this.selectRole('parent'));
        if (playerRoleBtn) playerRoleBtn.addEventListener('click', () => this.selectRole('player'));

        // Role badge click to show switch modal
        const roleBadge = document.getElementById('roleBadge');
        if (roleBadge) roleBadge.addEventListener('click', () => this.showRoleSwitchModal());

        // Role switch modal
        const switchToParentBtn = document.getElementById('switchToParent');
        const switchToPlayerBtn = document.getElementById('switchToPlayer');
        const cancelSwitchBtn = document.getElementById('cancelSwitch');
        const closeSwitchModal = document.getElementById('closeRoleSwitchModal');

        if (switchToParentBtn) switchToParentBtn.addEventListener('click', () => this.switchRole('parent'));
        if (switchToPlayerBtn) switchToPlayerBtn.addEventListener('click', () => this.switchRole('player'));
        if (cancelSwitchBtn) cancelSwitchBtn.addEventListener('click', () => this.hideRoleSwitchModal());
        if (closeSwitchModal) closeSwitchModal.addEventListener('click', () => this.hideRoleSwitchModal());

        // Close modal on backdrop click
        const roleSwitchModal = document.getElementById('roleSwitchModal');
        if (roleSwitchModal) {
            roleSwitchModal.addEventListener('click', (e) => {
                if (e.target === roleSwitchModal) {
                    this.hideRoleSwitchModal();
                }
            });
        }

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
