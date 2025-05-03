/**
 * Frontend JavaScript for handling user authentication
 * For Yuhi Travel website
 */

// Cấu hình API
const API_URL = 'http://localhost:3000/api/v1/auth';

// Các thông báo
const messages = {
  loginSuccess: 'Đăng nhập thành công!',
  loginError: 'Đăng nhập thất bại',
  registerSuccess: 'Đăng ký tài khoản thành công!',
  registerError: 'Đăng ký thất bại',
  invalidEmail: 'Vui lòng nhập email hợp lệ',
  invalidPassword: 'Mật khẩu phải có ít nhất 6 ký tự',
  networkError: 'Lỗi kết nối, vui lòng thử lại sau',
  googleLoginError: 'Đăng nhập bằng Google thất bại',
  invalidName: 'Vui lòng nhập họ tên của bạn',
  tokenExpired: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại',
  serverError: 'Có lỗi xảy ra, vui lòng thử lại sau'
};

// DOM Elements
const signInBtn = document.getElementById('sign-in-btn');
const loginModal = document.getElementById('login-modal');
const closeModal = document.getElementById('close-modal');
const emailInput = document.getElementById('email');
const emailValidation = document.getElementById('email-validation');
const continueBtn = document.getElementById('continue-btn');
const googleBtn = document.getElementById('google-btn');

let passwordContainer = null;
let passwordInput = null;

// Token management
const saveToken = (token) => {
  localStorage.setItem('yuhi_auth_token', token);
};

const getToken = () => {
  return localStorage.getItem('yuhi_auth_token');
};

const removeToken = () => {
  localStorage.removeItem('yuhi_auth_token');
};

// Show login modal
const showLoginModal = () => {
  resetModalToEmailStep();
  loginModal.style.display = 'flex';
};

// Close modal
const closeLoginModal = () => {
  loginModal.style.display = 'none';
  resetModalToEmailStep();
};

// Reset modal to email step
const resetModalToEmailStep = () => {
  const modalContent = document.querySelector('.modal__content');
  
  if (passwordContainer) {
    modalContent.removeChild(passwordContainer);
    passwordInput = null;
    passwordContainer = null;
  }
  
  const modalTitle = modalContent.querySelector('h1');
  const modalDescription = modalContent.querySelector('p');
  
  modalTitle.textContent = 'Đăng nhập hoặc tạo tài khoản';
  modalDescription.textContent = 'Đăng nhập để sử dụng các dịch vụ của Yuhi Travel và nhận được nhiều ưu đãi hấp dẫn.';
  
  continueBtn.textContent = 'Tiếp tục với email';
  emailInput.value = '';
  emailValidation.style.display = 'none';
  
  document.querySelector('.separator').style.display = 'block';
  document.querySelector('.social-login').style.display = 'block';
};

// Show password step
const showPasswordStep = (email) => {
  const modalTitle = document.querySelector('.modal__content h1');
  const modalDescription = document.querySelector('.modal__content p');
  
  modalTitle.textContent = 'Đăng nhập vào Yuhi Travel';
  modalDescription.textContent = `Sử dụng mật khẩu để đăng nhập vào tài khoản ${email}`;
  
  document.querySelector('.separator').style.display = 'none';
  document.querySelector('.social-login').style.display = 'none';
  
  passwordContainer = document.createElement('div');
  passwordContainer.className = 'form-group';
  passwordContainer.innerHTML = `
    <label for="password">Mật khẩu</label>
    <input type="password" id="password" placeholder="Nhập mật khẩu của bạn">
    <div id="password-validation" class="validation-message" style="display: none;">
      Mật khẩu không đúng
    </div>
  `;
  
  const emailContainer = emailInput.parentElement;
  emailContainer.parentNode.insertBefore(passwordContainer, emailContainer.nextSibling);
  
  passwordInput = document.getElementById('password');
  continueBtn.textContent = 'Đăng nhập';
};

