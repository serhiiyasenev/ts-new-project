import { set } from "zod";
import de from "zod/v4/locales/de.js";

class Singleton {
  private static instance: Singleton;

  private constructor() {}

  static getInstance(): Singleton {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }
    return Singleton.instance;
  }
}

const singleton1 = Singleton.getInstance();
const singleton2 = Singleton.getInstance();

console.log(singleton1 === singleton2); // true

interface Vehicle {
  start(): void;
}

class Car implements Vehicle {
  constructor(private make: string, private model: string) {}
  start(): void {
    console.log(`Starting ${this.make} ${this.model} car`);
  }
}

class Bike implements Vehicle {
  constructor(private make: string, private model: string) {}
  start(): void {
    console.log(`Starting ${this.make} ${this.model} bike`);
  }
}

class Truck implements Vehicle {
  constructor(private make: string, private model: string) {}
  start(): void {
    console.log(`Starting ${this.make} ${this.model} truck`);
  }
}

class VehicleFactory {
  static createVehicle(type: 'car' | 'bike' | 'truck'): Vehicle {
    switch (type) {
      case 'car':
        return new Car('Toyota', 'Corolla');
      case 'bike':
        return new Bike('Yamaha', 'Sport');
      case 'truck':
        return new Truck('Ford', 'F-150');
      default:
        throw new Error('Invalid vehicle type');
    }
  }
}

const myCar = VehicleFactory.createVehicle('car');
myCar.start();
const myBike = VehicleFactory.createVehicle('bike');
myBike.start();
const myTruck = VehicleFactory.createVehicle('truck');
myTruck.start();


interface Observer {
  update(message: string): void;
}

class ConcreteObserver implements Observer {
  constructor(private name: string) {}

  update(message: string): void {
    console.log(`Observer ${this.name} received message: ${message}`);
  }
}

class Subject {
  private observers: Observer[] = [];

  subscribe(observer: Observer): void {
    this.observers.push(observer);
    }

  unsubscribe(observer: Observer): void {
    this.observers = this.observers.filter(obs => obs !== observer);
    }

    notify(message: string): void {
    this.observers.forEach(observer => observer.update(message));
    }
}

const subject = new Subject();
const observer1 = new ConcreteObserver('A');
const observer2 = new ConcreteObserver('B');

subject.subscribe(observer1);
subject.subscribe(observer2);

subject.notify('Hello Observers!');

class ChatRoom {
  private participants: Participant[] = [];

  join(participant: Participant): void {
    this.participants.push(participant);
  }

  leave(participant: Participant): void {
    this.participants = this.participants.filter(p => p !== participant);
  }

  sendMessage(sender: Participant, message: string): void {
    this.participants.forEach(participant => {
      if (participant !== sender) {
        participant.receiveMessage(sender, message);
      }
    });
  }

  broadcast(message: string): void {
    this.participants.forEach(participant => {
      console.log(`${participant['name']} received broadcast: ${message}`);
    });
  }
}

class Participant {
  constructor(private name: string, private chatRoom: ChatRoom) {
    this.chatRoom.join(this);
  }

  send(message: string): void {
    this.chatRoom.sendMessage(this, message);
  }

    receiveMessage(sender: Participant, message: string): void {
    console.log(`${this.name} received message from ${sender.name}: ${message}`);
  }
}

const chatRoom = new ChatRoom();
const alice = new Participant('Alice', chatRoom);
const bob = new Participant('Bob', chatRoom);

alice.send('Hello Bob!');
bob.send('Hi Alice!');
chatRoom.broadcast('How are you, guys?');

const promise = new Promise<string>((resolve, reject) => {
  setTimeout(() => {
    const success = true; // Change to false to test rejection
    if (success) {
      resolve('Operation succeeded');
    } else {
      reject('Operation failed');
    }
  }, 1000);
});

promise
  .then(result => {
    console.log(result);
  })
  .catch(error => {
    console.error(error);
  });   

async function fetchData(url: string): Promise<string> {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.text();
}

(async () => {
  await fetchData('https://scheduler-api-demo.azurewebsites.net/api/User/GetAllUsers')
    .then(data => {
      console.log("=============================== FETCH DATA START===============================");
      console.log(data);
       console.log("=============================== FETCH DATA END===============================");
    });
})();

const successfulPromise =  [
    (async () => await fetchData('https://scheduler-api-demo.azurewebsites.net/api/User/GetAllUsers'))(),
    (async () => await fetchData('https://jsonplaceholder.typicode.com/posts/1'))(),
    (async () => await fetchData('https://jsonplaceholder.typicode.com/posts/2'))(),
]

Promise.all(successfulPromise)
    .then(results => {
        console.log("=============================== PROMISE ALL ===============================");
        results.forEach((data, index) => {
            console.log(`Data from promise ${index + 1}: ${data}`);
        });
    })
    .catch(error => {
        console.error('One of the promises failed:', error);
    }).finally(() => {
        console.log("================================ FINALLY ===============================");
    });

async function asyncAwaitExample() {
    try {
        const data1 = await fetchData('https://scheduler-api-demo.azurewebsites.net/api/User/GetAllUsers');
        console.log("=============================== ASYNC AWAIT ===============================");
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log("=============================== ASYNC AWAIT ===============================");
        console.log('Data from first fetch:', data1);
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error occurred in asyncAwaitExample:', error.message);
        } else {
            console.error('Error occurred in asyncAwaitExample:', error);
        }
    } finally {
        console.log('asyncAwaitExample completed');
    };
}

asyncAwaitExample();


