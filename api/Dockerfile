FROM node:16.17.0

ENV NODE_ENV build 
USER  node
WORKDIR /home
COPY . .
RUN yarn
RUN yarn build 

CMD yarn start:docker
