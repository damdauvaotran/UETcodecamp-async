var http = require('http');

const API_KEY = '1529f64cb0042362058eb4deb189677b'
// Utility function
function getWeather({ lat, lon }, callback) {
  let options = {
    method: 'GET',
    hostname: 'api.openweathermap.org',
    path: `/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`,
    headers: {},
    maxRedirects: 20,
  };

  let req = http.request(options, function (res) {
    let chunks = [];

    res.on('data', function (chunk) {
      chunks.push(chunk);
    });

    res.on('end', function (chunk) {
      let body = Buffer.concat(chunks);
      callback(JSON.parse(body.toString()));
    });

    res.on('error', function (error) {
      console.error(error);
      callback(null, error);
    });
  });

  req.end();
}

function getLatLong(callback) {
  var options = {
    method: 'GET',
    hostname: 'api.openweathermap.org',
    path: `/geo/1.0/direct?q=hanoi&limit=10&appid=${API_KEY}&country=VN`,
    headers: {},
    maxRedirects: 20,
  };

  var req = http.request(options, function (res) {
    var chunks = [];

    res.on('data', function (chunk) {
      chunks.push(chunk);
    });

    res.on('end', function (chunk) {
      var body = Buffer.concat(chunks);
      callback(JSON.parse(body.toString()));
    });

    res.on('error', function (error) {
      console.error(error);
      callback(null, error);
    });
  });

  req.end();
}

function promiseGetWeather({ lat, lon }) {
  return new Promise(function (resolve, reject) {
    getWeather({ lat, lon }, function (data, error) {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
}

function promiseGetLatLong() {
  return new Promise(function (resolve, reject) {
    getLatLong(function (data, error) {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
}
// Callback

getLatLong(function (data, error) {
  if (error) {
    console.log(error);
  } else {
    const { lat, lon } = data[0];
    getWeather({ lat, lon }, function (data, error) {
      if (error) {
        console.log(error);
      } else {
        console.log(data);
      }
    });
  }
})

// Promise
promiseGetLatLong()
  .then(function (data) {
    console.log(data[0]);
    const { lat, lon } = data[0];
    return promiseGetWeather({ lat, lon });
  })
  .then(function (data) {
    console.log(data);
  })
  .catch(function (error) {});
