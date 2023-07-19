rem install dependencies
call npm i

rem install puppeteer's dependencies??? idk why/if this is necessary
cd node_modules/puppeteer
call npm i
cd ../../

rem run the script
node main.js
pause
