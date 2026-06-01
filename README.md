# PinMyCode

PinMyCode is an open-source web app for detecting a user's current postal
address and PIN code from their browser location. It uses the browser
Geolocation API for coordinates and OpenStreetMap Nominatim for reverse
geocoding, then verifies the detected PIN code against a separate postal data
source.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Browser Geolocation API
- OpenStreetMap Nominatim Reverse Geocoding
- Postal PIN Code API for server-side verification

## Getting Started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```text
src/
  app/
    globals.css
    layout.tsx
    page.tsx
  components/
    AddressCard.tsx
    DetectLocationButton.tsx
    ErrorState.tsx
    LoadingState.tsx
  lib/
    reverseGeocode.ts
  types/
    address.ts
    geolocation.ts
```

## Current Behavior

- Click **Detect My Location**
- Grant browser location permission
- View the detected postal address and verified PIN code in a styled card
- See a warning when reverse geocoding and postal data disagree

No backend, database, authentication, or paid services are used.

## Scripts

```bash
npm run dev
npm run build
npm run lint
```

## Contributing

Contributions are welcome. Please keep changes simple, readable, and focused on
the project goal.
