// Задача 1


function myName(Amaliya) {
    return Amaliya
}

const result = myName('Hello')
console.log(result)

// --------------------------------------
// Задача 2

const number = [1, 2, 3, 5, 6, 7, 8, 9, 10]

function checkTheNambers(array,numbers) {
    for (let i=0; i<array.length; i++) {
        if (array[i] === numbers) {
            return `${numbers} less than 10`
        }
    }
    return `${numbers} more 10`
}

console.log(checkTheNambers(number, 5))


// --------------------------------------

// Задача 3


function calculator (firstNumber, secondNumber, operator) {
    if (operator == 'plus') {
        return firstNumber + secondNumber
    } else if (operator == 'minus' ) {
        return firstNumber - secondNumber
    } else if (operator == 'division' ) {
        return firstNumber / secondNumber
    } 
}

console.log(calculator(6,5,'plus'))






















