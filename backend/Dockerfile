FROM ruby:3.2.8

WORKDIR /app

# 必要なパッケージをインストール
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
    build-essential \
    libpq-dev \
    postgresql-client && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# backendディレクトリのGemfileをコピー
COPY backend/Gemfile backend/Gemfile.lock ./
RUN bundle install --without development test

# backendのアプリケーションコードをコピー
COPY backend/ .

# 本番環境用の設定
ENV RAILS_ENV=production
ENV RAILS_LOG_TO_STDOUT=true
ENV RAILS_SERVE_STATIC_FILES=true
# SSL を無効化（Render が SSL 終端を処理するため）
ENV RAILS_FORCE_SSL=false

EXPOSE 3000
CMD ["sh", "-c", "bundle exec rails db:create db:migrate && bundle exec rails server -b 0.0.0.0"]