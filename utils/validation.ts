export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface ValidationRule {
  test: (value: string) => boolean;
  message: string;
}

// Email validation
export const validateEmail = (email: string): ValidationResult => {
  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    return { isValid: false, error: "Email is required" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedEmail)) {
    return { isValid: false, error: "Please enter a valid email address" };
  }

  if (trimmedEmail.length > 254) {
    return { isValid: false, error: "Email address is too long" };
  }

  return { isValid: true };
};

// Password validation with specific rules
export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, error: "Password is required" };
  }

  if (password.length < 6) {
    return { isValid: false, error: "Password must be at least 6 characters long" };
  }

  if (password.length > 128) {
    return { isValid: false, error: "Password is too long (max 128 characters)" };
  }

  // Check for at least one letter and one number for stronger passwords
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);

  if (!hasLetter) {
    return { isValid: false, error: "Password must contain at least one letter" };
  }

  if (!hasNumber) {
    return { isValid: false, error: "Password must contain at least one number" };
  }

  return { isValid: true };
};

// Password confirmation validation
export const validatePasswordConfirmation = (
  password: string,
  confirmPassword: string
): ValidationResult => {
  if (!confirmPassword) {
    return { isValid: false, error: "Please confirm your password" };
  }

  if (password !== confirmPassword) {
    return { isValid: false, error: "Passwords do not match" };
  }

  return { isValid: true };
};

// General field validation
export const validateRequired = (value: string, fieldName: string): ValidationResult => {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return { isValid: false, error: `${fieldName} is required` };
  }

  return { isValid: true };
};

// Custom validation with multiple rules
export const validateWithRules = (value: string, rules: ValidationRule[]): ValidationResult => {
  for (const rule of rules) {
    if (!rule.test(value)) {
      return { isValid: false, error: rule.message };
    }
  }

  return { isValid: true };
};

// Form validation helper
export const validateForm = (
  formData: Record<string, any>,
  validators: Record<string, (value: any) => ValidationResult>
): {
  isValid: boolean;
  errors: Record<string, string>;
} => {
  const errors: Record<string, string> = {};
  let isValid = true;

  for (const [field, validator] of Object.entries(validators)) {
    const result = validator(formData[field]);
    if (!result.isValid) {
      errors[field] = result.error || "Invalid value";
      isValid = false;
    }
  }

  return { isValid, errors };
};

// Real-time password strength indicator
export interface PasswordStrength {
  score: number; // 0-4
  feedback: string[];
  color: "red" | "orange" | "yellow" | "green";
}

export const getPasswordStrength = (password: string): PasswordStrength => {
  if (!password) {
    return { score: 0, feedback: ["Enter a password"], color: "red" };
  }

  let score = 0;
  const feedback: string[] = [];

  // Length check
  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push("Use at least 8 characters");
  }

  // Lowercase check
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push("Add lowercase letters");
  }

  // Uppercase check
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push("Add uppercase letters");
  }

  // Number check
  if (/\d/.test(password)) {
    score += 1;
  } else {
    feedback.push("Add numbers");
  }

  // Special character check
  if (/[^a-zA-Z0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push("Add special characters");
  }

  // Determine color and final feedback
  let color: "red" | "orange" | "yellow" | "green" = "red";

  if (score >= 4) {
    color = "green";
    feedback.length = 0;
    feedback.push("Strong password!");
  } else if (score >= 3) {
    color = "yellow";
  } else if (score >= 2) {
    color = "orange";
  }

  return { score: Math.min(score, 4), feedback, color };
};
