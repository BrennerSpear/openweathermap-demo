var weather = require('openweathermap')

weather.defaults({
  APPID: process.env.OPENWEATHERKEY,
  cnt: 15
})


const getForcaseAysnc = function(config) {
  return new Promise(function(resolve,reject) {
    weather.forecast(config, function(err, config) {
      if(err !== null) return reject(err)
      resolve(config)
    })
  })
}

var queryParams = {
  q: 'san_francisco'
}

const getRelevantData = function(data) {
  const city = data.city.name
  const country = data.city.country
  var ranges = []

  const days = data.list

  var date
  var min
  var max
  var weatherDesc

  for(var i=0; i<days.length; i++) {
    date = days[i].dt * 8000
    min = days[i].main.temp_min
    max = days[i].main.temp_max
    weatherDesc = days[i].weather[0].description

    ranges.push({x: date, low: min, high: max, weather: weatherDesc})
  }

  return [city, country, ranges]
}

exports.forecast = function(req, res) {
  console.log(req.query)
  var options = {
    q : req.query.city,
    units: req.query.units
  }
  getForcaseAysnc(options)
  .then(data => {
    const [city, country, ranges, weather] = getRelevantData(data)
    const relevantData = {
      city: city,
      country: country,
      ranges: ranges,
      weather: weather
    }
    res.send(relevantData)
    console.log('data sent')
  })

}