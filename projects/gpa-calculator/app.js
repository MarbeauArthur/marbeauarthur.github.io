(() => {
  const gradePoints = { A: 4, 'B+': 3.5, B: 3, 'C+': 2.5, C: 2, D: 1, F: 0 };
  const list = document.querySelector('#course-list');
  const output = document.querySelector('#gpa-output');
  const message = document.querySelector('#result-message');
  const status = document.querySelector('#calculator-heading');
  const defaults = ['Programming', 'Calculus', 'Computer Systems', 'Communication Skills', 'Elective'];

  const gradeOptions = Object.keys(gradePoints).map((grade) => `<option value="${grade}">${grade}</option>`).join('');

  const calculate = () => {
    const rows = [...list.querySelectorAll('.course-row')];
    let credits = 0;
    let weighted = 0;
    rows.forEach((row) => {
      const credit = Number(row.querySelector('.course-credit').value);
      const grade = row.querySelector('.course-grade').value;
      if (credit > 0 && grade in gradePoints) {
        credits += credit;
        weighted += credit * gradePoints[grade];
      }
    });
    const gpa = credits ? weighted / credits : 0;
    output.value = gpa.toFixed(2);
    output.textContent = gpa.toFixed(2);
    message.textContent = credits ? `${credits} credit hour${credits === 1 ? '' : 's'} included.` : 'Enter your courses to see the weighted result.';
  };

  const addRow = (name = '', credit = 3, grade = 'A') => {
    const row = document.createElement('div');
    row.className = 'course-row';
    row.innerHTML = `<input class="course-name" type="text" value="${name}" aria-label="Course name" placeholder="Course name" /><input class="course-credit" type="number" value="${credit}" min="0" max="12" step="1" aria-label="Credit hours" /><select class="course-grade" aria-label="Grade">${gradeOptions}</select><button class="remove-course" type="button" aria-label="Remove course">×</button>`;
    row.querySelector('.course-grade').value = grade;
    row.addEventListener('input', calculate);
    row.querySelector('.remove-course').addEventListener('click', () => {
      row.remove();
      status.textContent = 'Course removed.';
      calculate();
    });
    list.append(row);
    calculate();
  };

  const reset = () => {
    list.replaceChildren();
    defaults.forEach((name) => addRow(name));
    status.textContent = 'Calculator reset to five starter rows.';
  };

  document.querySelector('#add-course').addEventListener('click', () => {
    addRow('', 3, 'A');
    list.lastElementChild.querySelector('.course-name').focus();
    status.textContent = 'New course added.';
  });
  document.querySelector('#reset').addEventListener('click', reset);
  reset();
})();
