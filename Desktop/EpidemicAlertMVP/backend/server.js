const app = require('./app');
const connectDB = require('./config/db');
const { PORT } = require('./config/env');

async function demarrer() {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Babi Alert server demarre sur http://localhost:${PORT}`);
    });
}

demarrer();
