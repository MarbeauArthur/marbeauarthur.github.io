(() => {
  const storageKey = 'marian-study-planner-tasks';
  const form = document.querySelector('#task-form');
  const list = document.querySelector('#task-list');
  const status = document.querySelector('#planner-heading');
  let filter = 'all';
  let tasks = [];

  try { tasks = JSON.parse(localStorage.getItem(storageKey)) || []; } catch (_) { tasks = []; }

  const save = () => {
    try { localStorage.setItem(storageKey, JSON.stringify(tasks)); } catch (_) {}
  };

  const formatDate = (date) => new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${date}T12:00:00`));

  const render = () => {
    const visible = tasks.filter((task) => filter === 'all' || (filter === 'done' ? task.done : !task.done));
    list.replaceChildren();
    if (!visible.length) {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.innerHTML = '<strong>Nothing here yet.</strong>Add a task or choose another filter.';
      list.append(empty);
    }
    visible.sort((a, b) => a.date.localeCompare(b.date)).forEach((task) => {
      const row = document.createElement('article');
      row.className = `task${task.done ? ' completed' : ''}`;
      row.innerHTML = `<input class="task-check" type="checkbox" ${task.done ? 'checked' : ''} aria-label="Mark ${task.title} complete" /><div><h2 class="task-title"></h2><div class="task-meta"><span class="task-subject"></span><span class="task-date"></span><span class="priority ${task.priority.toLowerCase()}"></span></div></div><button class="delete-task" type="button" aria-label="Delete ${task.title}">×</button>`;
      row.querySelector('.task-title').textContent = task.title;
      row.querySelector('.task-subject').textContent = task.subject;
      row.querySelector('.task-date').textContent = formatDate(task.date);
      row.querySelector('.priority').textContent = task.priority;
      row.querySelector('.task-check').addEventListener('change', (event) => {
        task.done = event.target.checked;
        save();
        status.textContent = task.done ? `${task.title} completed.` : `${task.title} returned to your list.`;
        render();
      });
      row.querySelector('.delete-task').addEventListener('click', () => {
        tasks = tasks.filter((item) => item.id !== task.id);
        save();
        status.textContent = `${task.title} deleted.`;
        render();
      });
      list.append(row);
    });
    const done = tasks.filter((task) => task.done).length;
    document.querySelector('#total-count').textContent = tasks.length;
    document.querySelector('#open-count').textContent = tasks.length - done;
    document.querySelector('#done-count').textContent = done;
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const title = document.querySelector('#task-title').value.trim();
    const subject = document.querySelector('#task-subject').value.trim();
    const date = document.querySelector('#task-date').value;
    const priority = document.querySelector('#task-priority').value;
    if (!title || !subject || !date) return;
    tasks.push({ id: Date.now(), title, subject, date, priority, done: false });
    save();
    form.reset();
    document.querySelector('#task-priority').value = 'Medium';
    status.textContent = `${title} added to your plan.`;
    render();
  });

  document.querySelectorAll('.filter').forEach((button) => button.addEventListener('click', () => {
    filter = button.dataset.filter;
    document.querySelectorAll('.filter').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    render();
  }));

  document.querySelector('#clear-completed').addEventListener('click', () => {
    const removed = tasks.filter((task) => task.done).length;
    tasks = tasks.filter((task) => !task.done);
    save();
    status.textContent = removed ? `${removed} completed task${removed === 1 ? '' : 's'} cleared.` : 'There are no completed tasks to clear.';
    render();
  });

  document.querySelector('#task-date').min = new Date().toISOString().slice(0, 10);
  render();
})();
