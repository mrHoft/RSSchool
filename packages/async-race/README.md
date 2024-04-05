# Async Race educational project 🚗

<div align="center">

[![node](https://img.shields.io/badge/node-21-blue?logo=nodedotjs)](#)
[![vite](https://img.shields.io/badge/vite-5.2-blue?logo=vite)](#)
[![eslint](https://img.shields.io/badge/eslint-8.57-blue?logo=eslint)](#)
[![prettier](https://img.shields.io/badge/prettier-3.2.5-blue?logo=prettier)](#)

</div>

This SPA manages the collection of cars, operate their engines, and show race statistics.

### Features:

- [MVP](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) design pattern.
- [Feature-Sliced Design](https://feature-sliced.design/) architecture.
- Custom router (adapted to pages).
- Custom storage utility class.
- Theme switcher.
- Custom Color picker.
- Modal and message components.

```markdown
.
├── race-api
├── src
│ ├── api
│ ├── components
│ ├── pages
│ ├── utils
│ ├── widgets
```

## Stack:

- Vite
- TypeScript

## Usage:

- `npm install`
- `npm start` - Start [async-race-api](https://github.com/mrHoft/RSSchool/tree/main/packages/async-race/race-api/README.md)
- `npm run dev`
- open: localhost:3000

### Basic Structure

- Two main views: "Garage" and "Winners", each with their name, page number, and a count of items in the database.
- Persistent view state between switches, maintaining user input and pagination.

### Garage View

- CRUD operations for cars with "name" and "color" attributes.
- Color selection from an RGB palette with a preview of the car in the chosen color.
- Pagination to display cars (7 per page) and a feature to generate 100 random cars at once.

### Car Animation

- Start/stop engine buttons with corresponding animations and handling of engine states.
- Adaptive animations that work on screens as small as 500px.

### Race Animation

- A button to start a race for all cars on the current page.
- A reset button to return all cars to their starting positions.
- Display the winner's name upon race completion.

### Winners View

- Display winning cars with their image, name, number of wins, and best time.
- Pagination and sorting capabilities by wins and best times.

