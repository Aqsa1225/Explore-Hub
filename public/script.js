// LOGIN
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();

  try {
    const res = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include'
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('userId', data.userId);
      alert('✅ Login successful!');
      window.location.href = '/home.html';
    } else {
      document.getElementById('loginError').textContent = data.error;
    }
  } catch (err) {
    document.getElementById('loginError').textContent = '❌ Something went wrong.';
  }
});

// SIGNUP
document.getElementById('signupForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value.trim();

  try {
    const res = await fetch('/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
      credentials: 'include'
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('userId', data.userId);
      alert('✅ Signup successful!');
      window.location.href = '/home.html';
    } else {
      document.getElementById('signupError').textContent = data.error;
    }
  } catch (err) {
    document.getElementById('signupError').textContent = '❌ Something went wrong.';
  }
});

// TOGGLE login/signup
document.getElementById('showSignup').addEventListener('click', () => {
  document.getElementById('loginBox').classList.add('hidden');
  document.getElementById('signupBox').classList.remove('hidden');
});

document.getElementById('showLogin').addEventListener('click', () => {
  document.getElementById('signupBox').classList.add('hidden');
  document.getElementById('loginBox').classList.remove('hidden');
});
