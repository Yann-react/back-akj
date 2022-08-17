const express = require('express');

const userCtr = require('../controllers/user');
const auth = require('../middleware/auth');
const router = express.Router();


router.post("/signIn", userCtr.createUser);
  

router.get("/message",userCtr.test);
  

router.post("/getInfo",userCtr.getInfoUser);
  
  
router.post("/sendPoint",userCtr.sendPoint);
  
  
router.post("/getPoint", userCtr.getPoint);
  
  
router.post("/Login",userCtr.login);


module.exports = router;