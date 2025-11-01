FROM php:8.4.14-fpm-alpine3.21

RUN apk add --no-cache \
        git \
        unzip \
        libpq \
        libzip-dev \
        zip \
        mysql-client \
        bash \
        icu-dev \
        oniguruma-dev \
    && docker-php-ext-install pdo pdo_mysql zip intl opcache

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
WORKDIR /var/www/html

EXPOSE 9000
