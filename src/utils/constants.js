/* src/utils/constants.js */

export const CATEGORIES = [
  // Wants (Leaks)
  { value: 'food', label: 'Food & Dining', icon: '🍽️', color: 'orange' },
  { value: 'snacks', label: 'Snacks & Coffee', icon: '☕', color: 'red' },
  { value: 'shopping', label: 'Shopping', icon: '🛍️', color: 'pink' },
  { value: 'entertainment', label: 'Entertainment', icon: '🎬', color: 'purple' },
  { value: 'subscription', label: 'Subscriptions', icon: '🔄', color: 'indigo' },
  { value: 'transport', label: 'Transport', icon: '🚕', color: 'blue' },
  
  // Needs (Essentials)
  { value: 'healthcare', label: 'Healthcare', icon: '🏥', color: 'emerald' },
  { value: 'education', label: 'Education', icon: '🎓', color: 'cyan' },
  { value: 'bills', label: 'Bills & Utilities', icon: '⚡', color: 'yellow' },
  { value: 'investment', label: 'Investments', icon: '📈', color: 'green' },
  
  { value: 'misc', label: 'Other', icon: '📦', color: 'gray' }
];

// ... rest of the file (TIME_OF_DAY, etc.) remains the same ...
export const TIME_OF_DAY = [
  { value: 'morning', label: 'Morning', icon: '☀️', color: 'orange' },
  { value: 'daytime', label: 'Day', icon: '🌞', color: 'yellow' },
  { value: 'evening', label: 'Evening', icon: '🌆', color: 'purple' },
  { value: 'night', label: 'Night', icon: '🌙', color: 'blue' }
];

export const INITIAL_EXPENSES = [
  { id: 1, amount: 40, category: 'snacks', description: 'Coffee', date: '2024-01-15', time: 'morning' },
  { id: 2, amount: 80, category: 'food', description: 'Late night delivery', date: '2024-01-15', time: 'night' },
  { id: 3, amount: 2000, category: 'healthcare', description: 'Apollo Pharmacy', date: '2024-01-14', time: 'daytime' },
];

export const INITIAL_INSIGHTS = [];