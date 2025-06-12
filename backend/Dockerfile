FROM ruby:3.2.8

WORKDIR /app

# 必要なパッケージをインストール
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
    libpq-dev \
    postgresql-client && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Gemfileをコピーしてbundle install
COPY Gemfile Gemfile.lock ./
RUN bundle install --deployment --without development test

# アプリケーションコードをコピー
COPY . .

# 本番環境用の設定
ENV RAILS_ENV=production
ENV RAILS_LOG_TO_STDOUT=true
ENV RAILS_SERVE_STATIC_FILES=true

# アセットプリコンパイル（必要に応じて）
# RUN bundle exec rails assets:precompile

EXPOSE 3000
CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0"]