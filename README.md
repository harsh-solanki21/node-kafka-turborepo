# Microservice App using Node, Kafka, Turborepo

- This project demonstrates a modern, scalable microservices architecture using `Node.js`, `Kafka`, and `Turborepo`.
- It showcases how to build efficient, distributed systems with real-time event streaming capabilities.

## Project Overview

- This project combines the power of:
  - Node and Express for backend services
  - Apache `Kafka` for `event streaming`
  - `Turborepo` for `monorepo` management
- This setup allows for building robust, scalable, and maintainable microservices architectures.

### Key Features

- Microservices architecture
- Event-driven communication using Kafka
- Monorepo structure managed by Turborepo
- Scalable and maintainable codebase

<br />

## Getting Started

### Prerequisites

- Node.js (v20 or later)
- pnpm package manager
- Docker (for Kafka)

### Installation

**1. Clone the repo**
**2. Install dependencies: `pnpm install`**
**3. Build the project: `turbo build`**

```bash
# Using pnpm
pnpm dev  # runs all services
pnpm dev --filter @repo/product  # runs product service only

# Using turbo
turbo build # builds all the services
turbo build --filter @repo/product  # builds product service only
turbo start # starts all the services
turbo start --filter @repo/product # starts product service only

# To add new packages
pnpm -w add -D typescript  # -w flag to add package to root
pnpm add -D typescript --filter product  # to add packages to product service
```

**4. Start the Kafka server:**

```bash
docker run -it \
  --name kafka-server \
  --hostname kafka-server \
  -p 9092:9092 \
  -e KAFKA_CFG_NODE_ID=0 \
  -e KAFKA_CFG_PROCESS_ROLES=controller,broker \
  -e KAFKA_CFG_LISTENERS=PLAINTEXT://:9092,CONTROLLER://:9093 \
  -e KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP=CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT \
  -e KAFKA_CFG_CONTROLLER_QUORUM_VOTERS=0@kafka-server:9093 \
  -e KAFKA_CFG_CONTROLLER_LISTENER_NAMES=CONTROLLER \
  -e KAFKA_CFG_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092 \
  -e KAFKA_CFG_AUTO_CREATE_TOPICS_ENABLE=true \
  bitnami/kafka:latest
```

**5. Start the services: `turbo start`**

<br />

#### Kafka Commands

```bash
# First, get into the Kafka container
docker exec -it kafka-server /bin/bash

# Once inside the container, you can run the following commands:
# 1. List all topics
kafka-topics.sh --list --bootstrap-server localhost:9092

# 2 . Describe all topics (this will show partitions and other configurations)
kafka-topics.sh --describe --bootstrap-server localhost:9092

# 3. Get information about consumer groups (including their offsets)
kafka-consumer-groups.sh --bootstrap-server localhost:9092 --list
kafka-consumer-groups.sh --bootstrap-server localhost:9092 --describe --all-groups

# 4. Get information about the brokers
kafka-broker-api-versions.sh --bootstrap-server localhost:9092
```

<br />

### Running the App

![kafka-turborepo-1](https://github.com/user-attachments/assets/dc0b8586-6d8a-41bc-98b9-f0b6aa9acae7)

![kafka-turborepo-2](https://github.com/user-attachments/assets/6acefeaa-5bb2-4166-88e8-7d212b4e1ef6)
