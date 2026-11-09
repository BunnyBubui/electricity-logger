# Electricity Usage Logger

A React/Express/MongoDB application for recording kWh, calculating costs and reviewing usage over time.

## Features

- Record usage and calculate cost with an environment-configured unit price.
- Filter entries by date and retrieve paginated records.
- Compare this month with last month using MongoDB aggregation.
- Rank the days with the highest usage.

## Run locally

Use Node.js 22+ and a local MongoDB server. Copy `server/.env.example` to `server/.env` and set `MONGODB_URI` (for example `mongodb://127.0.0.1:27017/electricity`).

```sh
cd server
npm install
npm start
```

In another terminal:

```sh
cd client
cp .env.example .env
npm install
npm run dev
```

The browser runs on port 5173. The API uses the port in `server/.env` (8080 in the example). Set `VITE_API_BASE` in `client/.env` to the chosen API base URL, including `/api`.

## Architecture

React dashboard → Express REST API → Mongoose models and MongoDB aggregation pipelines.

This repository demonstrates data entry, pagination and aggregation. It has no account authentication and should be run with synthetic data on a local or access-controlled demo. No measured usage or performance is claimed. See `docs/CLEANUP.md` for configuration handling.
