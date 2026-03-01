// Simple calculator logic
(() => {
  const previousEl = document.getElementById('previous');
  const currentEl = document.getElementById('current');
  let current = '0';
  let previous = '';
  let operation = null;
  let overwrite = false;

  function updateDisplay() {
    currentEl.textContent = current;
    previousEl.textContent = operation ? `${previous} ${operation}` : '';
  }

  function appendNumber(num) {
    if (overwrite) {
      current = num === '.' ? '0.' : num;
      overwrite = false;
      return;
    }
    if (num === '.' && current.includes('.')) return;
    if (current === '0' && num !== '.') current = num;
    else current = current + num;
  }

  function chooseOperation(op) {
    if (current === '') return;
    if (previous !== '') {
      compute();
    } else {
      previous = current;
    }
    operation = op;
    overwrite = true;
  }

  function compute() {
    const prev = parseFloat(previous);
    const curr = parseFloat(current);
    if (isNaN(prev) || isNaN(curr)) return;
    let result = 0;
    switch (operation) {
      case '+': result = prev + curr; break;
      case '-': result = prev - curr; break;
      case '*': result = prev * curr; break;
      case '/': result = curr === 0 ? 'Error' : prev / curr; break;
      default: return;
    }
    current = typeof result === 'number' ? formatNumber(result) : result;
    operation = null;
    previous = '';
    overwrite = true;
  }

  function formatNumber(num) {
    // Limit to 12 significant digits to keep display tidy
    const str = String(num);
    if (str.length <= 12) return str;
    // Use toPrecision for large/decimal numbers
    return Number(num).toPrecision(12).replace(/\.?0+$/,'');
  }

  function clearAll() {
    current = '0';
    previous = '';
    operation = null;
    overwrite = false;
  }

  function deleteDigit() {
    if (overwrite) {
      current = '0';
      overwrite = false;
      return;
    }
    if (current.length === 1) current = '0';
    else current = current.slice(0, -1);
  }

  function percent() {
    const curr = parseFloat(current);
    if (isNaN(curr)) return;
    current = formatNumber(curr / 100);
    overwrite = true;
  }

  // button handling
  document.querySelectorAll('.btn.number').forEach(btn => {
    btn.addEventListener('click', () => {
      appendNumber(btn.dataset.number);
      updateDisplay();
    });
  });

  document.querySelectorAll('.btn.operator').forEach(btn => {
    btn.addEventListener('click', () => {
      chooseOperation(btn.dataset.action);
      updateDisplay();
    });
  });

  document.querySelector('.btn.equals').addEventListener('click', () => {
    compute();
    updateDisplay();
  });

  document.querySelector('.btn[data-action="clear"]').addEventListener('click', () => {
    clearAll();
    updateDisplay();
  });

  document.querySelector('.btn[data-action="delete"]').addEventListener('click', () => {
    deleteDigit();
    updateDisplay();
  });

  document.querySelector('.btn[data-action="percent"]').addEventListener('click', () => {
    percent();
    updateDisplay();
  });

  // keyboard support
  window.addEventListener('keydown', (e) => {
    if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
      appendNumber(e.key);
      updateDisplay();
      return;
    }

    if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
      chooseOperation(e.key);
      updateDisplay();
      return;
    }

    if (e.key === 'Enter' || e.key === '=') {
      e.preventDefault();
      compute();
      updateDisplay();
      return;
    }

    if (e.key === 'Backspace') {
      deleteDigit();
      updateDisplay();
      return;
    }

    if (e.key.toLowerCase() === 'c') { // clear with 'c'
      clearAll();
      updateDisplay();
      return;
    }

    if (e.key === '%') {
      percent();
      updateDisplay();
      return;
    }
  });

  // initialize
  updateDisplay();
})();