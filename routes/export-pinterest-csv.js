// routes/export-pinterest-csv.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { Parser } = require('json2csv');

// 📅 helper to generate posting times
function generateSchedule(startDate = new Date()) {
  const base = new Date(startDate);
  base.setDate(base.getDate() + 1); // start from D+1
  base.setHours(0, 0, 0, 0);

  const offsets = [0, 4, 9, 13, 18]; // hours for each post
  return offsets.map((hour, i) => {
    const d = new Date(base);
    d.setHours(hour);
    return d.toISOString().replace('T', ' ').substring(0, 16);
  });
}

// ⚙️ Example route: generate Pinterest CSV
router.get('/api/export/pinterest-csv', async (req, res) => {
  try {
    // In the future, fetch from your DB.
    // For now, we’ll simulate data:
    const recipes = [
      { title: 'Creamy Garlic Shrimp', pinterestTitle: 'Creamy Garlic Shrimp 🍤', pinterestDescription: 'Save this rich & creamy shrimp recipe!', url: 'https://yourwebsite.com/creamy-garlic-shrimp' },
      { title: 'Lemon Zucchini Bread', pinterestTitle: 'Lemon Zucchini Bread 🍋', pinterestDescription: 'Fresh, moist, and full of flavor!', url: 'https://yourwebsite.com/lemon-zucchini-bread' },
      { title: 'Strawberry Cheesecake', pinterestTitle: 'Classic Strawberry Cheesecake 🍓', pinterestDescription: 'A creamy, rich cheesecake for all occasions!', url: 'https://yourwebsite.com/strawberry-cheesecake' },
      { title: 'BBQ Chicken Wraps', pinterestTitle: 'BBQ Chicken Wraps 🌯', pinterestDescription: 'Easy, cheesy, and absolutely delicious!', url: 'https://yourwebsite.com/bbq-chicken-wraps' },
      { title: 'Chocolate Chip Cookies', pinterestTitle: 'Perfect Chocolate Chip Cookies 🍪', pinterestDescription: 'Soft inside, crispy edges — perfection!', url: 'https://yourwebsite.com/chocolate-chip-cookies' }
    ];

    const schedule = generateSchedule();
    const csvData = recipes.map((r, i) => ({
      Title: r.pinterestTitle,
      Description: r.pinterestDescription,
      Link: r.url,
      Time: schedule[i] || ''
    }));

    const parser = new Parser();
    const csv = parser.parse(csvData);

    const filePath = path.join(__dirname, '../data/pinterest_export.csv');
    fs.writeFileSync(filePath, csv);

    res.download(filePath, 'pinterest_export.csv');
  } catch (err) {
    console.error('Error generating Pinterest CSV:', err);
    res.status(500).json({ error: 'Failed to generate CSV' });
  }
});

module.exports = router;
