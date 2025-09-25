import movies from './movies.json';
import { z } from 'zod';

const schema = z.object({
    title: z.string(),
    year: z.number().int().min(1888).max(new Date().getFullYear()),
    director: z.string(),
    genre: z.string(),
    rating: z.number().min(0).max(10)
});

const moviesSchema = z.array(schema);

type Movie = z.infer<typeof schema>;

const parsedMovies: Movie[] = moviesSchema.parse(movies);

console.log(parsedMovies);

console.log('------------------------------------------------------');

