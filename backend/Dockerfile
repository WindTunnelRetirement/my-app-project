FROM ruby:3.2.8

WORKDIR /app

# 必要なパッケージをインストール
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
    libpq-dev \
    postgresql-client && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# GemfileとGemfile.lockのみを先にコピー（キャッシュ効率のため）
COPY backend/Gemfile backend/Gemfile.lock ./
RUN bundle install --deployment --without development test

# backendのアプリケーションコードをコピー
COPY backend/ .

# 本番環境用の設定
ENV RAILS_ENV=production
ENV RAILS_LOG_TO_STDOUT=true
ENV RAILS_SERVE_STATIC_FILES=true

EXPOSE 3000
CMD ["sh", "-c", "bundle exec rails db:migrate && bundle exec rails server -b 0.0.0.0"]