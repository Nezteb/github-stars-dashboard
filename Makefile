≥÷.DEFAULT_GOAL := run

### Docker Development Commands

.PHONY: run
run: build
	yarn dev

.PHONY: build
build:
	yarn && yarn build

.PHONY: deploy
deploy:
	yarn deploy

.PHONY: json
json:
	cd scripts && \
		yarn && \
		npx tsc && \
		node -r source-map-support/register dist/get_stars_json.js
