# FCA: Free Chess.com Analysis

<p align="center">
  <img src="icons/logo.png" alt="FCA Logo" width="128" height="128">
</p>

<div align="center">
  <h3><a href="https://chess-fca.netlify.app">📱 Visit Our Website</a></h3>
  <h3><a href="https://chromewebstore.google.com/detail/fca-free-chesscom-analysi/fnbdibibhedkicfmehhdmobliblmiimc">🚀 Install from Chrome Web Store</a></h3>
</div>

<div align="center" style="background-color: #ffd700; border: 2px solid #ffb700; border-radius: 4px; padding: 15px; margin: 20px 0; color: #000000;">
  <strong>⚠️ Important:</strong> Remember to create an account on <a href="https://lichess.org" target="_blank">lichess.org</a> and stay signed for all the analysis features to work
</div>

## Overview

FCA (Free Chess.com Analysis) is a browser extension that enables free, one-click analysis of your Chess.com games using Lichess.org's powerful analysis engine. Get computer evaluation, move suggestions, and tactical insights without a premium subscription.

## Demo

Watch how FCA works in action:

![FCA Demo](./assets/FCA-demo.gif)

## Features

- **One-Click Analysis**: Adds a convenient "Analyze on Lichess" button to Chess.com game pages
- **Seamless Integration**: Automatically extracts PGN data from your Chess.com games and ports it to lichess analysis
- **Automatic Redirect**: Redirects to lichess.org and enables Lichess's Stockfish engine and requests full computer analysis automatically
- **Full Computer Analysis**: Lichess full computer analysis offers features like accuracy, inaccuracies, mistakes, blunders, learn from your mistakes and more
- **Free to Use**: Access advanced analysis features without any subscription
- **Non-Intrusive UI**: No distracting elements so you can focus when you're in a game
- **Privacy-First**: Your data and privacy are respected - [see Privacy section](#privacy) for details

## Installation

### Chrome Web Store (Recommended)
<div align="center">
  <a href="https://chromewebstore.google.com/detail/fca-free-chesscom-analysi/fnbdibibhedkicfmehhdmobliblmiimc" style="display: inline-block; padding: 12px 24px; background: #4285f4; color: white; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 16px;">
    <span style="vertical-align: middle;">Install Now 🚀</span>
  </a>
</div>

### Manual Installation
1. Download or clone this repository
2. Open Chrome/Edge/Brave and navigate to `chrome://extensions`
3. Enable "Developer Mode" (usually a toggle in the top-right corner)
4. Click "Load Unpacked" and select the downloaded repository folder
5. The extension is now installed and ready to use

## How to Use

1. Visit Chess.com and play a game or navigate to any game page
2. Look for the green "Analyze on Lichess" button in the bottom-right corner
3. Click the button to automatically open the game in Lichess with analysis enabled
4. Enjoy comprehensive computer analysis of your chess game!

## Technical Details

This extension works by:
1. Detecting Chess.com game pages
2. Adding a custom analysis button
3. When clicked, extracting the PGN notation from Chess.com
4. Opening Lichess.org with the PGN data
5. Automatically enabling computer analysis

## Limitations

- Lichess has rate limits on computer analysis:
  - ~20 games per day
  - ~80 games per week
- If analysis takes unusually long, it likely means you've hit the rate limit
- You can simply create a new alt account to overcome this 

## Privacy

This extension:
- Does not collect any user data
- Does not track your browsing
- Only requests access to Chess.com and Lichess.org domains
- All code is open source and transparent