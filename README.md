# SUS - Simple Upload Service

A lightweight, self-hosted file upload service with a beautiful web interface.

## Features

- 📤 **Parallel uploads** - Upload multiple files simultaneously
- 🎯 **Drag & drop** - Intuitive file selection
- 📊 **Progress tracking** - Real-time upload progress bars
- 🔒 **Password protection** - Optional authentication
- 📁 **File management** - Download and delete uploaded files
- 🐳 **Docker ready** - Easy deployment with Docker
- 🎨 **Beautiful UI** - Modern, responsive interface

## Quick Start

### Using Docker Compose (Recommended)

1. Clone the repository:
```bash
git clone https://github.com/sammwyy/sus.git
cd sus
```

2. Edit `docker-compose.yml` to set your password (optional):
```yaml
environment:
  - PASSWORD=your_password_here
```

3. Start the service:
```bash
docker-compose up -d
```

4. Access the service at `http://localhost:3000`

### Using Docker

Build the image:
```bash
docker build -t sammwy/sus .
```

Run the container:
```bash
docker run -d \
  -p 3000:3000 \
  -v $(pwd)/data:/data \
  -e PASSWORD=your_password_here \
  sammwy/sus
```

### Without Docker

1. Install dependencies:
```bash
npm install
```

2. Set environment variables:
```bash
export PORT=3000
export UPLOAD_DIR=./uploads
export PASSWORD=your_password_here
```

3. Start the server:
```bash
npm start
```

## Configuration

Configure the service using environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `UPLOAD_DIR` | Directory to store uploaded files | `/data` |
| `PASSWORD` | Password for authentication (empty = no auth) | `` |

## Volume Mapping

Map a local directory to persist uploaded files:

```bash
docker run -v /path/to/local/dir:/data sammwy/sus
```

## API Endpoints

### Upload File
```
POST /api/upload
Headers: Authorization: <password>
Body: multipart/form-data with file field
```

### List Files
```
GET /api/files
Headers: Authorization: <password>
```

### Download File
```
GET /api/files/:filename
Headers: Authorization: <password>
```

### Delete File
```
DELETE /api/files/:filename
Headers: Authorization: <password>
```

## Security Notes

- Set a strong password for production use
- Files are stored with unique names to prevent conflicts
- Maximum file size limit: 1GB (configurable in server.js)
- Authentication required for all operations when password is set

## License

MIT License - see LICENSE file for details

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Author

[sammwy](https://github.com/sammwyy)