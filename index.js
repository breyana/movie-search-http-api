const http = require('http')
const cheerio = require('cheerio')
const express = require('express')
const rp = require('request-promise')

const app = express();

app.get('/api/search/:movie', (request, response) => {
  response.set('Content-Type', 'application/json')
  const { movie } = request.params;
  const URL = `http://www.imdb.com/find?ref_=nv_sr_fn&q=${movie}&s=all`;

  const movies = { movies: [] }

  const options = {
    uri: URL,
    transform: body => cheerio.load(body)
  };

  rp(options)
    .then($ => {
      const titles = []
      $('.findSection')
        .first()
        .find('.result_text')
        .each((i, elem) => {
          titles[i] = $(elem).text().match(/(.+?) \(([0-9]{4})\)/)
        })
      return titles
    })
    .then(titles => {
      titles.forEach(array => {
        if (array) {
          const movie = {}
          movie.name = array[1]
          movie.year = array[2]
          movies.movies.push(movie)
        }
      })
      return movies
    })
    .then(movies => {
      response.json(movies)
    })

})

app.listen(3000, () => {
  console.log('App listening on port 3000!')
})
