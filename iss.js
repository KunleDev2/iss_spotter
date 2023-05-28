const request = require('request');
const ipApiUrl = 'https://api.ipify.org/?format=json';
const coordApiUrl = 'http://ipwho.is/';
const flyOverApiUrl = 'https://iss-flyover.herokuapp.com/json/?lat=';
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

const fetchCoordsByIP = function(ip, callback) {
  request(coordApiUrl + ip, (error, response, body) => {

    const resp = JSON.parse(response.body);

    if (error) {
      callback(error, null);
      return;
    }

    if (resp.success === false) {
      const msg = `Success status was ${resp.success}. Server message says: ${resp.message} when fetching for IP ${resp.ip}`;
      callback(Error(msg), null);
      return;
    }

    const data = JSON.parse(body);
    const { latitude, longitude } = data;

    if (data.length === 0) {
      callback(ifDataNotAvail);
    } else {
      callback(error, { latitude, longitude });
    }
  });
};

const fetchISSFlyOverTimes = function(coords, callback) {

  request(flyOverApiUrl + coords.latitude + '&lon=' + coords.longitude, (error, response, body) => {

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

    callback(error, data.response);
  });
};

module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes };