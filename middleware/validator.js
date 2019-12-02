const isAlphaNumeric = (mail) => {
  mail = mail.toString();
  const code = mail.charCodeAt(0);
  if (!(code > 47 && code < 58) // numeric 0-9
      && !(code > 64 && code < 91) // uppercase alphabet
      && !(code > 96 && code < 123)) { // lowercase alphabet
    return false;
  }
  return true;
};
const isAlphaNumericAndSomeChar = (mail) => {
  mail = mail.toString();
  for (let i = 0, len = mail.length; i < len; i++) {
    const code = mail.charCodeAt(i);
    if (!(code > 47 && code < 58) // numeric 0-9
        && !(code > 64 && code < 91) // uppercase alphabet
        && !(code === 45 || code === 46 || code === 64 || code === 95) // Hyphen, Period, @, underscore
        && !(code > 96 && code < 123)) { // lowercase alphabet
      return false;
    }
  }
  return true;
};
  // Validate Email input from user
const validateEmail = (emailAddress) => {
  if (!emailAddress) {
    return false;
  }
  const email = emailAddress.split('');
  // email address must contain @ sign
  if (email.indexOf('@') === -1) {
    return false;
  }
  // email address must not contain 2 or more @ signs
  const newMailArray = emailAddress.split('@');
  if (newMailArray.length > 2) {
    return false;
  }
  // email address must contain dot,  as in .com or .com.ng
  if (email.indexOf('.') === -1) {
    return false;
  }
  // the only special characters allowed
  // are: "@ _ - ." and they must not follow each
  // other consecutively e.g, -- or __ or ..
  if (email[email.indexOf('.') + 1] === '.'
      || email[email.indexOf('_') + 1] === '_'
      || email[email.indexOf('-') + 1] === '-') {
    return false;
  }
  // first letter in the email address must not contain special character,
  // so is the letter immdiately the @ sign and last letter
  if (isAlphaNumeric(newMailArray[0].charAt(0)) === false
      || isAlphaNumeric(newMailArray[1].charAt(0)) === false
      || isAlphaNumeric(newMailArray[1][newMailArray[1].length - 1]) === false
  ) {
    return false;
  }
  // The only character allowed are alphanumeric and "@ _ - ."
  if (isAlphaNumericAndSomeChar(emailAddress) === false) {
    return false;
  }

  return true;
};

export const validateModifiedUser = ({
  fullname,
  email
}) => {
  const checkEachChar = (char) => {
    char = parseInt(char, 10);
    return Number.isInteger(char);
  };
  const checkForInteger = (stringVal) => {
    const newstring = stringVal.split('');
    const newarray = newstring.filter(checkEachChar);
    return newarray;
  };

  const verifyFullnameChars = checkForInteger(fullname);
  if (fullname.trim().includes(' ') === false) {
    return 'Your firstname and lastname must be separated by whitespace';
  }
  if (fullname.trim().length < 4) {
    return 'Fullname must contain atleast 4 minimum characters';
  }
  if (verifyFullnameChars.length >= 1) {
    return 'Your fullname must not contains numeric characters';
  }
  if (!validateEmail(email)) {
    return 'please enter a valid email address';
  }
  return false;
};


export const validateUser = ({
  fullname,
  username,
  password,
  email
}) => {
  if (!fullname) {
    return 'Fullname must contain atleast 4 minimum characters';
  }
  if (!username) {
    return 'Username must contain at least 3 alphabet characters with no whitespace!';
  }
  if (!email) {
    return 'please enter a valid email address';
  }
  if (!password) {
    return 'Password must be at least 5 characters!';
  }
  username = username.toLowerCase();
  const checkEachChar = (char) => {
    char = parseInt(char, 10);
    return Number.isInteger(char);
  };
  const checkForInteger = (stringVal) => {
    const newstring = stringVal.split('');
    const newarray = newstring.filter(checkEachChar);
    return newarray;
  };

  const verifyFullnameChars = checkForInteger(fullname);
  if (fullname.trim().includes(' ') === false) {
    return 'Your firstname and lastname must be separated by whitespace';
  }
  if (fullname.trim().length < 4) {
    return 'Fullname must contain atleast 4 minimum characters';
  }
  if (verifyFullnameChars.length >= 1) {
    return 'Your fullname must not contains numeric characters';
  }

  if (username.trim().length < 3 || username.includes(' ')) {
    return 'Username must contain at least 3 alphabet characters with no whitespace!';
  }
  if (!validateEmail(email)) {
    return 'please enter a valid email address';
  }
  if (password.trim().length === 0 || password.length < 5) {
    return 'Password must be at least 5 characters!';
  }
  return false;
};
export const validateBusiness = ({
  businessName, businessAddress1, businessDescription, phoneNumber1
}) => {
  if (!businessName || businessName.trim().length < 5) {
    return 'Business name must be more than 5 characters!';
  }
  if (!businessAddress1 || businessAddress1.length < 5) {
    return 'Business Address must be atleast 5 characters long!';
  }
  if (!phoneNumber1 || phoneNumber1.trim().length < 5) {
    return 'Business phone-number must be more than 5 characters!';
  }
  if (!businessDescription || businessDescription.length < 10) {
    return 'Business Description must be atleast 10 characters long!';
  }
  return false;
};
export const validateReview = ({ title, content }) => {
  if (!title || title.trim().length <= 4) {
    return 'Review title must be atleast 4 characters';
  }
  if (!content || content.trim().length <= 10) {
    return 'Review content must be atleast 10 characters';
  }
  return false;
};
