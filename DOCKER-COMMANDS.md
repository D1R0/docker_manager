# 🐚 Useful Docker Commands

A handy list of Docker and Docker Compose commands for PHP development containers.

---

## 🐳 Docker Compose Commands

### 🔄 Start containers in detached mode
```bash
docker-compose up -d
docker-compose down
docker-compose up --build
docker system prune -a
docker ps
docker ps -a
docker logs container_name
docker exec -it container_name bash
docker exec -it php_myproject bash
docker cp ./localfile.php container_name:/path/in/container/
docker volume ls
docker images
docker rmi image_id_or_name
docker volume rm volume_name
