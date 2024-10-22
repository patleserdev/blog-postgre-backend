var express = require("express");
var router = express.Router();
const {checkId} = require("../modules/checkId")
const {checkBody} = require("../modules/checkBody")
const client = require("../db");
/**
 *  get all categories
 */
router.get("/", async (req, res) => {
  try {
    const datas = await client.query("SELECT * FROM posts_categories");
    if (datas.rows.length > 0) {
      res.json({ result: true, data: datas.rows });
    } else {
      res.json({ result: false, message: "Pas de données" });
    }
  } catch (err) {
    console.error(err);
    res.json({ result: false, error: err.detail });
  } 
  // finally {
  //   await client.end();
  // }
});


/**
 * Get one categorie
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
    const datas = await client.query(`SELECT * FROM posts_categories WHERE categorie_id=${id};`);
    if (datas.rows.length > 0) {
      res.json({ result: true, data: datas.rows });
    } else {
      res.json({ result: false, message: "Pas de données" });
    }
  } catch (err) 
  {
    console.error(err);
    res.json({ result: false, error: err.detail });
  }
  //  finally {
  //     await client.end()
  //  }
});


/**
 * Post categorie
 */

router.post("/", async (req, res) => {

  if (!checkBody(req.body, ['title', 'description'])) {
    res.json({ result: false, error: 'Champs vides ou invalides' });
    return;
  }
  var formattedTitle = encodeURI(req.body.title);
  var formattedDescription = encodeURI(req.body.description);

  const newComment = {

    title :formattedTitle,
    description :formattedDescription,
    isactive :req.body.isactive | false
  };

  const query =
    "INSERT INTO posts_categories (title,description,isactive) VALUES ($1, $2,$3) RETURNING categorie_id;";
  const values = [
    newComment.title,
    newComment.description,
    newComment.isactive,
  ];

  try {
    const datas = await client.query(query, values);

    if (datas.rowCount == 1) {
      res.json({ result: true, message: "Catégorie ajouté" });
    } else {
      res.json({ result: false, message: "Catégorie non ajouté" });
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
 * Put categorie
 */
router.put("/:id", async (req, res) => {

  if (!checkBody(req.body, ['title','description'])) {
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

  var formattedTitle = encodeURI(req.body.title);
  var formattedDescription = encodeURI(req.body.description);
  const editPost = {
    title: formattedTitle,
    description: formattedDescription,
  };

  const query = `UPDATE posts_categories SET title = $1 , description = $2 WHERE categorie_id = ${id};`;
  const values = [editPost.title, editPost.description];
  try {
    const datas = await client.query(query, values);

    if (datas.rowCount == 1) {
      res.json({ result: true, message: "Catégorie modifiée" });
    } else {
      res.json({ result: false, message: "Catégorie non modifiée" });
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
 *    update if categorie is active
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
         UPDATE posts_categories SET isactive = NOT isactive WHERE categorie_id = ${id};`);
    if (datas.rowCount == 1) {
      const result = await client.query(`
            SELECT isactive FROM posts_categories WHERE categorie_id = ${id};`);
      res.json({
        result: true,
        message: "Catégorie modifiée",
        datas: result.rows,
      });
    } else {
      res.json({ result: false, message: "Catégorie non modifié" });
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
 * Delete categorie
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
         DELETE FROM posts_categories WHERE categorie_id = ${id};`);
    if (datas.rowCount == 1) {
      res.json({ result: true, message: "Catégorie supprimé" });
    } else {
      res.json({ result: false, message: "Catégorie non supprimé" });
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
