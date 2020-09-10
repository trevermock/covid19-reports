FROM node:10 as buildtime

# Setup dir
RUN mkdir -p /usr/src/covid19-reports
WORKDIR /usr/src/covid19-reports

ENV NODE_PATH=/usr/local/lib/node_modules/:/usr/local/lib

# Install dependencies (including private)
ARG NPM_TOKEN
RUN echo //registry.npmjs.org/:_authToken=${NPM_TOKEN} > /usr/src/covid19-reports/.npmrc

COPY package.json /usr/src/covid19-reports/
COPY package-lock.json /usr/src/covid19-reports/

RUN npm install

# Copy rest of src over
COPY . /usr/src/covid19-reports

RUN chmod +x /usr/src/covid19-reports/build_prod.sh \
  && npm run build

FROM node:10 as runtime
WORKDIR /covid19-reports
COPY --from=buildtime /usr/src/covid19-reports /covid19-reports
COPY package.json /covid19-reports
COPY package-lock.json /covid19-reports
COPY run_prod.sh /covid19-reports
RUN chmod +x /covid19-reports/run_prod.sh
ENV NODE_ENV=prod
EXPOSE 4000
CMD [ "npm", "start" ]
