document.addEventListener('DOMContentLoaded', async () => {
  const table = document.getElementById('userTableBody');
  const addForm = document.getElementById('addUserForm');
  const editForm = document.getElementById('editUserForm');

  // ✅ Load users into table
  if (table) {
    try {
      const users = await fetch('/users').then(res => res.json());

      users.forEach(user => {
        if (!user._id) {
          console.warn('Skipping user without _id:', user);
          return;
        }

        console.log("Edit Link:", `edit-user.html?id=${user._id}`); // ✅ Debug

        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${user.name || 'N/A'}</td>
          <td>${user.email}</td>
          <td>
            <a href="edit-user.html?id=${encodeURIComponent(user._id)}">Edit</a>
            <button onclick="deleteUser('${user._id}')">Delete</button>
          </td>
        `;
        table.appendChild(row);
      });
    } catch (err) {
      console.error('❌ Failed to load users:', err);
      alert('Error loading users.');
    }
  }

  // ✅ Add User
  if (addForm) {
    addForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value.trim();

      try {
        const res = await fetch('/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        });

        const data = await res.json();

        if (res.ok) {
          alert('✅ User added successfully!');
          window.location.href = 'index.html';
        } else {
          alert(data.error || '⚠️ Failed to add user.');
        }
      } catch (err) {
        alert('❌ Server error. Try again later.');
      }
    });
  }

  // ✅ Edit User
  if (editForm) {
    const params = new URLSearchParams(window.location.search);
    const id = decodeURIComponent(params.get('id'));

    if (!id || id === 'undefined') {
      alert('❌ No valid user ID provided.');
      return;
    }

    try {
      const res = await fetch(`/users/${id}`);
      const user = await res.json();

      if (!user || user.error) {
        alert('❌ Failed to load user data.');
        return;
      }

      document.getElementById('userId').value = user._id;
      document.getElementById('name').value = user.name || '';
      document.getElementById('email').value = user.email;
    } catch (err) {
      alert('❌ Failed to fetch user details.');
    }

    editForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value.trim();

      try {
        const res = await fetch(`/users/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        });

        const data = await res.json();

        if (res.ok) {
          alert('✅ User updated successfully!');
          window.location.href = 'index.html';
        } else {
          alert(data.error || '⚠️ Failed to update user.');
        }
      } catch (err) {
        alert('❌ Server error.');
      }
    });
  }
});

// ✅ Delete User
async function deleteUser(id) {
  if (confirm('Delete this user?')) {
    try {
      const res = await fetch(`/users/${id}`, { method: 'DELETE' });
      const data = await res.json();

      if (res.ok) {
        alert('🗑️ User deleted successfully!');
        window.location.reload();
      } else {
        alert(data.error || '⚠️ Failed to delete user.');
      }
    } catch (err) {
      alert('❌ Server error.');
    }
  }
}
