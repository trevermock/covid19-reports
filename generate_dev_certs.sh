#!/bin/bash

mkdir server/keys

export ORGANIZATION="COVID Reports Dev"
export ORGANIZATIONAL_UNIT="COVID Reports Dev"
export CERTIFICATE_AUTHORITY_NAME="coviddevca"
export SERVER_CA_NAME="coviddevlocal"

# Create Certificate Authority
rm -rf server/certs
mkdir server/certs
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -subj "/C=US/O=${ORGANIZATION}/OU=${ORGANIZATIONAL_UNIT}/CN=${CERTIFICATE_AUTHORITY_NAME}" -keyout server/certs/ca.key -out server/certs/ca.crt

# Create Server Keys
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -subj "/C=US/O=${ORGANIZATION}/OU=${ORGANIZATIONAL_UNIT}/CN=${SERVER_CA_NAME}" -keyout server/certs/server.key -out server/certs/server.crt

# Create User Keys
mkdir server/certs/user

# Create Test Root Admin User Keys
openssl genrsa -out server/certs/user/rootadmin.key 2048
openssl req -new -key server/certs/user/rootadmin.key -subj "/C=US/O=${ORGANIZATION}/OU=${ORGANIZATIONAL_UNIT}/OU=USER/CN=TEST.USER.ROOTADMIN.0000000001" --out server/certs/user/rootadmin.csr
openssl x509 -req -in server/certs/user/rootadmin.csr -CA server/certs/ca.crt -CAkey server/certs/ca.key -CAcreateserial -out server/certs/user/rootadmin.crt
openssl pkcs12 -export -out server/certs/user/rootadmin.p12 -inkey server/certs/user/rootadmin.key -in server/certs/user/rootadmin.crt -certfile server/certs/ca.crt -passout pass:

# Create Test Org Admin User Keys
openssl genrsa -out server/certs/user/orgadmin.key 2048
openssl req -new -key server/certs/user/orgadmin.key -subj "/C=US/O=${ORGANIZATION}/OU=${ORGANIZATIONAL_UNIT}/OU=USER/CN=TEST.USER.ORGADMIN.0000000002" --out server/certs/user/orgadmin.csr
openssl x509 -req -in server/certs/user/orgadmin.csr -CA server/certs/ca.crt -CAkey server/certs/ca.key -CAcreateserial -out server/certs/user/orgadmin.crt
openssl pkcs12 -export -out server/certs/user/orgadmin.p12 -inkey server/certs/user/orgadmin.key -in server/certs/user/orgadmin.crt -certfile server/certs/ca.crt -passout pass:

# Create Basic User Keys
openssl genrsa -out server/certs/user/user.key 2048
openssl req -new -key server/certs/user/user.key -subj "/C=US/O=${ORGANIZATION}/OU=${ORGANIZATIONAL_UNIT}/OU=USER/CN=TEST.USER.BASIC.0000000003" --out server/certs/user/user.csr
openssl x509 -req -in server/certs/user/user.csr -CA server/certs/ca.crt -CAkey server/certs/ca.key -CAcreateserial -out server/certs/user/user.crt
openssl pkcs12 -export -out server/certs/user/user.p12 -inkey server/certs/user/user.key -in server/certs/user/user.crt -certfile server/certs/ca.crt -passout pass:
