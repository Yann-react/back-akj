const User = require("../models/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.createUser = (req, res, next) => {
  console.log("USERS");
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        nom: req.body.nom,
        email: req.body.email,
        solde: req.body.solde,
        titre: req.body.titre,
        adresse: req.body.adresse,
        password: hash,
      });

      user
        .save()
        .then(() =>
          res.status(201).json({
            message: "Utilisateur créé !",
            token: jwt.sign(
              { userId: user._id, email: user.email },
              "RANDOM_TOKEN_SECRET",
              {
                expiresIn: "24h",
              }
            ),
          })
        )
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.test = (req, res) =>
  res.status(200).send({ message: "Hello from the server !" });

exports.getInfoUser = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((things) =>
      res.status(200).json({
        titre: things.titre,
        nom: things.nom,
        solde: things.solde,
        adresse: things.adresse,
      })
    )
    .catch((error) => res.status(400).json({ error }));
};

exports.sendPoint = async (req, res, next) => {
  try {
    const searchId = await User.findOne({ adresse: req.body.adresse });
    searchId.solde = searchId.solde + req.body.solde * 0.01;
    console.log(searchId.solde);
    await searchId.save();
    res.status(200).json({
      message: "solde update",
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getPoint = async (req, res, next) => {
  try {
    const searchId = await User.findOne({ adresse: req.body.adresse });
    console.log(searchId);
    if (searchId.solde < req.body.solde) {
      res.status(200).json({
        message: "solde insuffisant",
      });
    } else {
      searchId.solde = searchId.solde - req.body.solde;
      await searchId.save();
      res.status(200).json({
        message: "solde update",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

// exports.forgetPassword = async (req,res,next)=>{
//   try{
//     const searchEmail = await User.findOne({email:req.body.email})
//     console.log(searchEmail)
//     bcrypt
//     .hash(req.body.password, 10)
//     .then((hash) => {
//     searchEmail.password = hash
//     console.log(searchEmail)
//     })
//     await searchEmail.save()
//     res.status(200).json({
//       message:'password update'
//     })
//   }catch(e){
//     console.log(e)
//   }

// }

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res
          .status(401)
          .json({ message: "Paire login/mot de passe incorrecte" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res
              .status(401)
              .json({ message: "Paire login/mot de passe incorrecte" });
          }
          res.status(200).json({
            email: user.email,
            titre: user.titre,
            userId: user._id,
            token: jwt.sign(
              { userId: user._id, email: user.email },
              "RANDOM_TOKEN_SECRET",
              {
                expiresIn: "24h",
              }
            ),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
