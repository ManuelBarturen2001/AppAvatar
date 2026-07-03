const { Router } = require('express');
const characterController = require('../controllers/characterController');

const router = Router();

router.get('/characters', characterController.getCharacters);
router.get('/characters/:id', characterController.getCharacterById);

module.exports = router;
