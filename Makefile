# import docker config
# You can change the default docker config with `make dpl="deploy_special.env" release`
dpl ?= docker.env
include $(dpl)
export $(shell sed 's/=.*//' $(dpl))

# The port exposed in the container
ifndef PORT
	override PORT = 8000
endif

# The local port the service will be runned
ifndef PORT_LOCAL
	override PORT_LOCAL = PORT
endif

IMAGE_L = $(shell echo $(IMAGE) | tr A-Z a-z)

LABELS=
ifdef EXPOSE_DOMAIN
	LABELS += --label traefik.enable=true \
			  --label traefik.http.routers.${IMAGE_L}.rule=Host\(\`$(EXPOSE_DOMAIN)\`\) \
			  --label traefik.services.$(IMAGE_L).loadbalancer.server.port=$(PORT)
endif

# HELP
# This will output the help for each task
# thanks to https://marmelab.com/blog/2016/02/29/auto-documented-makefile.html
.PHONY: help build build-nc

help: ## This help.
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

.DEFAULT_GOAL := help


# DOCKER TASKS
# Build the container
build: ## Build the container
	DOCKER_BUILDKIT=1 docker build -t $(IMAGE) .

build-nc: ## Build the container without caching
	DOCKER_BUILDKIT=1 docker build --no-cache -t $(IMAGE) .

run: ## Run container on port configured in `config.env`
	docker run -i -t --rm -p=$(PORT_LOCAL):$(PORT) --name="$(IMAGE)-service" $(LABELS) $(IMAGE)


up: build run ## Run container on port configured in `docker.env` (Alias to run)

down: ## Stop and remove a running container
	docker stop $(IMAGE)-service; docker rm $(IMAGE)-service 2&>/dev/null || true

release: build publish ## Make a release by building and publishing `latest` tagged containers to the registry

# Docker publish
publish: publish-latest ## Publish the `latest` tagged containers to the registry

publish-latest: tag-latest ## Publish the `latest` taged container to the registry
	@echo 'publish latest to $(REPO)'
	docker push $(REPO)/$(IMAGE):latest

# Docker tagging
tag: tag-latest ## Generate container tags `latest`

tag-latest: ## Generate container `latest` tag
	@echo 'create tag latest'
	docker tag $(IMAGE) $(REPO)/$(IMAGE):latest

demo:
	ngrok http --host-header="localhost:8060" http://0.0.0.0:8060/

