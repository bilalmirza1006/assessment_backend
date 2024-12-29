const app = require('./app');
const connectDB = require('./config/db');
const socketConfig = require('./config/socketConfig');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

connectDB();


// socketConfig(io);


// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
// });
