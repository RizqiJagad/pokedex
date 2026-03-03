import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import pokemonRoutes from './routes/pokemonRoutes';
import { seedPokemonsIfEmpty } from './services/seedService';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/pokemon', pokemonRoutes);

const startServer = async () => {
    await connectDB();
    await seedPokemonsIfEmpty();

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();
