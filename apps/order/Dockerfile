FROM node:20.15.0-alpine

RUN npm install -g pnpm turbo

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY packages/ ./packages/

COPY apps/order/package.json ./apps/order/
RUN pnpm install
COPY ./apps/order/ ./apps/order/

WORKDIR /app/apps/order

RUN turbo build --filter @repo/order

EXPOSE 5002

CMD ["turbo", "start", "--filter", "@repo/order"]
