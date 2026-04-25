# Spendly — Finance Tracker

A beautiful, modern personal finance tracking application built with vanilla HTML, CSS, and JavaScript. Track your income and expenses with an elegant UI that supports both light and dark themes.

## 📋 Features

- **Transaction Management**: Add, view, and delete income and expense transactions
- **Monthly Overview**: Navigate between months and see month-specific summaries
- **Smart Analytics**:
  - Total income, expenses, and net balance
  - Spending breakdown by category with visual progress bars
  - Donut chart showing expense distribution
  - Category-based expense tracking
- **Dark/Light Theme**: Toggle between dark and light modes with theme persistence
- **Category Support**: 10+ pre-configured categories with emojis (Food, Transport, Shopping, Health, etc.)
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Local Storage**: All transactions are saved locally in the browser
- **Transaction Filtering**: Filter all transactions by type (All, Income, Expense)
- **Recent Transactions**: Quick view of your 6 most recent transactions

## 📁 Project Structure

```
credits2.0/
├── index.html      # Main HTML structure and layout
├── styles.css      # All CSS styling and responsive design
├── script.js       # JavaScript functionality and logic
└── README.md       # This file
```

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No server or installation required

### How to Use

1. **Open the Application**
   - Simply open `index.html` in your web browser

2. **Add a Transaction**
   - Select transaction type (Income or Expense)
   - Enter description (e.g., "Salary", "Groceries")
   - Enter amount in rupees (₹)
   - Select a category
   - Pick a date
   - Click "Add Transaction"

3. **View Transactions**
   - **Recent Transactions**: See your 6 most recent transactions
   - **All Transactions**: View all transactions for the current month with filtering options
   - **Spending by Category**: Visual breakdown of expenses by category

4. **Navigate Months**
   - Use arrow buttons (← →) to navigate between months
   - Month and year are displayed at the top

5. **Delete Transactions**
   - Hover over any transaction
   - Click the ✕ button to remove it

6. **Toggle Theme**
   - Click the moon/sun icon in the header to switch between dark and light modes
   - Your preference is saved automatically

## 🎨 Design

### Color Scheme

**Dark Theme:**
- Background: Deep blue-gray (#080b12)
- Accent: Vibrant purple (#6c6bff)
- Income: Green (#1de99b)
- Expense: Red (#ff4d72)

**Light Theme:**
- Background: Light lavender (#eef1fb)
- Accent: Deep purple (#5351e8)
- Income: Green (#0bbf77)
- Expense: Red (#e83258)

### Typography
- Primary Font: Syne (body text)
- Serif Font: DM Serif Display (headings)
- Mono Font: DM Mono (numbers and code)

## 💾 Data Storage

All transactions are stored in your browser's **LocalStorage** under the key `spendly_txns`. This means:
- Data persists across browser sessions
- Data is stored locally on your device
- Clearing browser data will delete all transactions
- Data is not synced across devices

### Data Structure
Each transaction object contains:
```javascript
{
  id: Date.now(),        // Unique identifier
  type: "income",        // "income" or "expense"
  desc: "Salary",        // Transaction description
  amount: 5000,          // Amount in rupees
  cat: "Salary",         // Category
  date: "2024-04-25"     // ISO date string
}
```

## 📊 Categories

Supported categories with emojis:
- 🍜 Food
- 🚗 Transport
- 🛍 Shopping
- 💊 Health
- 🎬 Entertainment
- 💡 Utilities
- 🏠 Rent
- 💼 Salary
- 💻 Freelance
- 📦 Other

## 🔧 Customization

### Modify Categories
Edit `script.js` and update the `COLORS` and `ICONS` objects:
```javascript
const COLORS = { YourCategory: '#hexcolor', ... };
const ICONS  = { YourCategory: '🔤', ... };
```

### Change Currency
Replace all instances of `₹` with your preferred currency symbol in:
- `index.html` (form labels and display text)
- `script.js` (fmt and fmtS functions)

### Adjust Styling
All design tokens are in `styles.css` under the `:root` and `[data-theme="light"]` selectors. Modify CSS variables to change colors, spacing, and effects.

## 📱 Responsive Breakpoints

- **Desktop**: Full layout with 3-column summary and 2-column card grid
- **Tablet (≤820px)**: 2-column summary, 1-column cards
- **Mobile (≤500px)**: Single column layout, hidden month label

## 🎯 Key Features Explained

### Summary Cards
Shows your financial overview for the selected month:
- Total income with transaction count
- Total expenses with transaction count
- Net balance (surplus or deficit)

### Spending by Category
- Donut chart visualization of expense distribution
- Top 5 categories in legend
- Total spent amount in center
- Color-coded by category

### Recent Transactions
- Shows 6 most recent transactions
- Quick reference for recent activity
- Delete functionality on hover

### Category Breakdown
- Progress bars showing expense per category
- Sorted by highest expense first
- Visual percentage representation
- Amount shown for each category

### All Transactions
- Complete transaction list for the month
- Filter by type (All, Income, Expense)
- Sorted by most recent first
- Delete functionality on hover

## ⌨️ Keyboard & Interaction

- **Tab Navigation**: Navigate through form fields
- **Enter Key**: Submit transaction form (after all fields are filled)
- **Click Arrow Buttons**: Navigate between months
- **Click Filter Buttons**: Change transaction filter
- **Hover Delete Button**: Delete transaction with visual feedback

## 🐛 Troubleshooting

### Transactions not saving?
- Check if LocalStorage is enabled in your browser
- Ensure you're not in private/incognito mode

### Numbers showing incorrectly?
- Verify the amount is entered as a valid number
- Check your browser's locale settings

### Theme not persisting?
- Clear browser cache and try again
- Check if browser allows LocalStorage

## 📈 Future Enhancement Ideas

- Export transactions as CSV/PDF
- Income vs Expense charts and trends
- Budget limits and alerts
- Recurring transactions
- Tags and custom categories
- Data backup and restore
- Multi-currency support
- Annual/yearly summaries

## 📄 License

This project is open source and available for personal and educational use.

## 👨‍💻 Credits

Built with care using modern web standards. Uses Google Fonts (Syne, DM Serif Display, DM Mono).

---

**Start tracking your finances with Spendly today!** 💰
