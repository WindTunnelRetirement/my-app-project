FROM ruby:3.2.8

WORKDIR /app

# 必要なパッケージをインストール
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
    libpq-dev \
    postgresql-client && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# backendディレクトリのGemfileをコピー

# 本番環境用
COPY backend/Gemfile backend/Gemfile.lock ./

# 開発環境用
# COPY Gemfile Gemfile.lock ./
# RUN bundle install

# 本番環境
RUN bundle install --deployment --without development test

# backendのアプリケーションコードをコピー

# 本番環境用
COPY backend/ .

# 開発環境用
# COPY . .

# 本番環境用の設定
ENV RAILS_ENV=production
ENV RAILS_LOG_TO_STDOUT=true
ENV RAILS_SERVE_STATIC_FILES=true

EXPOSE 3000
CMD ["sh", "-c", "bundle exec rails db:migrate && bundle exec rails server -b 0.0.0.0"]