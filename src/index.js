function eval() {
    // Do not use eval!!!
    return;
}

function multiple( a, b ) {
    return Number(a) * Number(b);
}

function addition( a, b ) {
    return Number(a) + Number(b);
}

function subtraction( a, b) {
    return Number(a) - Number(b);
}


function division( a, b ) {
    if ( Number(b) == 0 ) {
        throw new "TypeError: Division by zero.";
    }
    return Number(a) / Number(b);
}

function bracketsCounter( arr ) {
    let countLeft = 0;
    let countRight = 0;
    for ( let k of arr ) {
        if ( k === '(' ) {
            countLeft += 1;
        } else if ( k === ')') {
            countRight += 1;
        }
    }
    if ( countLeft != countRight ) {
        throw new Error('ExpressionError: Brackets must be paired');
    }
}

const priorities = new Map([['*', 2], ['/',2], ['-', 1], ['+', 1]]);

function expressionCalculator(expr) {
    let actions = [];
    let numbers = [];
    
    let checkString = expr.replace(/\+/g," + ").replace(/\-/g," - ").replace(/\*/g," * ").replace(/\//g," / ").replace(/\)/g," ) ").replace(/\(/g," ( ");
    let parts = checkString.split(' ');
    
    parts = parts.map(function(item){
        return item.replace(/\s+/g,'');
    })

    for ( let i = 0; i < parts.length; i++ ) {
        if ( parts[i] === ' ' || parts[i] === '' ) {
            parts.splice(i, 1);
        }
    }

    for ( let i = 0; i < parts.length; i++ ) {
        if ( parts[i] === '' ) {
            parts.splice(i, 1);
        }
    }

    bracketsCounter(parts);

    function distributor(action) {
        let secondNum = numbers.pop();
        let firstNumb = numbers.pop();

        if ( action === '*' ) {
           return multiple(firstNumb, secondNum);
        } else if ( action === '/' ) {
            return division(firstNumb, secondNum);
        } else if ( action === '-' ) {
            return subtraction(firstNumb, secondNum);
        } else if ( action === '+' ) {
            return addition(firstNumb, secondNum);
        }
    }

    for ( let k of parts ) {
        if ( k === '*' || k === '-' || k === '/' || k === '+' || k === '(' || k === ')' ) {
            //больше приоритет
            if ( k == '(' || actions[actions.length - 1] == undefined || priorities.get(k) > priorities.get(actions[actions.length - 1]) || actions[actions.length - 1] === '(' ) {
                actions.push(k);
            } else if ( k === ')') {
                top:
                for ( let i = actions.length - 1; i > 0; i-- ) {
                    if ( actions[i] === '(' || priorities.get(actions[i]) < priorities.get(k) ) {
                        let out = actions.pop();
                        break top;
                    } else {
                        numbers.push(distributor(actions.pop()));
                    }
                }
            } else { //меньше приоритет, выполняем последнее действие 
                top:
                for ( let i = actions.length - 1; ; i-- ) {

                    if ( actions[i] === '(' || priorities.get(actions[i]) < priorities.get(k) ) {
                        actions.push(k);
                        break top;
                    } else if ( actions[i] == undefined ) {
                        actions.push(k);
                        break top
                    } else {
                        numbers.push(distributor(actions.pop()));
                    }
                }
            }
        } else {
            numbers.push(k);
        }
    } 

    for ( let i = 0; i < actions.length; i++ ) {
        if ( actions[i] === '(' ) {
            actions.splice(i, 1);
        }
    }
    
    for ( let i = actions.length; i > 0; i-- ) {
        numbers.push(distributor(actions.pop()));
    }
    return Number(numbers);
}

module.exports = {
    expressionCalculator
}