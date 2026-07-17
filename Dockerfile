FROM node:22

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

ARG INDEXER_API_CLIENT
ARG INDEXER_WS
# not needed for production
ARG ANVIL_MARKETPLACE 
ARG MODE

ENV NEXT_PUBLIC_INDEXER_API_CLIENT=$INDEXER_API_CLIENT
ENV NEXT_PUBLIC_INDEXER_WS=$INDEXER_WS
ENV NEXT_PUBLIC_ANVIL_MARKETPLACE=$ANVIL_MARKETPLACE
ENV NEXT_PUBLIC_MODE=$MODE

RUN npm run build

CMD ["npm", "start"]

# docker build \
#   --build-arg INDEXER_API_CLIENT=http://localhost:5000 \
#   --build-arg INDEXER_WS=ws://localhost:5000 \
#   --build-arg ANVIL_MARKETPLACE=0xaaFdEcD44CD63e2dC9D252D37d7CBB8aE3b5F82c \
#   --build-arg MODE=DEMO \
#   -t dmrkt-frontend .
