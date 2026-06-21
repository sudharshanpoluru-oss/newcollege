document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('grievanceForm');
  var success = document.getElementById('grievanceSuccess');

  if (!form) return;

  var fields = {
    studentName: { el: document.getElementById('studentName'), error: document.getElementById('studentNameError') },
    rollNumber: { el: document.getElementById('rollNumber'), error: document.getElementById('rollNumberError') },
    email: { el: document.getElementById('email'), error: document.getElementById('emailError') },
    mobile: { el: document.getElementById('mobile'), error: document.getElementById('mobileError') },
    category: { el: document.getElementById('category'), error: document.getElementById('categoryError') },
    subject: { el: document.getElementById('subject'), error: document.getElementById('subjectError') },
    description: { el: document.getElementById('description'), error: document.getElementById('descriptionError') }
  };

  function setError(field, message) {
    field.el.classList.add('error');
    field.error.textContent = message;
  }

  function clearError(field) {
    field.el.classList.remove('error');
    field.error.textContent = '';
  }

  function clearAllErrors() {
    Object.keys(fields).forEach(function (key) {
      clearError(fields[key]);
    });
  }

  function validate() {
    var valid = true;

    clearAllErrors();

    if (!fields.studentName.el.value.trim()) {
      setError(fields.studentName, 'Student name is required.');
      valid = false;
    }

    if (!fields.rollNumber.el.value.trim()) {
      setError(fields.rollNumber, 'Roll number is required.');
      valid = false;
    }

    var emailVal = fields.email.el.value.trim();
    if (!emailVal) {
      setError(fields.email, 'Email is required.');
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
      setError(fields.email, 'Please enter a valid email address.');
      valid = false;
    }

    var mobileVal = fields.mobile.el.value.trim();
    if (mobileVal && !/^[0-9]{10}$/.test(mobileVal.replace(/[\s\-()]/g, ''))) {
      setError(fields.mobile, 'Please enter a valid 10-digit mobile number.');
      valid = false;
    }

    if (!fields.category.el.value) {
      setError(fields.category, 'Please select a grievance category.');
      valid = false;
    }

    if (!fields.subject.el.value.trim()) {
      setError(fields.subject, 'Subject is required.');
      valid = false;
    }

    if (!fields.description.el.value.trim()) {
      setError(fields.description, 'Description is required.');
      valid = false;
    }

    return valid;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!validate()) return;

    form.hidden = true;
    success.hidden = false;
  });

  document.getElementById('resetFormBtn').addEventListener('click', function () {
    form.reset();
    clearAllErrors();
    form.hidden = false;
    success.hidden = true;
  });

  Object.keys(fields).forEach(function (key) {
    var field = fields[key];
    if (field.el) {
      field.el.addEventListener('input', function () {
        if (field.el.classList.contains('error')) {
          clearError(field);
        }
      });
      field.el.addEventListener('change', function () {
        if (field.el.classList.contains('error')) {
          clearError(field);
        }
      });
    }
  });

  if (document.getElementById('grievanceDate')) {
    var today = new Date().toISOString().split('T')[0];
    document.getElementById('grievanceDate').value = today;
  }
});
