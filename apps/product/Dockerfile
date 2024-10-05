FROM node:20.15.0-alpine

RUN npm install -g pnpm turbo

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY packages/ ./packages/

COPY apps/product/package.json ./apps/product/
RUN pnpm install
COPY ./apps/product/ ./apps/product/

WORKDIR /app/apps/product

RUN turbo build --filter @repo/product

EXPOSE 5001

CMD ["turbo", "start", "--filter", "@repo/product"]
