// Задание 1
const use = {
    amaliya: {
        age: '20',
        patronymic: 'Melsovna',
        city: 'Saint-Petersburg',
        zodiacSign: 'Libra'
    }
}
console.log(use.amaliya)


// Задание 2
const user = {
    amaliya: {
        sayHello(name) {
            console.log(`Hello ${name}`)
        }
    }
}
console.log(user.amaliya)
user.amaliya.sayHello('Amaliya')


// Задание 3
const users = [
    {
        name: 'Amaliya',
        age: 20,
        isAdmin: false
    },
    {
        name: 'Alex',
        age: 28,
        isAdmin: true
    },
    {
        name: 'Ivan',
        age: 23,
        isAdmin: false
    },
    {
        name: 'Ann',
        age: 20,
        isAdmin: true
    },
    {
        name: 'John',
        age: 21,
        isAdmin: true
    }
];

let regularUsers = 0;

for (let i = 0; i < users.length; i++) {
    if (!users[i].isAdmin) {
        regularUsers++;
    }
}

console.log(regularUsers);































