.DEFAULT_GOAL := run

### Docker Development Commands

.PHONY: run
run: build
	yarn dev

.PHONY: build
build:
	yarn

.PHONY: json
json:
	cd scripts && \
		yarn && \
		tsc && \
		node -r source-map-support/register get_stars_json.js
