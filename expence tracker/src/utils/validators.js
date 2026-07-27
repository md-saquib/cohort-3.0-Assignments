export const VALIDATION_RULES = {
  name: {
    required: 'Name is required',
    minLength: {
      value: 2,
      message: 'Name must be at least 2 characters long',
    },
    maxLength: {
      value: 50,
      message: 'Name cannot exceed 50 characters',
    },
  },
  email: {
    required: 'Email is required',
    pattern: {
      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: 'Invalid email address',
    },
  },
  password: {
    required: 'Password is required',
    minLength: {
      value: 6,
      message: 'Password must be at least 6 characters long',
    },
  },
  confirmPassword: (passwordValue) => ({
    required: 'Please confirm your password',
    validate: (value) => value === passwordValue || 'Passwords do not match',
  }),
  amount: {
    required: 'Amount is required',
    min: {
      value: 0.01,
      message: 'Amount must be greater than zero',
    },
    validate: {
      isNumber: (value) => !isNaN(Number(value)) || 'Amount must be a valid number',
    },
  },
  category: {
    required: 'Category is required',
  },
  date: {
    required: 'Date is required',
  },
  description: {
    maxLength: {
      value: 100,
      message: 'Description cannot exceed 100 characters',
    },
  },
};
