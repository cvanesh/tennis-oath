# Tennis Player's Oath 🎾

A Progressive Web App (PWA) designed for young tennis players to commit to their oath and track their daily practice streak. The app emphasizes improvement, sportsmanship, focus, and a love for the game.

## Features

- **12-Point Oath System**: Daily commitments covering mindset, respect, and dedication
- **Streak Tracking**: Visual calendar showing consecutive days of oath completion
- **Multi-Month Support**: Navigate through months to see historical streaks
- **Dark/Light Theme**: Toggle between themes with persistent preference
- **Offline Support**: Service Worker enables offline functionality
- **Mobile Optimized**: Fully responsive design for phones, tablets, and desktops
- **Installable**: Add to home screen on iOS and Android

## Demo

Live at: https://cvanesh.github.io/tennis-oath

## Local Development

### Requirements
- Python 3.6+
- Modern web browser

### Setup

1. Clone the repository:
```bash
git clone https://github.com/cvanesh/tennis-oath.git
cd tennis-oath
```

2. Start a local HTTP server:
```bash
cd app
python3 -m http.server 8000
```

3. Open your browser:
```
http://localhost:8000
```

### Deployment to GitHub Pages

1. Ensure you have a GitHub repository named `tennis-oath`

2. Push your code to the repository:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

3. Enable GitHub Pages:
   - Go to repository Settings
   - Scroll to "Pages" section
   - Set source to "main" branch
   - Save

4. Your app will be live at: `https://cvanesh.github.io/tennis-oath`

## Architecture

### Files
- `index.html` - Main HTML structure with header, oath section, and calendar
- `app.js` - Core application logic (624 lines)
  - `OathApp` class manages state
  - Streak calculation across months
  - Theme switching and persistence
  - Event listeners for all interactions
- `styles.css` - Responsive styling (777 lines)
  - CSS variables for theming
  - Mobile-first design
  - Dark/light mode support
- `sw.js` - Service Worker for PWA functionality
- `manifest.json` - PWA metadata for home screen installation

### State Management
- **localStorage** stores:
  - `acknowledged`: Set of indices for completed oath points
  - `signedDates`: Array of dates when oath was signed
  - `theme`: User's theme preference (light/dark)
  - `viewMonth`: Current calendar month being viewed

### Key Calculations
- **Streak**: Counts consecutive days from most recent signed date backwards
- **Calendar**: 7-column grid starting Monday, shows visited dates
- **Theme**: Controlled via `body.dark-mode` class, respects @media (prefers-color-scheme)

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (iOS 14+)
- Mobile browsers: Full PWA support

## Future Enhancements

- Push notifications for daily reminders
- Data export/backup functionality
- Multi-language support
- Streak milestone celebrations
- Social sharing capabilities
- Cloud sync option

## License

This project is open source. Feel free to fork and customize for your needs.

## Support

For issues or suggestions, please open an issue on GitHub.
