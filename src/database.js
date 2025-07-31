const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = process.env.DB_PATH || './database.sqlite';

let db;

function initializeDatabase() {
    db = new sqlite3.Database(DB_PATH, (err) => {
        if (err) {
            console.error('Error opening database:', err.message);
        } else {
            console.log('Connected to SQLite database');
            createTables();
        }
    });
}

function createTables() {
    // Create bookings table
    db.run(`
        CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            date TEXT NOT NULL,
            time TEXT NOT NULL,
            datetime TEXT NOT NULL,
            meet_link TEXT,
            event_id TEXT,
            status TEXT DEFAULT 'confirmed',
            reminder_sent INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error('Error creating bookings table:', err.message);
        } else {
            console.log('Bookings table ready');
        }
    });

    // Create auth tokens table (for storing OAuth tokens)
    db.run(`
        CREATE TABLE IF NOT EXISTS auth_tokens (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            access_token TEXT,
            refresh_token TEXT,
            expires_at INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error('Error creating auth_tokens table:', err.message);
        } else {
            console.log('Auth tokens table ready');
        }
    });
}

function getDatabase() {
    return db;
}

// Booking operations
function createBooking(bookingData) {
    return new Promise((resolve, reject) => {
        const { name, email, date, time, datetime, meet_link, event_id } = bookingData;
        
        db.run(`
            INSERT INTO bookings (name, email, date, time, datetime, meet_link, event_id)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [name, email, date, time, datetime, meet_link, event_id], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve({ id: this.lastID, ...bookingData });
            }
        });
    });
}

function getBooking(id) {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM bookings WHERE id = ?', [id], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}

function getAllBookings() {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM bookings ORDER BY datetime DESC', (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

function getUpcomingBookings(minutesBefore = 10) {
    return new Promise((resolve, reject) => {
        const now = new Date();
        const reminderTime = new Date(now.getTime() + minutesBefore * 60000);
        
        db.all(`
            SELECT * FROM bookings 
            WHERE datetime <= ? 
            AND datetime > ? 
            AND reminder_sent = 0 
            AND status = 'confirmed'
        `, [reminderTime.toISOString(), now.toISOString()], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

function markReminderSent(bookingId) {
    return new Promise((resolve, reject) => {
        db.run('UPDATE bookings SET reminder_sent = 1 WHERE id = ?', [bookingId], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

// Auth token operations
function saveAuthTokens(tokens) {
    return new Promise((resolve, reject) => {
        const { access_token, refresh_token, expiry_date } = tokens;
        
        // First, clear existing tokens
        db.run('DELETE FROM auth_tokens', (err) => {
            if (err) {
                console.error('Error clearing old tokens:', err);
            }
            
            // Insert new tokens
            db.run(`
                INSERT INTO auth_tokens (access_token, refresh_token, expires_at)
                VALUES (?, ?, ?)
            `, [access_token, refresh_token, expiry_date], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID });
                }
            });
        });
    });
}

function getAuthTokens() {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM auth_tokens ORDER BY created_at DESC LIMIT 1', (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}

module.exports = {
    initializeDatabase,
    getDatabase,
    createBooking,
    getBooking,
    getAllBookings,
    getUpcomingBookings,
    markReminderSent,
    saveAuthTokens,
    getAuthTokens
};