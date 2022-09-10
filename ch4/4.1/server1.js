const { fstat } = require('fs');
const fs = require('fs').promises;
const http = require('http');

const server = http.createServer(async (req, res) => {
    try {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8'});
        const data = await fstat.readFile('./server2.html');
        res.end(data);
    } catch (error) {
        console.error(error);
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8'});
        res.end(error.message);
    }
   
})
    .listen(8080);

server.on('listening', () => {
    console.log('8080번 포트 연결중..');
});
server.on('error', (error) => {
    console.error(error);
});