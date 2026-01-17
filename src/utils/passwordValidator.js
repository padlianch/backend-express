const PasswordValidator = require('password-validator');

const schema = new PasswordValidator();

schema
  .is().min(8)                                    // Minimum 8 characters
  .is().max(128)                                  // Maximum 128 characters
  .has().uppercase()                              // Must have uppercase letters
  .has().lowercase()                              // Must have lowercase letters
  .has().digits(1)                                // Must have at least 1 digit
  .has().symbols(1)                               // Must have at least 1 symbol
  .has().not().spaces()                           // Should not have spaces
  .is().not().oneOf(['Password123!', 'Qwerty123!', 'Admin123!']); // Blacklist common passwords

const validatePassword = (password) => {
  const result = schema.validate(password, { details: true });

  if (result === true || (Array.isArray(result) && result.length === 0)) {
    return { isValid: true, errors: [] };
  }

  const errorMessages = result.map((error) => {
    switch (error.validation) {
      case 'min':
        return 'Password must be at least 8 characters long';
      case 'max':
        return 'Password must not exceed 128 characters';
      case 'uppercase':
        return 'Password must contain at least one uppercase letter';
      case 'lowercase':
        return 'Password must contain at least one lowercase letter';
      case 'digits':
        return 'Password must contain at least one number';
      case 'symbols':
        return 'Password must contain at least one special character (!@#$%^&*)';
      case 'spaces':
        return 'Password must not contain spaces';
      case 'oneOf':
        return 'Password is too common, please choose a stronger password';
      default:
        return 'Invalid password';
    }
  });

  return { isValid: false, errors: errorMessages };
};

module.exports = { validatePassword };
