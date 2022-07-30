publish.server:
	docker buildx build --platform=linux/amd64 -t carldu/todo-server:latest -f "./src/server/Dockerfile" "./src/server"
	docker push carldu/todo-server:latest

publish.pc:
	cd ./src/client_pc
	yarn install && yarn build
	docker buildx build --platform=linux/amd64 -t carldu/todo-html-pc:latest .
	# docker push carldu/todo-html-pc:latest

publish.mobile:
	# npm run build
	# docker buildx build --platform=linux/amd64 -t carldu/todo-html-mobile:latest -f "./src/client_mobile/Dockerfile" "./src/client_mobile"
	# docker push carldu/todo-html-mobile:latest

publish:
	make publish.server
	make publish.pc
	make publish.mobile