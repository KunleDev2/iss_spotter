const request = require('request');
const ipApiUrl = 'https://api.ipify.org/?format=json';
const ifDataNotAvail = "cat name is not available";

const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API
  request(ipApiUrl, (error, response, body) => {

    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const data = JSON.parse(body);

    if (data.length === 0) {
      callback(ifDataNotAvail);
    } else {
      callback(error, data.ip);
    }
  });
};

module.exports = { fetchMyIP };