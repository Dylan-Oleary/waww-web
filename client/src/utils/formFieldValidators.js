exports.validateEmail = email => { return  email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email) ? 'Invalid email address' : undefined }

exports.validateEmptyField = value => { return value === "" ? `Field cannot be empty` : undefined }

exports.required = value => (value ? undefined : 'Field is required');

const validateMaxCharacters = max => value => { return value && value.length > max ? `Field must be ${max} characters or less` : undefined; }

exports.maxCharacters25 = validateMaxCharacters(25);
exports.maxCharacters50 = validateMaxCharacters(50);