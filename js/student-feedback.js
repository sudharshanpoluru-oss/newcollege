document.addEventListener('DOMContentLoaded', function () {
  var emailInput = document.getElementById('studentEmail');
  var emailError = document.getElementById('emailFeedbackError');
  var addBtn = document.getElementById('addSubjectBtn');
  var tbody = document.getElementById('feedbackBody');
  var empty = document.getElementById('feedbackEmpty');
  var submitBtn = document.getElementById('submitFeedbackBtn');
  var success = document.getElementById('feedbackSuccess');
  var resetBtn = document.getElementById('resetFeedbackBtn');

  var ratingOptions = [
    { value: '', label: 'Select' },
    { value: '1', label: '1 - Poor' },
    { value: '2', label: '2 - Fair' },
    { value: '3', label: '3 - Good' },
    { value: '4', label: '4 - Very Good' },
    { value: '5', label: '5 - Excellent' }
  ];

  var ratingFields = [
    'Punctuality',
    'Regularity',
    'Discipline',
    'Preparation',
    'Visual Aids',
    'Effectiveness',
    'Syllabus Coverage',
    'Completion',
    'Mid Papers Evaluation',
    'Overall Feedback'
  ];

  function createRatingSelect() {
    var sel = document.createElement('select');
    sel.className = 'rating-select';
    ratingOptions.forEach(function (opt) {
      var o = document.createElement('option');
      o.value = opt.value;
      o.textContent = opt.label;
      sel.appendChild(o);
    });
    return sel;
  }

  function toggleEmpty() {
    var hasRows = tbody.querySelectorAll('tr').length > 0;
    empty.hidden = hasRows;
  }

  function addRow() {
    var tr = document.createElement('tr');

    var tdSubject = document.createElement('td');
    var inputSubject = document.createElement('input');
    inputSubject.type = 'text';
    inputSubject.placeholder = 'Subject name';
    inputSubject.required = true;
    tdSubject.appendChild(inputSubject);

    var tdFaculty = document.createElement('td');
    var inputFaculty = document.createElement('input');
    inputFaculty.type = 'text';
    inputFaculty.placeholder = 'Faculty name';
    inputFaculty.required = true;
    tdFaculty.appendChild(inputFaculty);

    var ratingCells = [];
    ratingFields.forEach(function () {
      var td = document.createElement('td');
      var sel = createRatingSelect();
      td.appendChild(sel);
      ratingCells.push(sel);
      tr.appendChild(td);
    });

    var tdRemarks = document.createElement('td');
    var inputRemarks = document.createElement('input');
    inputRemarks.type = 'text';
    inputRemarks.placeholder = 'Remarks...';
    tdRemarks.appendChild(inputRemarks);

    var tdDelete = document.createElement('td');
    var delBtn = document.createElement('button');
    delBtn.type = 'button';
    delBtn.className = 'delete-btn';
    delBtn.setAttribute('aria-label', 'Delete row');
    delBtn.innerHTML = '<span class="material-symbols-outlined" style="font-size:18px;">delete</span>';
    delBtn.addEventListener('click', function () {
      tr.remove();
      toggleEmpty();
    });
    tdDelete.appendChild(delBtn);

    tr.appendChild(tdSubject);
    tr.appendChild(tdFaculty);
    tr.appendChild(tdRemarks);
    tr.appendChild(tdDelete);

    tbody.appendChild(tr);
    toggleEmpty();
  }

  addBtn.addEventListener('click', addRow);

  function validateEmail() {
    var val = emailInput.value.trim();
    if (!val) {
      emailInput.classList.add('error');
      emailError.textContent = 'Email is required.';
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      emailInput.classList.add('error');
      emailError.textContent = 'Enter a valid email address.';
      return false;
    }
    emailInput.classList.remove('error');
    emailError.textContent = '';
    return true;
  }

  emailInput.addEventListener('input', function () {
    if (emailInput.classList.contains('error')) {
      validateEmail();
    }
  });

  function validateRows() {
    var rows = tbody.querySelectorAll('tr');
    var allValid = true;

    rows.forEach(function (row) {
      var inputs = row.querySelectorAll('input, select');
      inputs.forEach(function (inp) {
        if (inp.hasAttribute('required') || inp.tagName === 'SELECT') {
          if (!inp.value || inp.value === '') {
            inp.classList.add('error');
            allValid = false;
          } else {
            inp.classList.remove('error');
          }
        }
      });
    });

    return allValid && rows.length > 0;
  }

  submitBtn.addEventListener('click', function () {
    var emailValid = validateEmail();
    var rowsValid = validateRows();

    if (!emailValid) {
      emailInput.focus();
      return;
    }

    if (!rowsValid) {
      return;
    }

    success.hidden = false;
    document.body.style.overflow = 'hidden';
  });

  resetBtn.addEventListener('click', function () {
    emailInput.value = '';
    emailInput.classList.remove('error');
    emailError.textContent = '';
    tbody.innerHTML = '';
    toggleEmpty();
    success.hidden = true;
    document.body.style.overflow = '';
  });

  success.addEventListener('click', function (e) {
    if (e.target === success) {
      resetBtn.click();
    }
  });

  addRow();
});
