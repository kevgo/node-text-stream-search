.DEFAULT_GOAL := spec

# platform-specificity
ifdef ComSpec
	/ := $(strip \)
else
	/ := /
endif


build: clean    # builds for the current platform
	@node_modules$/.bin$/tsc -p .

clean:   # removes all build artifacts
	@rm -rf dist

cuke: build   # runs the feature specs
	@node_modules$/.bin$/cucumber-js

deploy: build  # deploys a new version to npmjs.org
	npm publish

docs: build   # runs the documentation tests
	@node_modules$/.bin$/text-run --offline

fix:
	tslint --project tsconfig.json --fix
	prettier --write src/*.ts

help:   # prints all make targets
	@cat Makefile | grep '^[^ ]*:' | grep -v '.PHONY' | grep -v help | sed 's/:.*#/#/' | column -s "#" -t

lint:   # lints all files
	tsc --noEmit
	prettier -l "src/**/*.ts"

spec: lint cuke docs   # runs all tests

upgrade:   # updates the dependencies to their latest versions
	yarn upgrade-interactive
