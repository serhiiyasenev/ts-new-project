const addNumbers = (a: number, b: number) => a + b;

const showThis = () => {
    console.log(this);
}


const user = {
    name: 'Alice',
    greet: function() {
        console.log(`Hello, ${this.name}`);
    }
};
user.greet();

showThis();

function greet(this: {name: string}) {
    console.log(`Hello, ${this.name}`);
}

greet.call({name: 'Bob'});

function introduce(this: {name: string, age: number}) {
    console.log(`I am ${this.name} and I am ${this.age} years old.`);
}

introduce.apply({name: 'Charlie', age: 30});

const boundIntroduce = introduce.bind({name: 'Diana', age: 25});
boundIntroduce();   

function greetAll(...names: string[]) {
    names.forEach(name => console.log(`Hello, ${name}`));
}

greetAll('Eve', 'Frank', 'Grace');

function withLoggiing(fn: (x: number) => number) {
    return function(x: number) {
        console.log(`Calling function with argument: ${x}`);
        const result = fn(x);
        console.log(`Function returned: ${result}`);
        return result;
    }   
}

const double = (x: number) => x * 2;   

withLoggiing(double)(5);
const loggedDouble = withLoggiing(double);
loggedDouble(10);

function getValue<T>(value: T): T {
    return value;
}

const num = getValue<number>(42);
const str = getValue<string>('Hello'); 
console.log(num, str);

function identity<T>(arg: T): T {
    return arg;
}   

const output1 = identity<string>('myString');
const output2 = identity<number>(100);
console.log(output1, output2);

type ApiResponse<T> = {
    data: T
};

const response1: ApiResponse<string> = { data: 'Hello World' };
const response2: ApiResponse<number> = { data: 12345 };
console.log(response1, response2);
const response3: ApiResponse<{id: number, name: string}> = { data: {id: 1, name: 'Item 1'} };
console.log(response3);


type Trinity<T, U, V> = {
    first: T;
    second: U;
    third: V;
};
const trinityExample: Trinity<number, string, boolean> = {
    first: 1,
    second: 'two',
    third: true
};
console.log(trinityExample);

type Pair<K, V> = {
    key: K;
    value: V;
};

const pairExample: Pair<string, number> = {
    key: 'age',
    value: 30
};
console.log(pairExample);

type Map<K, V> = {
    [key: string]: V;
};

type GenericMap<K = string, V = number> = Map<K, V>;

const genericMapExample: GenericMap<string, number> = {
    'one': 1,
    'two': 2,
    'three': 3
};
console.log(genericMapExample);

function merge<T extends object, U extends object>(obj1: T, obj2: U): T & U {
    return { ...obj1, ...obj2 };
}

const merged = merge({ name: 'Alice' }, { age: 30 });
console.log(merged);

type MappedType<T> = {
    [P in keyof T]: T[P];
};  

type User = {
    id: number;
    name: string;
    isActive: boolean;
};

type MappedUser = MappedType<User>;
const mappedUserExample: MappedUser = {
    id: 1,
    name: 'Bob',
    isActive: true
};
console.log(mappedUserExample);

type Readonly<T> = {
    readonly [P in keyof T]: T[P];
};
type ReadonlyUser = Readonly<User>;
const readonlyUserExample: ReadonlyUser = {
    id: 2,
    name: 'Charlie',
    isActive: false
};
console.log(readonlyUserExample);

type PartialUser = {
    [T in keyof User]?: User[T];
};
const partialUserExample: PartialUser = {
    name: 'Diana'
};
console.log(partialUserExample);

type ReadOnlyUser ={
    readonly id: number;
    readonly name: string;
    readonly isActive: boolean;
}

const readOnlyUserExample: ReadOnlyUser = {
    id: 3,
    name: 'Eve',
    isActive: true
};
console.log(readOnlyUserExample);

// readOnlyUserExample.id = 4; // Error: Cannot assign to 'id' because it is a read-only property

type PickUserNameAndStatus = {
    [P in 'name' | 'isActive']: User[P];
};  

const pickUserExample: PickUserNameAndStatus = {
    name: 'Frank',
    isActive: true
};
console.log(pickUserExample);

type OmitUserId = {
    [P in Exclude<keyof User, 'id'>]: User[P];
};
const omitUserExample: OmitUserId = {
    name: 'Grace',
    isActive: false
};
console.log(omitUserExample);

type UserKeys = keyof User; // "id" | "name" | "isActive"
const userKeyExample: UserKeys = 'name';
console.log(userKeyExample);    

type UserRecord = Record<'id' | 'name' | 'isActive', string | number | boolean>;
const userRecordExample: UserRecord = {
    id: 1,  
    name: 'Hank',
    isActive: true
};
console.log(userRecordExample);

type IsString<T> = T extends string ? "Yes" : "No";

type ExtractString<T> = T extends string ? T : never;

type NonString<T> = T extends string ? never : T;

type ElementType<T> = T extends (infer U)[] ? U : T;

