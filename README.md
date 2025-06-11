# f1-live

Fork e personalizzazioni di [f1dash](https://github.com/slowlydev/f1dash) per il progetto **livetiming.formulacritica.it**. Questa versione è dockerizzata e pronta per il deployment in produzione su EC2 con Nginx e Let's Encrypt.

## Caratteristiche principali

* Dashboard in tempo reale con **Server-Sent Events (SSE)**
* API REST per dati di sessione, piloti e classifiche
* Stack containerizzato con **Docker Compose**:

  * `live` (streaming SSE)
  * `api` (endpoints REST)
  * `frontend` (Next.js)
  * `timescaledb` (TimescaleDB)
  * `importer` & `analytics` (jobs di import e analisi)
* Configurazione Nginx come reverse-proxy con SSL/TLS (Let's Encrypt)

## Prerequisiti

* **Docker** e **Docker Compose** (plugin)
* Un dominio configurato (es. `livetiming.formulacritica.it`)
* **Elastic IP** su AWS EC2 o IP statico
* **Git** per il clone della repo

## Installazione

1. **Clona la repo**:

   ```bash
   git clone https://github.com/Piterohub/f1-live.git
   cd f1-live
   ```

2. **Crea il file `.env`** a partire dal template:

   ```bash
   cp .env.example .env
   ```

   Imposta almeno queste variabili:

   ```dotenv
   LIVE_ADDRESS=0.0.0.0:4000
   API_ADDRESS=0.0.0.0:4001
   ANALYTICS_ADDRESS=0.0.0.0:4002
   ORIGIN=https://livetiming.formulacritica.it
   DATABASE_URL=postgres://postgres:password@timescaledb:5432/postgres
   RUST_LOG="live=info,api=info,analytics=info"
   ```

3. **Avvia i container**:

   ```bash
   docker compose pull
   docker compose build
   docker compose up -d
   ```

4. **Controlla lo stato**:

   ```bash
   docker compose ps
   ```

## Configurazione Nginx

Configura un virtual host per `livetiming.formulacritica.it` in `/etc/nginx/sites-available/f1dash`:

```nginx
server {
    listen 80;
    server_name livetiming.formulacritica.it;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name livetiming.formulacritica.it;

    ssl_certificate     /etc/letsencrypt/live/livetiming.formulacritica.it/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/livetiming.formulacritica.it/privkey.pem;
    include             /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam         /etc/letsencrypt/ssl-dhparams.pem;

    location /api/sse {
        proxy_pass         http://127.0.0.1:4000/sse;
        proxy_http_version 1.1;
        proxy_set_header   Host $host;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection "";
        proxy_buffering    off;
    }

    location /api/ {
        proxy_pass         http://127.0.0.1:4001/;
        proxy_http_version 1.1;
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection "";
    }

    location / {
        proxy_pass         http://127.0.0.1:3000/;
        proxy_http_version 1.1;
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection "";
    }
}
```

Poi abilita e ricarica Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/f1dash /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## SSL/TLS

Installa Certbot e richiedi il certificato:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d livetiming.formulacritica.it --redirect
```

## Licenza

Questo progetto è rilasciato sotto **GPL-3.0**. Vedi il file [LICENSE](LICENSE) per i dettagli.
