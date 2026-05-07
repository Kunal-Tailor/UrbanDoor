/**
 * helpers.js — Utility helper functions used across the app
 * 
 * Contains formatting, validation, and date utility functions.
 */

/**
 * Format price to Indian Rupee format
 * @param {number} price - The price to format
 * @returns {string} Formatted price string like "₹1,499"
 */
export const formatPrice = (price) => {
  return '₹' + price.toLocaleString('en-IN');
};

/**
 * Format a date object or timestamp to a readable string
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date like "15 Dec 2025"
 */
export const formatDate = (date) => {
  const d = new Date(date);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

/**
 * Format a date to short format for date picker
 * @param {Date} date 
 * @returns {object} { day: 'Mon', date: '15', month: 'Dec', full: '2025-12-15' }
 */
export const formatDateShort = (date) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return {
    day: days[date.getDay()],
    date: date.getDate().toString(),
    month: months[date.getMonth()],
    full: date.toISOString().split('T')[0],
  };
};

/**
 * Get the next N days from today as date objects
 * @param {number} n - Number of days
 * @returns {Array} Array of date objects
 */
export const getNextDays = (n = 7) => {
  const days = [];
  for (let i = 0; i < n; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    days.push(date);
  }
  return days;
};

/**
 * Validate email format
 * @param {string} email 
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Validate password (minimum 6 characters)
 * @param {string} password 
 * @returns {boolean}
 */
export const isValidPassword = (password) => {
  return password && password.length >= 6;
};

/**
 * Validate phone number (10 digits)
 * @param {string} phone 
 * @returns {boolean}
 */
export const isValidPhone = (phone) => {
  const regex = /^[6-9]\d{9}$/;
  return regex.test(phone);
};

/**
 * Generate a unique booking ID
 * @returns {string} Booking ID like "SN-1702654321-A3B2"
 */
export const generateBookingId = () => {
  const timestamp = Date.now().toString().slice(-10);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `SN-${timestamp}-${random}`;
};

/**
 * Get greeting based on time of day
 * @returns {string} "Good Morning", "Good Afternoon", or "Good Evening"
 */
export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};

/**
 * Truncate text to a given length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text with "..." if needed
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Get status display text from status code
 * @param {string} status - Status code like "provider_assigned"
 * @returns {string} Display text like "Provider Assigned"
 */
export const getStatusText = (status) => {
  const statusMap = {
    confirmed: 'Confirmed',
    provider_assigned: 'Provider Assigned',
    on_the_way: 'On the Way',
    in_progress: 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
  };
  return statusMap[status] || status;
};

/**
 * Get time ago string from a date
 * @param {Date|string} date 
 * @returns {string} Like "2 hours ago", "3 days ago"
 */
export const getTimeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ];
  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
    }
  }
  return 'Just now';
};
