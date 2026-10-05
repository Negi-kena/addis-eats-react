import { useState } from 'react';
import { useAuth } from './AuthContext.jsx';
import { validateName, validatePhone } from '../checkout/validate.js';
import './SignInGate.css';

/**
 * Rendered by RequireAuth in place of Checkout when no session exists.
 * On valid submit, calls signIn() — RequireAuth then re-renders and
 * shows the real Checkout form instead, no navigation involved.
 */
function SignInGate() {
  const { signIn } = useAuth();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState({});

  function handleSubmit(e) {
    e.preventDefault();
    const nextErrors = {};
    if (!validateName(name)) nextErrors.name = 'Please enter your full name.';
    if (!validatePhone(phone)) {
      nextErrors.phone = 'Enter a valid Ethiopian phone number (e.g. 0910******).';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      signIn(name, phone);
    }
  }

  return (
    <div className="container sign-in-gate">
      <h1>Sign in to checkout</h1>
      <p>We just need your name and phone number to place an order.</p>

      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="signin-name">Full name</label>
        <input
          id="signin-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? 'signin-name-error' : undefined}
        />
        {errors.name && (
          <span id="signin-name-error" className="sign-in-gate__error">
            {errors.name}
          </span>
        )}

        <label htmlFor="signin-phone">Phone number</label>
        <input
          id="signin-phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="0910 **** *** or 0710 **** **"
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={errors.phone ? 'signin-phone-error' : undefined}
        />
        {errors.phone && (
          <span id="signin-phone-error" className="sign-in-gate__error">
            {errors.phone}
          </span>
        )}

        <button type="submit" className="btn-primary">
          Continue
        </button>
      </form>
    </div>
  );
}

export default SignInGate;