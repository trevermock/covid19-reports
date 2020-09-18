# Makefile for building se-ingest-router

ORG ?= prominentedgestatengine
REPO ?= dds-covid19-reports
ENVIRONMENT ?= development

SHA=$(shell git rev-parse --short HEAD)
BRANCH=$(shell git rev-parse --symbolic-full-name --abbrev-ref HEAD)

TAG=${BRANCH}-${SHA}-${ENVIRONMENT}

login:  
	$$(aws ecr get-login --no-include-email --region us-east-1)

build:
	docker build \
	-t $(ORG)/$(REPO):${TAG} \
	--build-arg NPM_TOKEN=$(NPM_TOKEN) \
	--no-cache \
	--network=host \
	.
	echo "TAG=${TAG}" > tag.properties

push:
	docker push \
	$(ORG)/$(REPO):${TAG}

