# PinMyCode

PinMyCode is an open-source web app for detecting a user's current location in
the browser. The first milestone requests location permission and displays the
retrieved latitude and longitude. Reverse geocoding for postal address and
pincode lookup will be added later.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Browser Geolocation API

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

- Click **Detect My Address**
- Grant browser location permission
- View latitude and longitude in a styled card

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
