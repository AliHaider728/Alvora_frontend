const http = require('http');

async function test() {
  const loginData = JSON.stringify({ email: 'admin@alvora.pk', password: 'adminpassword123' }); // guess
  const req = http.request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': loginData.length }
  }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log("Login:", data);
      const parsed = JSON.parse(data);
      if (parsed.token) {
        const req2 = http.request({
          hostname: 'localhost',
          port: 5000,
          path: '/api/reviews/admin',
          method: 'GET',
          headers: { 'Authorization': `Bearer ${parsed.token}` }
        }, (res2) => {
          let data2 = '';
          res2.on('data', chunk => data2 += chunk);
          res2.on('end', () => console.log("Reviews:", data2));
        });
        req2.end();
      }
    });
  });
  req.write(loginData);
  req.end();
}
test();