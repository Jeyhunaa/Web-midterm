const opArea = document.querySelector('.op-area');
const resultArea = document.querySelector('.result-area');
const resultDisplay = document.querySelector('.result');
const keys = document.querySelectorAll('.key');

let currentInput = ''; 
let checkInput = '';
let result = 0; 
let resetScreen = false; 
let allowDecimal = true; 

function handleKeyClick(event) {
    const key = event.target;
    const keyValue = key.textContent;
    const isOperator = key.classList.contains('op');
    const isNumber = key.classList.contains('num');

    if (resetScreen && (isNumber || isOperator)) {
        currentInput = resetScreen && isOperator ? result.toString() : ''; 
        resultArea.classList.add('hidden'); 
        resetScreen = false;
        allowDecimal = true; 
    }

    if (isNumber) {
        if (keyValue !== '.' && currentInput === '0') {
            currentInput = keyValue; 
        } else if (keyValue === '.' && (!currentInput || /[\+\-X/%]$/.test(currentInput))) {
            currentInput += '0.';
            allowDecimal = false; 
        } else if (keyValue === '.' && !allowDecimal) {
            return; 
        } else if (keyValue === '.') {
            currentInput += keyValue; 
            allowDecimal = false;
        } else {
            currentInput += keyValue; 
        }
        updateDisplay(currentInput);
    } else if (isOperator) {
        handleOperator(keyValue);
    }
}

function handleOperator(operator) {
    switch (operator) {
        case 'C':
            checkInput = '';
            clearAll();
            break;
        case '←':
            checkInput = '';
            backspace();
            break;
        case '±':
            checkInput = '';
            toggleSign(); 
            break;
        case '%':
            addOperatorToInput('%'); 
            break;
        case '=':
            calculateResult();
            break;
        default:
            addOperatorToInput(operator);
            break;
    }
}

function updateDisplay(displayValue) {
    opArea.textContent = displayValue;
}

function clearAll() {
    currentInput = '0';
    result = 0;
    resetScreen = false;
    allowDecimal = true; 
    resultArea.classList.add('hidden');
    updateDisplay(currentInput);
}

function backspace() {
    if (currentInput.slice(-1) === '.') {
        allowDecimal = true; 
    }
    currentInput = currentInput.slice(0, -1) || '0';
    updateDisplay(currentInput);
}


function toggleSign() {
    const lastNumberMatch = currentInput.match(/-?\d+(\.\d+)?$/);
    
    if (lastNumberMatch) {
        let lastNumber = lastNumberMatch[0];
        console.log(lastNumber);

        let negatedNumber; 

        if (lastNumber.startsWith('-')) {
            const beforeNumber = currentInput.slice(0, currentInput.length - lastNumber.length);
            const isFirstNumber = beforeNumber.trim() === '' || /[\+\-\*\/]$/.test(beforeNumber);
            
            if (isFirstNumber) {
                negatedNumber = lastNumber.slice(1); 
            } else {
                negatedNumber = lastNumber.replace('-', '+'); 
            }
        } else {
            negatedNumber = '-' + lastNumber; 
        }

        currentInput = currentInput.slice(0, -lastNumber.length) + negatedNumber;
        updateDisplay(currentInput.replace(/\*/g, 'x'));
    }
}



function addOperatorToInput(operator) {
    if (currentInput && !/[\+\-X/%]$/.test(currentInput)) {
        currentInput += operator === 'X' ? '*' : operator;
        updateDisplay(currentInput);
        allowDecimal = true; 
        resetScreen = false;
    }
}

function calculateResult() {
    try {

        const expression = currentInput.replace(/X/g, '*').replace(/(\d+)%/g, '($1/100)');
        result = Function('"use strict"; return (' + expression + ')')();
        resultDisplay.textContent = formatResult(result);
        resultArea.classList.remove('hidden');
        currentInput = result.toString(); 
        resetScreen = true;
    } catch (error) {
        alert('Invalid expression');
        clearAll();
    }
}

function formatResult(value) {
    const precisionThreshold = 1e-10;
    
    if (Math.abs(value - Math.round(value)) < precisionThreshold) {
        return Math.round(value);
    }
    
    return parseFloat(value.toFixed(10));
}

keys.forEach(key => key.addEventListener('click', handleKeyClick));
