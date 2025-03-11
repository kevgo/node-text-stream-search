test: node_modules build lint unit docs   # runs all tests
.PHONY: test

unit: node_modules   # runs the unit tests
	env NODE_NO_WARNINGS=1 ${CURDIR}/node_modules/.bin/mocha --reporter dot test/*.ts

update:  # update dependencies
	npm exec -- npm-check-updates -u
	npm install


#### helper tasks

dist: $(shell find src -type f)
	${CURDIR}/node_modules/.bin/tsc -p tsconfig-build.json
	touch dist

node_modules: package.json package-lock.json
	npm install
	touch node_modules

tools/actionlint:
	curl -s https://raw.githubusercontent.com/rhysd/actionlint/main/scripts/download-actionlint.bash | bash
	mkdir -p tools
	mv actionlint tools


.SILENT:
.DEFAULT_GOAL := help
