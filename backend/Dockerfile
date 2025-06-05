# backend/Dockerfile
FROM ruby:3.2.8
# プロキシ設定を引数から受け取る
ARG HTTP_PROXY
ARG HTTPS_PROXY
ENV HTTP_PROXY=$HTTP_PROXY
ENV HTTPS_PROXY=$HTTPS_PROXY

WORKDIR /app

# 必要なパッケージをインストール
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
    libpq-dev \
    postgresql-client && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Gemfileをコピーしてbundle install
COPY Gemfile* ./
RUN bundle install

# アプリケーションコードをコピー
COPY . .

EXPOSE 3000
CMD ["rails", "server", "-b", "0.0.0.0"]