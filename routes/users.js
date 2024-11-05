var express = require("express");
var router = express.Router();
const {checkId} = require("../modules/checkId")
const {checkBody} = require("../modules/checkBody")
const client = require("../db");

/**
 *  get all users
 */
router.get("/", async (req, res) => {
  try {
    const datas = await client.query("SELECT * FROM users");
    if (datas.rows.length > 0) {
      res.json({ result: true, data: datas.rows });
    } else {
      res.json({ result: false, message: "Pas de données" });
    }
  } catch (err) {
    console.error(err);
    res.json({ result: false, error: err.detail });
  }
  //  finally {
  //   await client.end();
  // }
});

/**
 * Get one user
 */

router.get("/:id", async (req, res) => {

  const id = Number(req.params.id);
  // Check id is a number
  const isValid=checkId(id)
  if(!isValid)
  {
    return res.json({result:false,error: "L'identifiant est invalide"})
  }
  try {
    const datas = await client.query(`
         SELECT * FROM users WHERE user_id=${req.params.id};
         `);
    if (datas.rows.length > 0) {
      res.json({ result: true, data: datas.rows });
    } else {
      res.json({ result: false, message: "Pas de données" });
    }
  } catch (err) {
    console.error(err);
    res.json({ result: false, error: err.detail });
  }
  //  finally {
  //     await client.end()
  //  }
});

/**
 * Post user
 */

router.post("/", async (req, res) => {

  if (!checkBody(req.body, ['username', 'email'])) {
    res.json({ result: false, error: 'Champs vides ou invalides' });
    return;
  }

  const newUser = {
    username: req.body.username,
    email: req.body.email,
    isactive:req.body.isactive
  };

  try {
    const datas = await client.query(`
         INSERT INTO users (username,email,timestamp,isactive) VALUES ('${newUser.username}',DEFAULT,'${newUser.isactive}');
         `);
    if (datas.rowCount == 1) {
      res.json({ result: true, message: "Utilisateur ajouté" });
    } else {
      res.json({ result: false, message: "Utilisateur non ajouté" });
    }
  } catch (err) {
    console.error(err);
    res.json({ result: false, error: err.detail });
  }
  //  finally {
  //     await client.end()
  //  }
});

/**
 * Put user
 */
router.put("/:id", async (req, res) => {

  if (!checkBody(req.body, ['username','email'])) {
    res.json({ result: false, error: 'Champs vides ou invalides' });
    return;
  }

  const id = Number(req.params.id);
  // Check id is a number
  const isValid=checkId(id)
  if(!isValid)
  {
    return res.json({result:false,error: "L'identifiant est invalide"})
  }

  const editUser = {
    username: req.body.username,
    email: req.body.email.toLowerCase(),
    isactive: req.body.isactive,
  };

  try {
    const datas = await client.query(`
         UPDATE users SET username = '${editUser.username}',email = '${editUser.email}',isactive =  '${editUser.isactive}' WHERE user_id = ${id};`);
    if (datas.rowCount == 1) {
      res.json({ result: true, message: "Utilisateur modifié" });
    } else {
      res.json({ result: false, message: "Utilisateur non modifié" });
    }
  } catch (err) {
    console.error(err);
    res.json({ result: false, error: err.detail });
  }
  //  finally {
  //     await client.end()
  //  }
});

/**
 *    update if user is active
 * */
router.put("/isactive/:id", async (req, res) => {

  const id = Number(req.params.id);
  // Check id is a number
  const isValid=checkId(id)
  if(!isValid)
  {
    return res.json({result:false,error: "L'identifiant est invalide"})
  }
  try {
    const datas = await client.query(`
         UPDATE users SET isactive = NOT isactive   WHERE user_id = ${id};`);
    if (datas.rowCount == 1) {
      const result = await client.query(`
            SELECT isactive FROM users WHERE user_id = ${id};`);
      res.json({
        result: true,
        message: "Utilisateur modifié",
        datas: result.rows,
      });
    } else {
      res.json({ result: false, message: "Utilisateur non modifié" });
    }
  } catch (err) {
    console.error(err);
    res.json({ result: false, error: err.detail });
  }
  //  finally {
  //     await client.end()
  //  }
});

/**
 * Delete user
 */
router.delete("/:id", async (req, res) => {

  const id = Number(req.params.id);
  // Check id is a number
  const isValid=checkId(id)
  if(!isValid)
  {
    return res.json({result:false,error: "L'identifiant est invalide"})
  }

  try {
    const datas = await client.query(`
         DELETE FROM users WHERE user_id = ${id};`);
    if (datas.rowCount == 1) {
      res.json({ result: true, message: "Utilisateur supprimé" });
    } else {
      res.json({ result: false, message: "Utilisateur non supprimé" });
    }
  } catch (err) {
    console.error(err);
    res.json({ result: false, error: err.detail });
  }
  //  finally {
  //     await client.end()
  //  }
});

module.exports = router;
