import { Router } from 'express';
import { getPokemons, getPokemonDetail } from '../controllers/pokemonController';

const router = Router();

router.get('/', getPokemons);
router.get('/:name', getPokemonDetail);

export default router;
