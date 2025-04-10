# AI StoryLand Web Deployment Guide

This guide provides instructions for deploying and testing the AI StoryLand web application.

## Prerequisites

- Node.js 16+ and npm
- Modern web browser with speech recognition support (Chrome, Edge, or Safari recommended)

## Project Structure

```
ai-storyland-web/
├── public/                 # Static assets
│   ├── images/             # Animal and UI images
│   ├── sounds/             # Sound effects and audio files
│   ├── index.html          # Main HTML file
│   └── manifest.json       # Web app manifest
├── src/                    # Application source code
│   ├── components/         # React components
│   │   ├── StoryScreen.js  # Main story interface
│   │   ├── ParentDashboard.js # Settings dashboard
│   │   ├── BedtimeMode.js  # Bedtime mode interface
│   │   ├── SpeechRecognizer.js # Speech recognition component
│   │   ├── StoryGenerator.js # Story generation component
│   │   └── AudioPlayer.js  # Audio playback component
│   ├── services/           # Service modules
│   │   └── mockApiService.js # Mock API for testing
│   ├── App.js              # Main application component
│   └── index.js            # Application entry point
├── tests/                  # Test scripts
│   ├── integration_test.js # Integration tests
│   └── component_test.js   # Component tests
├── server.js               # Express server for deployment
└── package.json            # Project dependencies
```

## Setup Instructions

1. **Install dependencies**

   ```bash
   cd ai-storyland-web
   npm install
   ```

2. **Run tests**

   ```bash
   npm test
   ```

3. **Build the application**

   ```bash
   npm run build
   ```

4. **Start the server**

   ```bash
   npm start
   ```

5. **Access the application**

   Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Deployment Options

### 1. Local Deployment

The simplest way to deploy the application is using the included Express server:

```bash
npm run deploy
```

This will build the application and start the server on port 3000.

### 2. Cloud Deployment

For production deployment, you can use various cloud platforms:

#### Vercel Deployment

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy the application:
   ```bash
   vercel
   ```

#### Netlify Deployment

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Deploy the application:
   ```bash
   netlify deploy
   ```

### 3. Docker Deployment

1. Build the Docker image:
   ```bash
   docker build -t ai-storyland-web .
   ```

2. Run the container:
   ```bash
   docker run -p 3000:3000 ai-storyland-web
   ```

## Testing the Application

### Browser Requirements

The application requires a modern browser with support for:
- Web Speech API (for speech recognition)
- Web Audio API (for sound effects)
- Speech Synthesis API (for text-to-speech)

Chrome, Edge, and Safari provide the best support for these features.

### Testing Speech Recognition

1. Click the microphone button
2. Say "I want a lion story" or similar phrase
3. The application should transcribe your speech and generate a story

### Testing Story Generation

1. After speech recognition, a story should be generated
2. Navigate through story segments using the controls
3. Test story adaptation by adding new elements (e.g., "Add a monkey")

### Testing Audio Playback

1. Use the play button to hear the story narration
2. Adjust volume using the volume slider
3. Test animal voice effects with different animal stories

### Testing Bedtime Mode

1. Navigate to the Bedtime Mode screen
2. Enable bedtime mode and set a fade duration
3. Observe the volume fade effect and timer countdown

## Troubleshooting

- **Speech Recognition Issues**: Ensure your browser supports the Web Speech API and you've granted microphone permissions
- **Audio Playback Issues**: Check that your browser supports the Web Audio API and Speech Synthesis API
- **Missing Images or Sounds**: Verify that all placeholder files exist in the public directory
- **Navigation Problems**: Ensure React Router is properly configured in the application

## Support

For technical support or feature requests, please contact the development team at support@aistoryland.com
