var request = require("request");

var options = { method: 'POST',
  url: 'https://restpack.io/api/screenshot/v4/capture',
  headers: { 'x-access-token': '8p9D8s6OUlIdbjFhDSfcreA6fkzBPKin8YRKSdCl2ocUgfQq' },
  form: { url: 'https://trends.google.com/trends/explore?q=curcumin', json: true } };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});