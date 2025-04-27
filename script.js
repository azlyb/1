// ======================
// TAB SWITCHING
// ======================
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

// ======================
// DARK MODE
// ======================
const darkModeToggle = document.getElementById('darkModeToggle');
darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});

// ======================
// HELPER FUNCTIONS
// ======================

// Capitalize helper
function capitalize(word) {
  if (!word) return '';
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

// Birthday input format (DD/MM/YYYY)
const birthdayInput = document.getElementById('birthday');
birthdayInput.addEventListener('input', (e) => {
  let value = e.target.value.replace(/\D/g, '');
  if (value.length >= 2) value = value.slice(0,2) + '/' + value.slice(2);
  if (value.length >= 5) value = value.slice(0,5) + '/' + value.slice(5,9);
  e.target.value = value.slice(0, 10);
});

// Format Malaysian phone numbers
function formatPhone(phone) {
  phone = phone.replace(/\D/g, '');
  if (phone.startsWith('601')) {
    return '+' + phone;
  } else if (phone.startsWith('1')) {
    return '+60' + phone;
  }
  return phone;
}

// ======================
// SAVE CONTACT (CREATE CONTACT SECTION)
// ======================
document.getElementById('saveButton').addEventListener('click', () => {
  const contact = {
    firstName: capitalize(document.getElementById('firstName').value.trim()),
    lastName: capitalize(document.getElementById('lastName').value.trim()),
    company: capitalize(document.getElementById('company').value.trim()),
    phone1: formatPhone(document.getElementById('phone1').value.trim()),
    phone2: formatPhone(document.getElementById('phone2').value.trim()),
    email: document.getElementById('email').value.trim(),
    address: document.getElementById('address').value.trim(),
    birthday: document.getElementById('birthday').value.trim(),
    category: document.getElementById('category').value,
    photo: ""
  };

  fetch('http://localhost:3000/contacts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(contact)
  })
  .then(response => response.json())
  .then(data => {
    console.log('Success:', data);
    alert('Contact saved successfully!');
    document.getElementById('contactForm').reset();
    loadContacts();
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Failed to save contact.');
  });
});

// ======================
// MANAGE CONTACTS SECTION
// ======================

// Load contacts into Manage Table
function loadContacts() {
  fetch('http://localhost:3000/contacts')
    .then(response => response.json())
    .then(contacts => {
      const tbody = document.querySelector('#contactsTable tbody');
      tbody.innerHTML = '';
      contacts.forEach(contact => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><input type="checkbox" data-id="${contact.id}"></td>
          <td>${contact.firstName} ${contact.lastName}</td>
          <td>${contact.phone1}</td>
          <td>${contact.email}</td>
          <td>${contact.category}</td>
        `;
        tbody.appendChild(tr);
      });
    })
    .catch(error => console.error('Failed to load contacts:', error));
}

// Auto-load when page ready
document.addEventListener('DOMContentLoaded', () => {
  loadContacts();
});

// Handle VCF Upload
document.getElementById('vcfInput').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const text = e.target.result;
      const contacts = parseVCF(text);
      if (contacts.length > 0) {
        contacts.forEach(contact => {
          fetch('http://localhost:3000/contacts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contact)
          });
        });
        alert('VCF contacts uploaded successfully!');
        loadContacts();
      } else {
        alert('No valid contacts found in VCF.');
      }
    };
    reader.readAsText(file);
  }
});

// Parse simple VCF content
function parseVCF(text) {
  const lines = text.split('\n');
  const contacts = [];
  let current = {};
  lines.forEach(line => {
    if (line.startsWith('FN:')) {
      current.firstName = line.replace('FN:', '').split(' ')[0];
      current.lastName = line.replace('FN:', '').split(' ')[1] || '';
    } else if (line.startsWith('TEL:')) {
      current.phone1 = formatPhone(line.replace('TEL:', ''));
    } else if (line.startsWith('EMAIL:')) {
      current.email = line.replace('EMAIL:', '');
    } else if (line.startsWith('END:VCARD')) {
      contacts.push({
        firstName: capitalize(current.firstName),
        lastName: capitalize(current.lastName),
        company: '',
        phone1: current.phone1 || '',
        phone2: '',
        email: current.email || '',
        address: '',
        birthday: '',
        category: 'Friends',
        photo: ''
      });
      current = {};
    }
  });
  return contacts;
}

// Dummy delete selected
document.getElementById('deleteSelected').addEventListener('click', () => {
  const selected = document.querySelectorAll('#contactsTable tbody input[type="checkbox"]:checked');
  selected.forEach(cb => {
    const id = cb.getAttribute('data-id');
    fetch(`http://localhost:3000/contacts/${id}`, {
      method: 'DELETE'
    }).then(() => {
      loadContacts();
    });
  });
  alert('Deleted selected contacts!');
});

// Dummy export
document.getElementById('exportCsv').addEventListener('click', () => {
  alert('Exported as CSV! 🚀 (Coming soon)');
});

document.getElementById('exportVcf').addEventListener('click', () => {
  alert('Exported as VCF! 🚀 (Coming soon)');
});

// Select all checkbox
const selectAll = document.getElementById('selectAll');
selectAll.addEventListener('change', (e) => {
  document.querySelectorAll('#contactsTable tbody input[type="checkbox"]').forEach(cb => {
    cb.checked = e.target.checked;
  });
});
