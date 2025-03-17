# Base image with common dependencies
FROM ubuntu:22.04 as base

# Avoid prompts from apt
ENV DEBIAN_FRONTEND=noninteractive

# Install common dependencies
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    unzip \
    git \
    build-essential \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g npm@latest

# Install Deno
RUN curl -fsSL https://deno.land/install.sh | sh
ENV PATH="/root/.deno/bin:${PATH}"

# Install Bun
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:${PATH}"

# Create directory for the application
WORKDIR /app

# First, just copy the benchmark script to ensure it exists
COPY benchmark/run-benchmarks.sh .
RUN chmod +x ./run-benchmarks.sh

# Copy the rest of the benchmark directory contents
COPY benchmark/ .

# Create a directory for test results
RUN mkdir -p /test_results

# Target for 500MHz/500MB configuration
FROM base as benchmark_500mhz_500mb
ENV CONFIG_NAME="500mhz_500mb"

CMD ./run-benchmarks.sh && mkdir -p /test_results/${CONFIG_NAME}/ && cp -r ./visualization/public/* /test_results/${CONFIG_NAME}/

# Target for 1GHz/1GB configuration
FROM base as benchmark_1ghz_1gb
ENV CONFIG_NAME="1ghz_1gb"
CMD ./run-benchmarks.sh && mkdir -p /test_results/${CONFIG_NAME}/ && cp -r ./visualization/public/* /test_results/${CONFIG_NAME}/