// ============================
// UI TAB SWITCHING
// ============================
const createTab = document.getElementById('createTab');
const manageTab = document.getElementById('manageTab');
const createContact = document.getElementById('createContact');
const manageContacts = document.getElementById('manageContacts');

createTab.addEventListener('click', () => {
  createTab.classList.add('active');
  manageTab.classList.remove('active');
  createContact.style.display = 'block';
  manageContacts.style.display = 'none';
});

manageTab.addEventListener('click', () => {
  manageTab.classList.add('active');
  createTab.classList.remove('active');
  manageContacts.style.display = 'block';
  createContact.style.display = 'none';
});

// ============================
// DARK MODE
// ============================
const darkModeToggle = document.getElementById('darkModeToggle');
darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});

// ============================
// HELPER FUNCTIONS
// ============================

// Capitalize each word in a string
function capitalizeEachWord(sentence) {
  if (!sentence) return '';
  return sentence
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Format birthday input as DD/MM/YYYY
const birthdayInput = document.getElementById('birthday');
birthdayInput.addEventListener('input', (e) => {
  let value = e.target.value.replace(/\D/g, '');
  if (value.length >= 2) value = value.slice(0,2) + '/' + value.slice(2);
  if (value.length >= 5) value = value.slice(0,5) + '/' + value.slice(5,9);
  e.target.value = value.slice(0, 10);
});

// Format Malaysian phone numbers
function formatPhone(phone) {
  phone = phone.replace(/\D/g, ''); // Remove non-digits
  if (phone.startsWith('601')) {
    return '+' + phone;
  } else if (phone.startsWith('1')) {
    return '+60' + phone;
  }
  return phone;
}

// ============================
// SAVE CONTACT (CREATE CONTACT SECTION)
// ============================
document.getElementById('saveButton').addEventListener('click', () => {
  const contact = {
    firstName: capitalizeEachWord(document.getElementById('firstName').value.trim()),
    lastName: capitalizeEachWord(document.getElementById('lastName').value.trim()),
    company: capitalizeEachWord(document.getElementById('company').value.trim()),
    phone1: document.getElementById('phone1').value.trim().replace(/\D/g, ''),
    phone2: document.getElementById('phone2').value.trim().replace(/\D/g, ''),
    email: document.getElementById('email').value.trim(),
    address: capitalizeEachWord(document.getElementById('address').value.trim()),
    birthday: document.getElementById('birthday').value.trim(),
    category: document.getElementById('category').value,
    photo: "" // photo handling later if needed
  };

  fetch('http://localhost:3000/contacts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(contact)
  })
  .then(response => response.json())
  .then(data => {
    console.log('Success:', data);
    alert('Contact saved successfully!');
    loadContacts();
    document.getElementById('contactForm').reset();
  })
  .catch((error) => {
    console.error('Error:', error);
    alert('Failed to save contact.');
  });
});

// ============================
// MANAGE CONTACTS SECTION
// ============================

// Dummy VCF file upload placeholder
document.getElementById('vcfInput').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    alert('VCF File uploaded: ' + file.name);
    // Later bonus: parse VCF and show contacts
  }
});

// Dummy Delete Selected Contacts
document.getElementById('deleteSelected').addEventListener('click', () => {
  alert('Selected contacts deleted! 🚀 (Placeholder)');
});

// Dummy Export CSV
document.getElementById('exportCsv').addEventListener('click', () => {
  alert('Exported as CSV! 🚀 (Placeholder)');
});

// Dummy Export VCF
document.getElementById('exportVcf').addEventListener('click', () => {
  alert('Exported as VCF! 🚀 (Placeholder)');
});

// Select All checkbox
const selectAll = document.getElementById('selectAll');
selectAll.addEventListener('change', (e) => {
  document.querySelectorAll('#contactsTable tbody input[type="checkbox"]').forEach(cb => {
    cb.checked = e.target.checked;
  });
});

// ============================
// LOAD CONTACTS FUNCTION (OPTIONAL CALL)
// ============================
function loadContacts() {
  fetch('http://localhost:3000/contacts')
    .then(response => response.json())
    .then(data => {
      const tbody = document.querySelector('#contactsTable tbody');
      tbody.innerHTML = '';

      data.forEach((contact, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td><input type="checkbox" data-index="${index}"></td>
          <td>${contact.firstName}</td>
          <td>${contact.lastName}</td>
          <td>${contact.phone1}</td>
          <td>${contact.phone2}</td>
          <td>${contact.email}</td>
          <td>${contact.address}</td>
          <td>${contact.birthday}</td>
          <td>${contact.category}</td>
        `;
        tbody.appendChild(row);
      });
    })
    .catch(error => console.error('Error loading contacts:', error));
}
