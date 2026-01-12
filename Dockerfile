FROM node:20

WORKDIR /app

# 1. deps first (cache-friendly)
COPY package.json package-lock.json ./
RUN npm install

# 2. app code
COPY . .

# 3. build
RUN npm run build

# 4. run
CMD ["npm", "start"]
