(() => {
  const stage = document.querySelector('#stage');
  const sizeInput = document.querySelector('#size');
  const speedInput = document.querySelector('#speed');
  const runButton = document.querySelector('#run');
  const shuffleButton = document.querySelector('#shuffle');
  const algorithmInput = document.querySelector('#algorithm');
  const status = document.querySelector('#visualizer-status');
  let values = [];
  let running = false;
  let comparisons = 0;
  let moves = 0;
  let startedAt = 0;

  const delay = () => 230 - Number(speedInput.value) * 40;
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const updateMetrics = () => {
    document.querySelector('#comparisons').textContent = comparisons;
    document.querySelector('#swaps').textContent = moves;
    document.querySelector('#elapsed').textContent = startedAt ? `${((performance.now() - startedAt) / 1000).toFixed(1)}s` : '0.0s';
  };

  const render = (active = [], sortedFrom = values.length) => {
    stage.replaceChildren();
    values.forEach((value, index) => {
      const bar = document.createElement('span');
      bar.className = `bar${active.includes(index) ? ' active' : ''}${index >= sortedFrom ? ' sorted' : ''}`;
      bar.style.setProperty('--value', value);
      bar.title = String(value);
      stage.append(bar);
    });
    stage.setAttribute('aria-label', `Array values: ${values.join(', ')}`);
    updateMetrics();
  };

  const randomize = () => {
    const size = Number(sizeInput.value);
    values = Array.from({ length: size }, () => Math.floor(Math.random() * 86) + 14);
    comparisons = 0;
    moves = 0;
    startedAt = 0;
    render();
    status.textContent = 'New array ready to sort.';
  };

  const compare = async (indexes, sortedFrom = values.length) => {
    comparisons += 1;
    render(indexes, sortedFrom);
    await sleep(delay());
  };

  const bubbleSort = async () => {
    for (let end = values.length - 1; end > 0; end -= 1) {
      let changed = false;
      for (let index = 0; index < end; index += 1) {
        await compare([index, index + 1], end + 1);
        if (values[index] > values[index + 1]) {
          [values[index], values[index + 1]] = [values[index + 1], values[index]];
          moves += 1;
          changed = true;
        }
      }
      if (!changed) break;
    }
  };

  const selectionSort = async () => {
    for (let start = 0; start < values.length - 1; start += 1) {
      let minimum = start;
      for (let index = start + 1; index < values.length; index += 1) {
        await compare([minimum, index]);
        if (values[index] < values[minimum]) minimum = index;
      }
      if (minimum !== start) {
        [values[start], values[minimum]] = [values[minimum], values[start]];
        moves += 1;
      }
    }
  };

  const insertionSort = async () => {
    for (let index = 1; index < values.length; index += 1) {
      const current = values[index];
      let cursor = index - 1;
      while (cursor >= 0) {
        await compare([cursor, cursor + 1]);
        if (values[cursor] <= current) break;
        values[cursor + 1] = values[cursor];
        moves += 1;
        cursor -= 1;
      }
      values[cursor + 1] = current;
    }
  };

  const run = async () => {
    if (running) return;
    running = true;
    runButton.disabled = true;
    shuffleButton.disabled = true;
    sizeInput.disabled = true;
    algorithmInput.disabled = true;
    comparisons = 0;
    moves = 0;
    startedAt = performance.now();
    status.textContent = `${algorithmInput.options[algorithmInput.selectedIndex].text} is running…`;
    const algorithms = { bubble: bubbleSort, selection: selectionSort, insertion: insertionSort };
    await algorithms[algorithmInput.value]();
    render([], 0);
    status.textContent = `Sorted ${values.length} values with ${comparisons} comparisons and ${moves} moves.`;
    running = false;
    runButton.disabled = false;
    shuffleButton.disabled = false;
    sizeInput.disabled = false;
    algorithmInput.disabled = false;
  };

  sizeInput.addEventListener('input', () => {
    document.querySelector('#size-output').value = sizeInput.value;
    document.querySelector('#size-output').textContent = sizeInput.value;
    randomize();
  });
  shuffleButton.addEventListener('click', randomize);
  runButton.addEventListener('click', run);
  randomize();
})();
