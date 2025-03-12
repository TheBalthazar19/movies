import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const app = new Hono()


type movie = {
    id: string
    title: string
    director: string
    releaseYear: number
    genre: string
    ratings: number[]
}
let movies: movie[] = []

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.post('/addMovie', async (c) => {
  const body = await c.req.json()
  const { id, title, director, releaseYear, genre } = body
  if (!id || !title || !director || !releaseYear || !genre) {
    return c.json({ error: 'Missing required fields' }, 400)
  }
  movies.push({ id, title, director, releaseYear, genre, ratings: [] })
  return c.json({ message: 'Movie added successfully' })
})

// Rate a movie
app.post('/rateMovie/:id', async (c) => {
  const id = c.req.param('id')
  const { rating } = await c.req.json()
  const movie = movies.find(m => m.id === id)
  if (!movie) return c.json({ error: 'Movie not found' }, 404)
  if (rating < 1 || rating > 5) return c.json({ error: 'Invalid rating' }, 400)
  movie.ratings.push(rating)
  return c.json({ message: 'Rating added successfully' })
})

// Get average rating of a movie
app.get('/AverageRating/:id', (c) => {
  const id = c.req.param('id')
  const movie = movies.find(m => m.id === id)
  if (!movie || movie.ratings.length === 0) return c.json({ averageRating: undefined })
  const avgRating = movie.ratings.reduce((a, b) => a + b, 0) / movie.ratings.length
  return c.json({ averageRating: avgRating })
})

// Get top-rated movies
app.get('/TopRatedMovies', (c) => {
  const sortedMovies = [...movies].sort((a, b) => {
    const avgA = a.ratings.length ? a.ratings.reduce((sum, r) => sum + r, 0) / a.ratings.length : 0
    const avgB = b.ratings.length ? b.ratings.reduce((sum, r) => sum + r, 0) / b.ratings.length : 0
    return avgB - avgA
  })
  return c.json(sortedMovies)
})

app.get('/MoviesByGenre/:genre', (c) => {
  const genre = c.req.param('genre')
  const filteredMovies = movies.filter(m => m.genre.toLowerCase() === genre.toLowerCase())
  return c.json(filteredMovies)
})

// Get movies by director
app.get('/MoviesByDirector/:director', (c) => {
  const director = c.req.param('director')
  const filteredMovies = movies.filter(m => m.director.toLowerCase() === director.toLowerCase())
  return c.json(filteredMovies)
})


app.get('/searchMoviesBasedOnKeyword/:keyword', (c) => {
  const keyword = c.req.param('keyword').toLowerCase()
  const filteredMovies = movies.filter(m => m.title.toLowerCase().includes(keyword))
  return c.json(filteredMovies)
})
app.get('/getMovie/:id', (c) => {
  const id = c.req.param('id')
  const movie = movies.find(m => m.id === id)
  return movie ? c.json(movie) : c.json({ error: 'Movie not found' }, 404)
})
app.delete('/removeMovie/:id', (c) => {
  const id = c.req.param('id')
  const initialLength = movies.length
  movies = movies.filter(m => m.id !== id)
  return c.json({ message: initialLength > movies.length ? 'Movie removed' : 'Movie not found' })
})

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})