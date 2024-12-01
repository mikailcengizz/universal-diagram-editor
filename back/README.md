# Universal Diagram Editor - Backend

This is the backend server for the Universal Diagram Editor project.

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm (Node Package Manager)

### Installation

1. Navigate to the backend directory:
   ```sh
   cd universal-diagram-editor/back
   ```
2. Install the dependencies:
   ```sh
   npm install
   ```
3. Remember to have a running MySQL server running on localhost with the DB name "universalDiagramEditor". The DB configs used can be seen in back/config/config.json

### Running the Server

To start the development server, run the following command:

```sh
npm run dev
```

The server will start on the default port (e.g., 8080). You can configure the port and other settings in the `.env` file.

### Folder Structure

- `routes/` - API routes
- `models/` - Database models
- `middleware/` - Middleware functions

### License

This project is licensed under the Apache License. See the [../LICENSE](../LICENSE) file for details.

### Contact

For any questions, please contact the project maintainers.
