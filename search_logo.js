const https = require('https');
https.get('https://raw.githubusercontent.com/walkxcode/dashboard-icons/main/svg/phenikaa-university.svg', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => { console.log(data.substring(0, 500)); });
}).on('error', (err) => { console.error(err); });
