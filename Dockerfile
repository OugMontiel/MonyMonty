# ==========================================
# Etapa 1: Construcción (Build)
# ==========================================
FROM node:20-alpine AS build

WORKDIR /app

# Optimización de caché de Docker para dependencias
COPY package*.json ./
RUN npm ci --prefer-offline --no-audit

# Compilación del código fuente recibiendo la URL de la API dinámicamente
COPY . .
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}
RUN npm run build

# ==========================================
# Etapa 2: Producción (Nginx Hardened)
# ==========================================
FROM nginx:alpine AS production

# Metadatos del contenedor
LABEL maintainer="MonyMonty"
LABEL description="Contenedor seguro y de mínimo privilegio para MonyMonty"

# 1. Preparación de directorios necesarios para Nginx sin root
RUN mkdir -p /var/cache/nginx /var/run /var/log/nginx /tmp && \
    touch /tmp/nginx.pid

# 2. Copia de artefactos y configuración
COPY --from=build --chown=nginx:nginx /app/dist /usr/share/nginx/html
COPY --chown=nginx:nginx nginx.conf /etc/nginx/conf.d/default.conf

# 3. Asignación estricta de permisos
# Nginx necesita leer/ejecutar el HTML (550), y escribir en temporales/logs (770)
RUN chown -R nginx:nginx /var/cache/nginx /var/run /var/log/nginx /tmp/nginx.pid /usr/share/nginx/html && \
    chmod -R 550 /usr/share/nginx/html && \
    chmod 770 /tmp /var/cache/nginx /var/run /var/log/nginx

# 4. Bastionado (Hardening): Ajuste de Nginx y eliminación de vectores de ataque
RUN sed -i 's/^user/#user/' /etc/nginx/nginx.conf && \
    sed -i 's|^pid .*|pid /tmp/nginx.pid;|' /etc/nginx/nginx.conf && \
    rm -rf /sbin/apk /etc/apk /lib/apk /usr/share/apk && \
    rm -f /usr/bin/wget /usr/bin/curl /bin/ping /bin/ping6 /usr/bin/nc /usr/bin/netcat /usr/bin/telnet

# 5. Ejecución como usuario sin privilegios
USER nginx

# 6. Exposición de puerto interno no privilegiado
EXPOSE 8082

# 7. Arranque de Nginx
CMD ["nginx", "-g", "daemon off;"]
