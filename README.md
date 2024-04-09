# Project Name: Koa Server for Question Answering and Prediction

## Description
This project is a Koa server designed to handle requests related to question answering and prediction tasks. It utilizes Koa, a modern web framework for Node.js, along with various middleware such as `koa-static`, `@koa/cors`, and `koa-bodyparser` to handle static files, enable CORS (Cross-Origin Resource Sharing), and parse request bodies respectively. The server exposes endpoints for asking questions and making predictions.

## Features
- Provides endpoints for asking questions (`/api/ask`) and making predictions (`/api/predict`).
- Utilizes middleware for handling static files, CORS, and request body parsing.
- Lightweight and efficient server setup using Koa and Node.js.

## Prerequisites
- Node.js installed on the system.
- Basic knowledge of JavaScript and web servers.
- [Ollama](https://ollama.com/) ran on the local machine and [`mistral:instruct`](https://ollama.com/library/mistral:instruct) model installed.
    - You can install the model using the following command:
        ```
        ollama run mistral:instruct
        ```

## Installation
1. Clone this repository to your local machine.
2. Navigate to the project directory.
3. Install dependencies using npm:
    ```
    npm install
    ```

## Usage
1. After installation, start the server using the following command:
    ```
    npm start
    ```
2. Once the server is running, you can send HTTP requests to the defined endpoints (`/api/ask` and `/api/predict`) to perform question answering and prediction tasks respectively.

## Endpoints
- **/api/ask**: Endpoint for asking questions.
- **/api/predict**: Endpoint for making predictions.

## Dependencies
- Koa: Modern web framework for Node.js.
- koa-static: Middleware for serving static files.
- @koa/cors: Middleware for enabling CORS (Cross-Origin Resource Sharing).
- koa-bodyparser: Middleware for parsing request bodies.

## Handlers
- **handleQuestion**: Handles question answering requests.
- **handlePrediction**: Handles prediction requests.

## Configuration
- The server is set to run on port 3030 by default. You can change the port by modifying the `port` variable in the `index.js` file.

## License
This project is licensed under the [MIT License](LICENSE).

## Issues
If you encounter any issues or have suggestions for improvements, please open an issue on the [GitHub repository](https://github.com/your/repository).
