import './json-validator';
import './grocery-store';

let whatever = '';
whatever = 'hello';

const user = {
    name: 'John',
    age: 30
};
user.age = 31;
user.name = 'Jane';

const user2 = {
    name: 'Alice',
    age: 25
} as const;

type Movie = {
    readonly id: number; // Readonly property
    title: string;
    description?: string; // Optional property
};

interface Awards {
    oscars: number;
    goldenGlobes: number;
}

type MovieWithAwards = Movie & Awards;

const movie: MovieWithAwards = {
    id: 1,
    title: 'Inception',
    oscars: 4,
    goldenGlobes: 2
};  

type Coordinates = [latitude: number, longitude: number]; // Tuple type
const point: Coordinates = [10, 20];

type RestTuple = [string, boolean, ...number[]]; // Tuple with rest elements
const restTuple: RestTuple = ['example', true, 1, 2, 3, 4, 5];
const [first, second, ...rest] = restTuple;

type RestTuple2 = [string, boolean, ...unknown[]]; // Tuple with rest unknown elements
const restTuple2: RestTuple2 = ['example', true, {key: 'value'}, 1, 2, 3, 4, 5];