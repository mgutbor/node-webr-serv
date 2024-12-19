
import http from 'http';
import fs from 'fs';

const server = http.createServer((req, res) => {
  console.log(req.url);

  // res.writeHead(200, { 'Content-Type': 'text/html' });
  // res.write(`<h1>Page ${req.url}</h1>`);
  // res.end();

  // const data = {
  //   name: 'Manuel',
  //   age: 45,
  //   city: 'Sevilla'
  // };

  // res.writeHead(200, { 'Content-Type': 'application/json' });
  // res.end(JSON.stringify(data));

  if (req.url === '/') {
    const htmlFile = fs.readFileSync('./public/index.html', 'utf-8');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(htmlFile);
    return;
  }

  if(req.url?.includes('.js')) {
    res.writeHead(200, { 'Content-Type': 'text/javascript' });
  } else if (req.url?.includes('.css')) {
    res.writeHead(200, { 'Content-Type': 'text/css' });
  }
  
  const responseContent = fs.readFileSync(`./public${req.url}`, 'utf-8');
  res.end(responseContent);

});

server.listen(8080, () => {
  console.log('Server running on port 8080');
});
