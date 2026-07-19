NPM ?= npm

.PHONY: setup install env db-up db-down back front dev test lint build

setup: env install db-up

install:
	$(NPM) --prefix back install
	$(NPM) --prefix front install

env:
	node -e "const fs=require('fs');if(!fs.existsSync('back/.env'))fs.copyFileSync('back/.env.example','back/.env')"

db-up:
	docker compose up -d postgres

db-down:
	docker compose down

back: env
	$(NPM) --prefix back run dev

front:
	$(NPM) --prefix front run dev

dev: db-up env
	$(MAKE) -j2 back front

test:
	$(NPM) --prefix back test

lint:
	$(NPM) --prefix back run lint
	$(NPM) --prefix front run lint

build:
	$(NPM) --prefix back run build
	$(NPM) --prefix front run build

