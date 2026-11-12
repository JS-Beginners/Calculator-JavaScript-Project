(function() {
  const screen = document.querySelector('.screen');
  const buttons = document.querySelectorAll('.btn');
  const clear = document.querySelector('.btn-clear');
  const backspace = document.querySelector('.btn-backspace');
  const equal = document.querySelector('.btn-equal');
  let resultDisplayed = false;
  let errorDisplayed = false;

  function isOperator(value) {
    return ['+', '-', '*', '/'].includes(value);
  }

  function getCurrentNumber() {
    const expression = screen.value;
    let position = expression.length - 1;

    while (position >= 0 && !isOperator(expression[position])) {
      position--;
    }

    return expression.slice(position + 1);
  }

  function appendValue(value) {
    if (errorDisplayed) {
      screen.value = '';
      errorDisplayed = false;
      resultDisplayed = false;
    }

    if (resultDisplayed) {
      if (!isOperator(value)) {
        screen.value = '';
      }
      resultDisplayed = false;
    }

    if (/^\d$/.test(value)) {
      screen.value += value;
      return;
    }

    if (value === '.') {
      const currentNumber = getCurrentNumber();
      if (currentNumber.includes('.')) {
        return;
      }
      screen.value += currentNumber === '' ? '0.' : '.';
      return;
    }

    if (isOperator(value)) {
      const lastCharacter = screen.value.slice(-1);
      if (screen.value === '') {
        if (value === '-') {
          screen.value = value;
        }
        return;
      }
      if (isOperator(lastCharacter)) {
        if (value === '-' && lastCharacter !== '-') {
          screen.value += value;
        }
        return;
      }
      if (lastCharacter === '.') {
        screen.value += '0';
      }
      screen.value += value;
    }
  }

  function evaluateExpression(expression) {
    const compactExpression = expression.replace(/\s/g, '');
    const tokens = compactExpression.match(/\d+(?:\.\d*)?|\.\d+|[+\-*/]/g) || [];

    if (tokens.join('') !== compactExpression) {
      throw new SyntaxError('Invalid expression');
    }

    let position = 0;

    function parseFactor() {
      const token = tokens[position];

      if (token === '+' || token === '-') {
        position++;
        const value = parseFactor();
        return token === '-' ? -value : value;
      }

      if (!token || !/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(token)) {
        throw new SyntaxError('Invalid expression');
      }

      position++;
      return Number(token);
    }

    function parseTerm() {
      let value = parseFactor();

      while (tokens[position] === '*' || tokens[position] === '/') {
        const operator = tokens[position++];
        const right = parseFactor();

        if (operator === '/') {
          if (right === 0) {
            throw new RangeError('Cannot divide by zero');
          }
          value /= right;
        } else {
          value *= right;
        }
      }

      return value;
    }

    function parseExpression() {
      let value = parseTerm();

      while (tokens[position] === '+' || tokens[position] === '-') {
        const operator = tokens[position++];
        const right = parseTerm();
        value = operator === '+' ? value + right : value - right;
      }

      return value;
    }

    const result = parseExpression();
    if (position !== tokens.length || !Number.isFinite(result)) {
      throw new SyntaxError('Invalid expression');
    }
    return result;
  }

  function calculate() {
    if (screen.value.trim() === '') {
      screen.value = 'Please Enter a Value';
      errorDisplayed = true;
      resultDisplayed = true;
      return;
    }

    try {
      screen.value = String(evaluateExpression(screen.value));
      resultDisplayed = true;
      errorDisplayed = false;
    } catch (error) {
      if (error instanceof RangeError) {
        screen.value = 'Cannot divide by zero';
      } else if (error instanceof SyntaxError) {
        screen.value = 'Invalid Expression';
      } else {
        throw error;
      }
      errorDisplayed = true;
      resultDisplayed = true;
    }
  }

  function clearScreen() {
    screen.value = '';
    resultDisplayed = false;
    errorDisplayed = false;
  }

  function deleteLastCharacter() {
    if (errorDisplayed) {
      clearScreen();
      return;
    }
    screen.value = screen.value.slice(0, -1);
    resultDisplayed = false;
  }

  buttons.forEach(function(button) {
    button.addEventListener('click', function() {
      appendValue(button.dataset.num);
    });
  });

  equal.addEventListener('click', calculate);
  clear.addEventListener('click', clearScreen);
  backspace.addEventListener('click', deleteLastCharacter);

  screen.addEventListener('input', function() {
    resultDisplayed = false;
    errorDisplayed = false;
  });

  document.addEventListener('keydown', function(event) {
    const screenIsFocused = event.target === screen;

    if (event.key === 'Enter' || event.key === '=') {
      event.preventDefault();
      calculate();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      clearScreen();
    } else if (event.key.toLowerCase() === 'c') {
      event.preventDefault();
      clearScreen();
    } else if (event.key === 'Backspace' && !screenIsFocused) {
      event.preventDefault();
      deleteLastCharacter();
    } else if (!screenIsFocused && /^[0-9.+\-*/]$/.test(event.key)) {
      event.preventDefault();
      appendValue(event.key);
    }
  });
})();
