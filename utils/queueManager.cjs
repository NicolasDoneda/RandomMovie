const fs = require('fs');
const path = require('path');

const queuePath = path.join(__dirname, '../queue.json');

function loadQueue() {
    if (!fs.existsSync(queuePath)) {
        fs.writeFileSync(queuePath, JSON.stringify({ movies: [], lastReset: null }, null, 2));
    }
    return JSON.parse(fs.readFileSync(queuePath, 'utf8'));
}

function saveQueue(data) {
    fs.writeFileSync(queuePath, JSON.stringify(data, null, 2));
}

function resetIfNeeded() {
    const queue = loadQueue();
    const today = new Date();
    const lastResetDate = queue.lastReset ? new Date(queue.lastReset) : null;

    // Se nunca resetou ou é sábado e ainda não resetou hoje
    const todayStr = today.toISOString().split('T')[0];
    if (!lastResetDate || (today.getDay() === 6 && queue.lastReset !== todayStr)) {
        queue.movies = [];
        queue.lastReset = todayStr;
        saveQueue(queue);
        console.log('Lista resetada automaticamente para a nova semana!');
    }
}

module.exports = { loadQueue, saveQueue, resetIfNeeded };
