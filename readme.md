# PHP + MySQL Docker Container Generator

A Python script that generates a complete Docker development environment for PHP projects with MySQL database and phpMyAdmin.

## Features

- **PHP 8.2 with Apache**: Modern PHP environment with pre-configured extensions
- **MySQL 8.0**: Fully configured database server
- **phpMyAdmin**: Web-based database management interface
- **Xdebug**: Pre-configured for debugging
- **Composer**: Package manager included
- **CORS Support**: Headers configured for API development

## Requirements

- Python 3.x
- Docker
- Docker Compose

## Installation

1. Clone or download this script
2. Ensure Docker and Docker Compose are installed on your system

## Usage

Run the script:

```bash
python script.py
```

You'll be prompted to enter:

- **Project name**: Used for container naming and directory structure (no spaces)
- **Apache Web Port** (default: 8080): Port for your PHP application
- **MySQL Port** (default: 3306): Port for database connections
- **Xdebug Port** (default: 9003): Port for debugging

### Example

```
=== PHP + MySQL Container Generator ===
Project name (no spaces): myproject
Apache Web Port (default: 8080): 8080
MySQL Port (default: 3306): 3307
Xdebug Port (default: 9003): 9003
```

## Generated Structure

```
myproject/
├── Dockerfile
├── docker-compose.yml
└── app/
    └── (your PHP files go here)
```

## Starting Your Project

1. Navigate to your project directory:
   ```bash
   cd myproject
   ```

2. Build and start the containers:
   ```bash
   docker-compose up -d
   ```

3. Access your services:
   - **PHP Application**: http://localhost:8080 (or your chosen port)
   - **phpMyAdmin**: http://localhost:8081 (web port + 1)

## Database Configuration

Default credentials:
- **Root Password**: `root`
- **Database**: `test_db`
- **User**: `user`
- **Password**: `secret`

### Connecting from PHP

```php
<?php
$host = 'mysql_myproject';  // Container name
$db = 'test_db';
$user = 'user';
$pass = 'secret';

$dsn = "mysql:host=$host;dbname=$db;charset=utf8mb4";
$pdo = new PDO($dsn, $user, $pass);
```

## Included PHP Extensions

- GD (image processing)
- PDO & PDO_MySQL (database)
- Zip
- XML
- Xdebug (debugging)

## Xdebug Configuration

Xdebug is pre-installed and configured. The debug port is exposed and set to connect to `host.docker.internal`.

## Managing Containers

```bash
# Start containers
docker-compose up -d

# Stop containers
docker-compose down

# View logs
docker-compose logs -f

# Restart containers
docker-compose restart

# Remove containers and volumes
docker-compose down -v
```

## Customization

You can modify the generated `Dockerfile` and `docker-compose.yml` files to:
- Add additional PHP extensions
- Change MySQL version
- Adjust memory limits
- Add more services (Redis, Nginx, etc.)

## Troubleshooting

### Port Already in Use
If you get a port conflict error, run the script again with different port numbers.

### Permission Issues
If you encounter permission issues with files in the `app/` directory:
```bash
sudo chown -R $USER:$USER app/
```

### Container Won't Start
Check the logs:
```bash
docker-compose logs
```

## License

Free to use and modify for your projects.

## Contributing

Feel free to submit issues or pull requests to improve this generator.
