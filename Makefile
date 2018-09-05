.DEFAULT_GOAL := spec

build: clean    # builds for the current platform
	@node_modules/.bin/tsc -p .

build-win: clean
	@node_modules\.bin\tsc -p .

clean:   # removes all build artifacts
	@rm -rf dist

cuke: build   # runs the feature specs
	@node_modules/.bin/cucumber-js

cuke-win: build-win     # runs the feature specs on Windows
	@node_modules\.bin\cucumber-js --tags '(not @todo) and (not @skipWindows)' --format progress

deploy: build  # deploys a new version to npmjs.org
	npm publish

docs: build   # runs the documentation tests
	@node_modules/.bin/text-run --offline

fix:
	tslint --project tsconfig.json --fix
	prettier --write src/*.ts

help:   # prints all make targets
	@cat Makefile | grep '^[^ ]*:' | grep -v '.PHONY' | grep -v help | sed 's/:.*#/#/' | column -s "#" -t

lint:   # lints all files
	tsc --noEmit
	prettier -l "src/**/*.ts"

setup:   # sets up the installation on this machine
	node_modules/o-tools/bin/check-paths
	yarn install

spec: lint cuke docs   # runs all tests

upgrade:   # updates the dependencies to their latest versions
	yarn upgrade-interactive
