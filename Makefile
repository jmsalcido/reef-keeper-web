.PHONY: deploy build sitemap typecheck

build:
	npm run build

sitemap:
	npm run generate:sitemap

typecheck:
	npm run typecheck

deploy: build
	npx --yes netlify-cli deploy --prod --dir=dist
