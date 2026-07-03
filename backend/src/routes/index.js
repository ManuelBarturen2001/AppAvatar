const { Router } = require('express');
const characterRoutes = require('./characterRoutes');

const router = Router();

router.use('/', characterRoutes);

module.exports = router;
