FROM php:8.2-cli-alpine

RUN apk add --no-cache git unzip libpq-dev oniguruma-dev libxml2-dev \
    && docker-php-ext-install pdo pdo_pgsql mbstring bcmath dom fileinfo

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY composer.json composer.lock ./
RUN COMPOSER_ALLOW_SUPERUSER=1 composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist

COPY . .
RUN chown -R www-data:www-data storage bootstrap/cache

CMD ["sh", "-c", "php artisan serve --host=0.0.0.0 --port=${PORT:-10000}"]