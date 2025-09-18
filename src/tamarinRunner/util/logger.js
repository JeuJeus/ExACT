const log = (message, compromiseName) =>
    console.log(`[${new Date().toISOString()}] [${compromiseName}] ${message}`);

module.exports = {
    log
}