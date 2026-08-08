# ScorpiCore - Deploy en Hostinger VPS

## Requisitos
- Node.js 18+ instalado
- MySQL 8.0
- PM2 (se instala automáticamente)
- Git

## 1. Conectar al VPS por SSH

```bash
ssh root@tu-ip-del-vps
```

## 2. Instalar Node.js y PM2

```bash
# Instalar Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PM2 globalmente
sudo npm install -g pm2

# Instalar MySQL si no está instalado
sudo apt install mysql-server
sudo mysql_secure_installation
```

## 3. Clonar el repositorio

```bash
cd /var/www
git clone https://github.com/TU_USUARIO/scorpicore.git
cd scorpicore
```

## 4. Crear base de datos

```bash
mysql -u root -p
```

```sql
CREATE DATABASE scorpicore CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'scorpicore_user'@'localhost' IDENTIFIED BY 'tu_password_seguro';
GRANT ALL PRIVILEGES ON scorpicore.* TO 'scorpicore_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## 5. Importar schema

```bash
mysql -u scorpicore_user -p scorpicore < server/schema-vps.sql
```

## 6. Configurar variables de entorno

```bash
cp .env.example .env
nano .env
```

Genera un JWT_SECRET seguro:
```bash
openssl rand -hex 32
```

Actualizar con credenciales reales:

```env
DB_HOST=localhost
DB_USER=scorpicore_user
DB_PASSWORD=tu_password_seguro
DB_NAME=scorpicore
PORT=3000
NODE_ENV=production
ADMIN_USER=admin
ADMIN_PASS=tu_password_admin_seguro
JWT_SECRET=genera_un_string_largo_y_aleatorio_aqui
ALLOWED_ORIGIN=https://scorpicore.com
LOG_LEVEL=info
```

## 7. Instalar dependencias y construir

```bash
npm install
npm run build
```

## 8. Crear directorio de uploads

```bash
mkdir -p public/uploads
chmod 755 public/uploads
```

## 9. Iniciar con PM2

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 10. Configurar Nginx (proxy reverso)

```bash
sudo nano /etc/nginx/sites-available/scorpicore
```

```nginx
server {
    listen 80;
    server_name scorpicore.com www.scorpicore.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /uploads {
        alias /var/www/scorpicore/public/uploads;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/scorpicore /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 11. SSL con Certbot

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d scorpicore.com -d www.scorpicore.com
```

## 12. Seedear datos iniciales (opcional)

```bash
node server/seed.cjs
```

---

## Comandos útiles

```bash
# Ver logs
pm2 logs scorpicore

# Reiniciar
pm2 restart scorpicore

# Ver estado
pm2 status

# Detener
pm2 stop scorpicore

# Monitoreo
pm2 monit
```

## Estructura final

```
/var/www/scorpicore/
├── dist/               → Frontend (build)
├── server/
│   ├── index.cjs       → Backend Express
│   ├── schema-vps.sql  → Schema BD (para VPS)
│   └── seed.cjs        → Datos iniciales
├── public/
│   └── uploads/        → Imágenes subidas
├── logs/               → Logs de PM2
├── .env                → Variables de entorno
├── ecosystem.config.js → Config PM2
└── package.json
```

## Admin Panel

URL: `https://scorpicore.com/#admin`

## Solución de problemas

### El servidor no inicia
```bash
pm2 logs scorpicore --lines 50
```

### Error de conexión a MySQL
```bash
mysql -u scorpicore_user -p -h localhost
```

### Permisos de uploads
```bash
chmod -R 755 public/uploads
chown -R www-data:www-data public/uploads
```

### Reiniciar todo
```bash
pm2 restart all
sudo systemctl reload nginx
```
