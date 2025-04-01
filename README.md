# Image Resizer API

A simple API for resizing images. This project provides an endpoint to fetch and resize images, with caching support using Redis.

Any use in production is at your own risk.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Running with Docker](#running-with-docker)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

---

## Features

✅ Resize images to specified dimensions.\
✅ Cache resized images in Redis for faster subsequent requests. Also add header for browser to cache responses.\
✅ Dockerized for easy deployment.

---

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) installed
- [Docker](https://www.docker.com/) installed (optional for containerized deployment)

## Running with Docker

To start the service using **Docker Compose**, run:

```sh
docker compose up
```

To stop the service:

```sh
docker compose down
```

---

## Usage

### API Endpoint

`GET /resize?imageUrl=<image_url>&width=<width>&height=<height>`

**Example Request:**

```sh
curl "http://localhost:3000/resize?imageUrl=https://example.com/image.jpg&width=500&height=300"
```

---

## Configuration

Create a `.env` file to override defaults. Example:

```ini
HOST=localhost
PORT=8080
REDIS_URL=redis://redis:6379
```

---

## Testing

### E2E Testing

1. Navigate to the test directory:
   ```sh
   cd lib/__test__/e2e
   ```
2. Start a local server:
   ```sh
   npx http-server
   ```

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature-name`)
3. Commit your changes (`git commit -m "Add new feature"`)
4. Push to the branch (`git push origin feature-name`)
5. Create a Pull Request

---

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for more details.
