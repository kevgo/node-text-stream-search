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

docs: build   # runs the documentation tests
	@node_modules$/.bin$/text-run --offline --format dot

fix:  # fixes the fixable issues in the code base
	tslint --project tsconfig.json --fix
	prettier --write src/*.ts
	prettier --write **/*.md

help:   # prints all make targets
	@cat Makefile | grep '^[^ ]*:' | grep -v '.PHONY' | grep -v help | sed 's/:.*#/#/' | column -s "#" -t

lint:   # lints all files
	node_modules$/.bin$/tsc --noEmit
	node_modules/.bin/prettier -l "src/**/*.ts"
	node_modules/.bin/prettier -l "**/*.md"

test: lint unit docs   # runs all tests
.PHONY: test

unit:   # runs the unit tests
	@node_modules/.bin/mocha --reporter dot
