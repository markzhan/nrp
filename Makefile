test:
	NODE_ENV=test ./node_modules/.bin/mocha --reporter list

test-travis:
	NODE_ENV=test ./node_modules/.bin/istanbul cover ./node_modules/.bin/_mocha --report lcovonly -- --reporter dot

.PHONY: test test-travis
