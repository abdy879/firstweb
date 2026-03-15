import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Auth.css';

function Auth({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [signupMethod, setSignupMethod] = useState('email'); // 'email' or 'phone'
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    // Reset inputs
    setEmail('');
    setPhone('');
    setPassword('');
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone) => {
    return /^\d{11}$/.test(phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!isLogin) {
      if (signupMethod === 'email') {
        if (!validateEmail(email)) {
          setError('Please enter a valid email address.');
          return;
        }
      } else {
        if (!validatePhone(phone)) {
          setError('Phone number must be exactly 11 digits.');
          return;
        }
      }
    }

    setLoading(true);

    const endpoint = isLogin ? '/api/login' : '/api/signup';
    const payload = { password };
    
    if (isLogin) {
      // For login, we still allow both in one field for convenience, 
      // or we could use the same logic as signup. For now, let's keep it flexible.
      if (email.includes('@')) {
        payload.email = email;
      } else {
        payload.phone = email;
      }
    } else {
      if (signupMethod === 'email') payload.email = email;
      else payload.phone = phone;
    }

    try {
      const response = await fetch(`http://localhost:3000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        if (isLogin) {
          localStorage.setItem('user', JSON.stringify(data.user));
          if (onLoginSuccess) onLoginSuccess(data.user);
          
          // If we came from checkout, go back to home and signal to open checkout modal
          if (location.state?.returnToCheckout) {
            navigate('/', { state: { openCheckout: true } });
          } else {
            navigate('/');
          }
        } else {
          alert('Signup successful! Please login.');
          setIsLogin(true);
        }
      } else {
        setError(data.message || 'Something went wrong');
      }
    } catch (err) {
      setError('Connection failed. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className={`auth-container ${!isLogin ? 'signup-mode' : ''}`}>
        
        <div className="auth-side-panel">
          <h2>{isLogin ? 'New here?' : 'Welcome Back!'}</h2>
          <p>
            {isLogin 
              ? 'Then Sign Up and Start Ordering!' 
              : 'To keep connected with us please login with your personal info'}
          </p>
          <button className="btn-ghost" onClick={toggleMode}>
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </div>

        <div className="auth-form-panel">
          <h1>{isLogin ? 'Sign in' : 'Create Account'}</h1>
          
          {!isLogin && (
            <div className="signup-toggle">
              <button 
                className={signupMethod === 'email' ? 'active' : ''} 
                onClick={() => setSignupMethod('email')}
              >
                Email
              </button>
              <button 
                className={signupMethod === 'phone' ? 'active' : ''} 
                onClick={() => setSignupMethod('phone')}
              >
                Phone
              </button>
            </div>
          )}

          <p className="auth-subtitle">
            {isLogin ? 'Login to manage your orders' : `Sign up with your ${signupMethod}`}
          </p>

          {error && <div className="auth-error">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            {isLogin ? (
              <div className="input-group">
                <input 
                  type="text" 
                  placeholder="Email or Phone" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            ) : (
              signupMethod === 'email' ? (
                <div className="input-group">
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              ) : (
                <div className="input-group">
                  <input 
                    type="tel" 
                    placeholder="Phone (11 digits)" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              )
            )}

            <div className="input-group">
              <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {isLogin && <span className="forgot-link">Forgot Password?</span>}

            <button className="btn-login" type="submit" disabled={loading}>
              {loading ? 'Processing...' : (isLogin ? 'LOGIN' : 'SIGN UP')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Auth;
