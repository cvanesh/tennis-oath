# Tennis Player's Oath - PWA App

A beautiful, interactive Progressive Web App (PWA) designed to help junior tennis players start each session with a commitment to excellence, improvement, and love of the game.

## 🎾 Features

✨ **10 Key Oath Points** - Interactive acknowledgement system with visual feedback
📱 **Mobile First Design** - Optimized for all screen sizes and devices
🔄 **Streak Tracking** - Visual calendar showing daily commitment history
📊 **Statistics** - Track total visits and weekly consistency
🏅 **Progress Tracking** - See your streak grow as you commit daily
💾 **Offline Support** - Works completely offline thanks to PWA technology
🎨 **Kids-Friendly UI** - Clean, colorful, and engaging interface
🎉 **Celebration Feedback** - Confetti animation when oath is signed

## 📋 The 10 Oath Points

1. I am here to have fun and enjoy the game of tennis.
2. I commit to focus on my improvement and growth, not on winning or losing.
3. I will stay process-oriented and trust my preparation.
4. I accept that mistakes are part of learning. I will not vent or get upset with myself.
5. I will keep a clear mind and stay present during every point.
6. I respect my opponent and will compete with integrity and sportsmanship.
7. I will be tough when it matters and let go of what doesn't.
8. I love tennis. There is nowhere else I want to be right now.
9. I am not here to prove anything to anyone, only to challenge myself.
10. I commit to giving my best effort and leaving everything on the court.

## 🚀 Getting Started

### Local Development

1. Navigate to the app directory:
   ```bash
   cd /Users/sivaneshmanjinisengodan/code/oath/app
   ```

2. Start a local web server (choose one):
   
   **Using Python 3:**
   ```bash
   python3 -m http.server 8000
   ```
   
   **Using Node.js (if installed):**
   ```bash
   npx http-server
   ```
   
   **Using VS Code Live Server Extension:**
   - Install "Live Server" extension
   - Right-click `index.html` and select "Open with Live Server"

3. Open your browser to `http://localhost:8000`

### Testing the PWA

1. Open the app in your browser
2. For Chrome/Edge: Click the install icon (usually in address bar)
3. For Safari: Use Share → Add to Home Screen
4. The app will work offline and save all progress locally

## 📁 Project Structure

```
app/
├── index.html        # Main HTML structure
├── styles.css        # Beautiful responsive styles
├── app.js            # Core application logic
├── manifest.json     # PWA manifest configuration
├── sw.js             # Service worker for offline support
└── README.md         # This file
```

## 🎯 How It Works

### User Flow

1. Player opens the app
2. Reads all 10 oath points
3. Clicks to acknowledge each point (green checkmark appears)
4. Once all 10 are acknowledged, "Sign the Oath" button becomes active
5. Player clicks to sign
6. Celebration animation plays
7. Progress is saved (streak, date marked on calendar)
8. App resets for next session

### Data Storage

- All data is stored locally in browser's LocalStorage
- Streak calculated based on consecutive days
- Calendar shows visited days with visual indicator
- Statistics track total visits and weekly frequency

## 🌐 Deployment to GitHub Pages

To deploy to `https://cvanesh.github.io/`:

1. Create a GitHub repository named `oath`
2. Clone it locally
3. Copy all files from the `app/` directory to the repository root
4. Update `manifest.json` start_url to `"/oath/"`
5. Push to GitHub:
   ```bash
   git add .
   git commit -m "Initial Tennis Oath PWA"
   git push origin main
   ```
6. Enable GitHub Pages in repository settings
7. Visit `https://cvanesh.github.io/oath/`

### Important: Path Configuration for GitHub Pages

Since the app will be hosted at a subdirectory (`/oath/`), you may need to update paths if they're absolute. The current setup uses relative paths which should work fine.

## 🎨 Customization

### Change Colors

Edit the CSS variables in `styles.css` (lines 4-17):

```css
:root {
    --primary-color: #2ecc71;      /* Main green */
    --primary-dark: #27ae60;        /* Darker green */
    --secondary-color: #3498db;     /* Blue */
    --accent-color: #f39c12;        /* Orange */
    /* ... more colors ... */
}
```

### Modify Oath Questions

Edit `app.js` to change the `OATH_QUESTIONS` array (lines 3-30):

```javascript
const OATH_QUESTIONS = [
    {
        icon: '😊',
        text: 'Your custom question here'
    },
    // ... more questions ...
];
```

## 💡 Tips for Success

1. **Encourage Daily Use** - The streak system motivates consistent engagement
2. **Phone Installation** - Show players how to install as a home screen app
3. **Pre-Match Ritual** - Suggest players go through the oath before every match
4. **Offline Ready** - Works even when internet is down, perfect for practice courts
5. **Customization** - Adjust questions to match your program's values

## 🔧 Technical Details

### Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern responsive design with gradients and animations
- **JavaScript (ES6+)** - Pure vanilla JS, no frameworks
- **Service Workers** - For offline PWA functionality
- **Local Storage API** - For persistent data storage
- **Web App Manifest** - For installable app behavior

### Browser Support

- ✅ Chrome/Edge (Windows/Mac/Android)
- ✅ Firefox (Windows/Mac/Linux)
- ✅ Safari (Mac/iOS)
- ✅ Samsung Internet (Android)
- ✅ All modern mobile browsers

### PWA Features

- 📦 Installable on home screen
- 🔄 Works offline completely
- ⚡ Fast and responsive
- 🔔 Can receive notifications (future feature)
- 📱 Responsive across all devices

## 📱 Mobile Installation

### iPhone/iPad (Safari)
1. Open app in Safari
2. Tap Share button
3. Select "Add to Home Screen"
4. Name the app and tap "Add"

### Android (Chrome)
1. Open app in Chrome
2. Tap menu (three dots)
3. Select "Install app" or "Create shortcut"
4. Confirm installation

### Desktop (Chrome/Edge)
1. Open app in browser
2. Click install icon in address bar
3. Click "Install"
4. App opens in its own window

## 🐛 Troubleshooting

### App doesn't work offline
- Check Service Worker registration in browser DevTools
- Clear browser cache and reinstall
- Ensure manifest.json is properly linked

### Streak not updating
- Check browser's Local Storage (DevTools → Application)
- Ensure date format is correct (YYYY-MM-DD)
- Check browser's privacy settings aren't blocking storage

### PWA won't install
- Ensure HTTPS is used (required for PWA, except localhost)
- Check manifest.json is valid JSON
- Try clearing browser cache and site data

## 📄 License

This app is created for tennis players to build commitment and mindfulness. Feel free to customize and share!

## 🎾 Questions?

For questions or improvements, please refer to the original MVP requirements in `/prompts/mvp1.md`

---

**Remember:** The oath isn't about perfection—it's about intention, commitment, and love for the game. 💚
