// =====================
// LOGIN FORM SUBMISSION
// =====================
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();  // Get login email and password values
  const password = document.getElementById('loginPassword').value.trim();
  // Send login data to backend
  try {
    const res = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include'
    });

    const data = await res.json(); // Convert response to JSON
     // If login is successful
    if (res.ok) {
      localStorage.setItem('userId', data.userId);  // Store user ID locally
      alert('✅ Login successful!');
      window.location.href = '/home.html'; // Redirect to homepage
    } else {
      document.getElementById('loginError').textContent = data.error; // Show error message from backend
    }
  } catch (err) {
    document.getElementById('loginError').textContent = '❌ Something went wrong.';  // Handle unexpected errors
  }
});

// =======================
// SIGNUP FORM SUBMISSION
// =======================
document.getElementById('signupForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  // Get signup input values
  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value.trim();

  try {
    // Send signup data to backend
    const res = await fetch('/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
      credentials: 'include'
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('userId', data.userId); // Signup success
      alert('✅ Signup successful!');
      window.location.href = '/home.html'; // Go to homepage
    } else {
      document.getElementById('signupError').textContent = data.error;
    }
  } catch (err) {
    document.getElementById('signupError').textContent = '❌ Something went wrong.';   // Catch and display unexpected error
  }
});

// ===================
// TOGGLE LOGIN / SIGNUP
// ===================
// Show signup form, hide login form
document.getElementById('showSignup').addEventListener('click', () => {
  document.getElementById('loginBox').classList.add('hidden');
  document.getElementById('signupBox').classList.remove('hidden');
});

// Show login form, hide signup form
document.getElementById('showLogin').addEventListener('click', () => {
  document.getElementById('signupBox').classList.add('hidden');
  document.getElementById('loginBox').classList.remove('hidden');
});
