// Basic array declarations
const numbers: number[] = [1, 2, 3, 4, 5];
const fruits: Array<string> = ['apple', 'banana', 'orange'];

// Array methods examples
// Adding elements
numbers.push(6);                    // Add to end
numbers.unshift(0);                 // Add to beginning

// Removing elements
const lastNumber = numbers.pop();   // Remove from end
const firstNumber = numbers.shift(); // Remove from beginning

// Array transformation
const doubled = numbers.map(num => num * 2);
const evenNumbers = numbers.filter(num => num % 2 === 0);
const sum = numbers.reduce((acc, curr) => acc + curr, 0);

// Checking elements
const hasThree = numbers.includes(3);
const indexOfFour = numbers.indexOf(4);

// Sorting
const sorted = [...numbers].sort((a, b) => a - b);

// Spread operator
const combined = [...numbers, ...sorted];

// Multi-dimensional array
const matrix: number[][] = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
];

// Array destructuring
const [first, second, ...rest] = numbers;

type Person = { id: number; name: string };

const users: Person[] = [{ id: 1, name: 'John' }, { id: 2, name: 'Steve' }]; // масив об'єктів

const readOnlyNums: readonly number[] = [1, 2, 3]; // readonly масив
//readOnlyNums.push(4); // Error: Property 'push' does not exist on type 'readonly number[]'.

// Tuple example
const tuple: [number, string, boolean] = [1, 'John', true]; // кортеж (tuple)

// Logging all variables
console.log('Basic arrays:', numbers, fruits);
console.log('Array operations:', lastNumber, firstNumber);
console.log('Transformed arrays:', doubled, evenNumbers, sum);
console.log('Array checks:', hasThree, indexOfFour);
console.log('Sorted array:', sorted);
console.log('Combined array:', combined);
console.log('Matrix:', matrix);
console.log('Destructured:', first, second, rest);
console.log('Users:', users);
console.log('ReadOnly array:', readOnlyNums);
console.log('Tuple:', tuple);