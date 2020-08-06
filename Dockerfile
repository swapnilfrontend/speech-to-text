FROM node:13 as build

WORKDIR /app
COPY ./ ./
RUN yarn install
RUN yarn build

FROM node:13-alpine

COPY --from=build /app/build /
EXPOSE 3000
RUN yarn global add serve
CMD ["serve", "-l", "3000"]