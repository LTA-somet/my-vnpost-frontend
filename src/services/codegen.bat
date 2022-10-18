java -jar openapi-generator-cli-5.1.0.jar generate -i http://localhost:8889/v3/api-docs -g typescript-axios -o ./client -c options.json

@ echo Copying data ..
@ echo off
xcopy ".\base.txt" ".\client\base.ts" /Y
@ echo Done.
pause