const router = require('express').Router();

router.get('/', (req, res) => {
    res.json({
        posts: {
            title:"My first post",
            description: "testing this routes if it worked for siure"
        }
    });
});

module.exports = router;