// Email validation
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Handle continue button click
const handleContinue = async () => {
  const email = emailInput.value.trim();
  
  if (!isValidEmail(email)) {
    emailValidation.style.display = 'block';
    return;
  }

  if (!passwordInput) {
    try {
      const response = await fetch(`${API_URL}/check-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        showPasswordStep(email);
      } else {
        showRegistrationOption(email);
      }
    } catch (error) {
      console.error('Lỗi kiểm tra email:', error);
      alert('Có lỗi xảy ra, vui lòng thử lại sau');
    }
  } else {
    const password = passwordInput.value;
    if (!password) {
      document.getElementById('password-validation').style.display = 'block';
      return;
    }

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        saveToken(data.token);
        closeLoginModal();
        updateAuthUI();
        showLoginSuccess();
      } else {
        document.getElementById('password-validation').textContent = data.message;
        document.getElementById('password-validation').style.display = 'block';
      }
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      alert('Có lỗi xảy ra, vui lòng thử lại sau');
    }
  }
};

// Show registration option
const showRegistrationOption = (email) => {
  const modalTitle = document.querySelector('.modal__content h1');
  const modalDescription = document.querySelector('.modal__content p');
  
  modalTitle.textContent = 'Tạo tài khoản mới';
  modalDescription.textContent = `Email ${email} chưa được đăng ký. Vui lòng tạo tài khoản mới.`;
  
  document.querySelector('.separator').style.display = 'none';
  document.querySelector('.social-login').style.display = 'none';
  
  const nameContainer = document.createElement('div');
  nameContainer.className = 'form-group';
  nameContainer.innerHTML = `
    <label for="fullName">Họ và tên</label>
    <input type="text" id="fullName" placeholder="Nhập họ và tên của bạn">
  `;
  
  passwordContainer = document.createElement('div');
  passwordContainer.className = 'form-group';
  passwordContainer.innerHTML = `
    <label for="password">Mật khẩu</label>
    <input type="password" id="password" placeholder="Tạo mật khẩu (ít nhất 6 ký tự)">
    <div id="password-validation" class="validation-message" style="display: none;">
      Mật khẩu phải có ít nhất 6 ký tự
    </div>
  `;
  
  const emailContainer = emailInput.parentElement;
  emailContainer.parentNode.insertBefore(nameContainer, emailContainer.nextSibling);
  emailContainer.parentNode.insertBefore(passwordContainer, nameContainer.nextSibling);
  
  passwordInput = document.getElementById('password');
  continueBtn.textContent = 'Đăng ký';
  continueBtn.onclick = handleRegister;
};

// Handle registration
const handleRegister = async () => {
  const email = emailInput.value.trim();
  const fullName = document.getElementById('fullName').value.trim();
  const password = passwordInput.value;
  
  if (!fullName) {
    alert(messages.invalidName);
    return;
  }
  
  if (password.length < 6) {
    document.getElementById('password-validation').style.display = 'block';
    return;
  }
  
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, fullName, password })
    });

    const data = await response.json();

    if (response.ok) {
      saveToken(data.token);
      closeLoginModal();
      updateAuthUI();
      showRegistrationSuccess();
    } else {
      alert(data.message || messages.registerError);
    }
  } catch (error) {
    console.error('Lỗi đăng ký:', error);
    alert(messages.networkError);
  }
};

// Update UI based on auth state
const updateAuthUI = () => {
  const token = getToken();
  const navbarList = document.querySelector('.header__navbar-list');
  
  if (token) {
    navbarList.innerHTML = `
      <li class="header__navbar-item header__navbar-item--btn">ĐẶT PHÒNG</li>
      <li class="header__navbar-item header__navbar-item--btn" id="profile-btn">TÀI KHOẢN</li>
      <li class="header__navbar-item header__navbar-item--btn" id="logout-btn">ĐĂNG XUẤT</li>
    `;
    
    document.getElementById('logout-btn').addEventListener('click', logout);
    document.getElementById('profile-btn').addEventListener('click', navigateToProfile);
  } else {
    navbarList.innerHTML = `
      <li class="header__navbar-item header__navbar-item--btn">ĐẶT PHÒNG</li>
      <li class="header__navbar-item header__navbar-item--btn">ĐĂNG KÝ</li>
      <li class="header__navbar-item header__navbar-item--btn" id="sign-in-btn">ĐĂNG NHẬP</li>
    `;
    
    document.getElementById('sign-in-btn').addEventListener('click', showLoginModal);
  }
};

// Chuyển hướng đến trang profile
const navigateToProfile = () => {
  const token = getToken();
  if (!token) {
    showLoginModal();
    return;
  }
  // TODO: Implement profile page navigation
  alert('Tính năng đang được phát triển');
};

// Logout
const logout = () => {
  removeToken();
  updateAuthUI();
  window.location.reload();
};

// Success messages
const showLoginSuccess = () => {
  alert('Đăng nhập thành công');
};

const showRegistrationSuccess = () => {
  alert('Đăng ký tài khoản thành công');
};

// Kiểm tra token hợp lệ
const validateToken = async (token) => {
  try {
    const response = await fetch(`${API_URL}/validate-token`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.ok;
  } catch (error) {
    console.error('Lỗi kiểm tra token:', error);
    return false;
  }
};

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  updateAuthUI();
  
  // Kiểm tra token khi tải trang
  const token = getToken();
  if (token) {
    validateToken(token).then(valid => {
      if (!valid) {
        removeToken();
        updateAuthUI();
        alert(messages.tokenExpired);
      }
    });
  }

  if (signInBtn) signInBtn.addEventListener('click', showLoginModal);
  if (closeModal) closeModal.addEventListener('click', closeLoginModal);
  if (continueBtn) continueBtn.addEventListener('click', handleContinue);
  if (googleBtn) {
    googleBtn.addEventListener('click', () => {
      // Initialize Google Sign-In when button is clicked
      if (window.google && window.google.accounts) {
        google.accounts.id.initialize({
          client_id: 'YOUR_GOOGLE_CLIENT_ID',
          callback: handleGoogleLogin
        });
        google.accounts.id.prompt();
      } else {
        console.error('Google Sign-In SDK not loaded');
        alert('Không thể khởi tạo đăng nhập Google');
      }
    });
  }
  
  window.addEventListener('click', (e) => {
    if (e.target === loginModal) {
      closeLoginModal();
    }
  });
  
  // Validate token on page load
  const token = getToken();
  if (token) {
    fetch(`${API_URL}/validate-token`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(response => {
      if (!response.ok) {
        removeToken();
        updateAuthUI();
      }
    }).catch(() => {
      removeToken();
      updateAuthUI();
    });
  }
});

// Make auth functions available globally
window.auth = {
  isLoggedIn: () => !!getToken(),
  logout,
  updateAuthUI
};

<script src="https://accounts.google.com/gsi/client"></script>