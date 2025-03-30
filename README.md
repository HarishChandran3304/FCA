# FCA: Free Chess.com Analysis

<p align="center">
  <img src="icons/logo.png" alt="FCA Logo" width="128" height="128">
</p>

## Overview

FCA (Free Chess.com Analysis) is a browser extension that enables free, one-click analysis of your Chess.com games using Lichess.org's powerful analysis engine. Get computer evaluation, move suggestions, and tactical insights without a premium subscription.

## Features

- **One-Click Analysis**: Adds a convenient "Analyze on Lichess" button to Chess.com game pages
- **Seamless Integration**: Automatically extracts PGN data from your Chess.com games
- **Full Computer Analysis**: Enables Lichess's Stockfish analysis automatically
- **Free to Use**: Access advanced analysis features without any subscription
- **User-Friendly**: Clean interface with helpful notifications

## Installation

### Chrome Web Store
*(Coming soon)*

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