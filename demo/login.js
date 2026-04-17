const form = document.getElementById('loginForm');
const messageBox = document.getElementById('loginMessage');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!email || !password) {
    showMessage('Please enter both email and password.', 'error');
    return;
  }

  // Demo-first behavior:
  // Replace this block with a real call to POST /api/auth/login when backend is ready.
  // Example:
  // await fetch('/api/auth/login', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ email, password }) })

  if (email === 'demo@aiartgallery.app' && password === 'Password123!') {
    localStorage.setItem('ai_art_gallery_user', JSON.stringify({
      email,
      token: 'demo-jwt-token'
    }));
    showMessage('Login successful. Redirecting...', 'success');

    setTimeout(() => {
      window.location.href = 'gallery.html';
    }, 700);
    return;
  }

  showMessage('Invalid credentials. Use demo@aiartgallery.app / Password123! for the demo account, or connect this page to your real backend login API.', 'error');
});

function showMessage(text, type) {
  messageBox.textContent = text;
  messageBox.className = `message-box ${type}`;
}
