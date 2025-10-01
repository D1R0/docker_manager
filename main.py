import os
from pathlib import Path

def input_with_default(prompt, default):
    val = input(f"{prompt} (default: {default}): ")
    return val.strip() or default

def generate_files(project_name, web_port, sql_port, debug_port):
    base_path = Path(project_name)
    os.makedirs(base_path / "app", exist_ok=True)

    # Dockerfile
    dockerfile_content = """\
FROM php:8.2-apache

RUN apt-get update && apt-get install -y \\
    git \\
    unzip \\
    tar \\
    zip \\
    libpng-dev \\
    libjpeg-dev \\
    libfreetype6-dev \\
    curl \\
    libzip-dev \\
    libxml2-dev \\
    libpq-dev \\
    librabbitmq-dev \\
    libssh-dev \\
    && docker-php-ext-configure gd --with-freetype --with-jpeg \\
    && docker-php-ext-install -j$(nproc) gd \\
    && docker-php-ext-install pdo pdo_mysql \\
    && docker-php-ext-install zip \\
    && docker-php-ext-install xml \\
    && pecl install xdebug \\
    && docker-php-ext-enable xdebug \\
    && docker-php-ext-enable zip \\
    && apt-get clean

RUN echo "memory_limit=512M" > $PHP_INI_DIR/conf.d/memory-limit.ini

RUN a2enmod rewrite headers

RUN echo '\\n\
<IfModule mod_headers.c>\\n\
    Header set Access-Control-Allow-Origin "*"\\n\
    Header set Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept"\\n\
    Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"\\n\
</IfModule>' >> /etc/apache2/apache2.conf

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

WORKDIR /var/www/html

RUN chown -R www-data:www-data /var/www/html \\
    && chmod -R 755 /var/www/html

EXPOSE 80

RUN mv "$PHP_INI_DIR/php.ini-development" "$PHP_INI_DIR/php.ini"
"""

    # docker-compose.yml
    compose_content = f"""\
version: '3.8'

services:
  php_{project_name}:
    build: .
    container_name: php_{project_name}
    volumes:
      - ./app:/var/www/html
    ports:
      - "{web_port}:80"
      - "{debug_port}:9003"
    environment:
      PHP_EXTENSION_XDEBUG: 1
    depends_on:
      - mysql_{project_name}
    extra_hosts:
      - "host.docker.internal:host-gateway"

  mysql_{project_name}:
    image: mysql:8.0
    container_name: mysql_{project_name}
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: test_db
      MYSQL_USER: user
      MYSQL_PASSWORD: secret
    ports:
      - "{sql_port}:3306"
    volumes:
      - mysql_data:/var/lib/mysql

  phpmyadmin_{project_name}:
    image: phpmyadmin/phpmyadmin
    container_name: phpmyadmin_{project_name}
    restart: always
    ports:
      - "{int(web_port)+1}:80"
    environment:
      PMA_HOST: mysql_{project_name}
      PMA_USER: root
      PMA_PASSWORD: root
    depends_on:
      - mysql_{project_name}

volumes:
  mysql_data:
"""

    # Write files
    with open(base_path / "Dockerfile", "w") as df:
        df.write(dockerfile_content)

    with open(base_path / "docker-compose.yml", "w") as dc:
        dc.write(compose_content)

    print(f"\n✅ The project '{project_name}' has been successfully generated in the directory '{base_path.absolute()}'")

# CLI Prompt
def main():
    print("=== PHP + MySQL Container Generator ===")
    project_name = (input("Project name (no spaces): ").strip())
    web_port = input_with_default("Apache Web Port", "8080")
    sql_port = input_with_default("MySQL Port", "3306")
    debug_port = input_with_default("Xdebug Port", "9003")

    generate_files(project_name.lower(), web_port, sql_port, debug_port)

if __name__ == "__main__":
    main()
