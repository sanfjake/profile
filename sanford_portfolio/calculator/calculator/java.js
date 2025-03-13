document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display');
    let currentOperand = '';
    let previousOperand = '';
    let operator = null;

    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            if (button.hasAttribute('data-number')) {
                appendNumber(button.getAttribute('data-number'));
            } else if (button.hasAttribute('data-operator')) {
                chooseOperator(button.getAttribute('data-operator'));
            } else if (button.id === 'equals') {
                compute();
            } else if (button.id === 'clear') {
                clear();
            } else if (button.id === 'delete') {
                deleteNumber();
            } else if (button.id === 'decimal') {
                appendDecimal();
            }
        });
    });

    function appendNumber(number) {
        if (number === '0' && currentOperand === '0') return;
        currentOperand = currentOperand === '0' ? number : currentOperand + number;
        updateDisplay();
    }

    function appendDecimal() {
        if (!currentOperand.includes('.')) {
            currentOperand += '.';
            updateDisplay();
        }
    }

    function chooseOperator(selectedOperator) {
        if (currentOperand === '') return;
        if (previousOperand !== '') compute();
        operator = selectedOperator;
        previousOperand = currentOperand;
        currentOperand = '';
    }

    function compute() {
        let computation;
        const prev = parseFloat(previousOperand);
        const current = parseFloat(currentOperand);
        if (isNaN(prev) || isNaN(current)) return;

        switch (operator) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '/':
                computation = current === 0 ? 'Error' : prev / current;
                break;
            default:
                return;
        }
        currentOperand = computation.toString();
        operator = null;
        previousOperand = '';
        updateDisplay();
    }

    function clear() {
        currentOperand = '0';
        previousOperand = '';
        operator = null;
        updateDisplay();
    }

    function deleteNumber() {
        currentOperand = currentOperand.slice(0, -1) || '0';
        updateDisplay();
    }

    function updateDisplay() {
        display.textContent = currentOperand;
    }

    clear();
});
