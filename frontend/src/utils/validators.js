export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return { isValid: false, message: 'Email is required' };
  if (!regex.test(email)) return { isValid: false, message: 'Invalid email format' };
  return { isValid: true, message: '' };
};

export const validatePhone = (phone) => {
  const regex = /^[0-9]{10}$/;
  if (!phone) return { isValid: false, message: 'Phone number is required' };
  if (!regex.test(phone)) return { isValid: false, message: 'Phone must be exactly 10 digits' };
  return { isValid: true, message: '' };
};

export const validatePassword = (password) => {
  if (!password) return { isValid: false, message: 'Password is required' };
  if (password.length < 8) return { isValid: false, message: 'Password must be at least 8 characters' };
  if (!/[A-Z]/.test(password)) return { isValid: false, message: 'Password must contain an uppercase letter' };
  if (!/[a-z]/.test(password)) return { isValid: false, message: 'Password must contain a lowercase letter' };
  if (!/[0-9]/.test(password)) return { isValid: false, message: 'Password must contain a number' };
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return { isValid: false, message: 'Password must contain a special character' };
  return { isValid: true, message: '' };
};

export const validateFullName = (name) => {
  if (!name) return { isValid: false, message: 'Full name is required' };
  if (name.length < 3) return { isValid: false, message: 'Name must be at least 3 characters' };
  if (name.length > 100) return { isValid: false, message: 'Name must be under 100 characters' };
  return { isValid: true, message: '' };
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return { isValid: false, message: 'Please confirm your password' };
  if (password !== confirmPassword) return { isValid: false, message: 'Passwords do not match' };
  return { isValid: true, message: '' };
};
