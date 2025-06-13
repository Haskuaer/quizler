const express = require('express');
const router = express.Router();
const viewsRender = require('@controllers/views.js')

router.get('/views/:folder/:view', viewsRender.partialRender);

router.get(/^\/(?!api\/|views\/).*$/, viewsRender.home);

module.exports = router;