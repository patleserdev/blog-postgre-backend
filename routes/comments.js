var express = require("express");
var router = express.Router();
const {checkId} = require("../modules/checkId")
const {checkBody} = require("../modules/checkBody")
const client = require("../db");
/**
 *  get all comments
 */
router.get("/", async (req, res) => {
  try {
    const datas = await client.query("SELECT * FROM comments");
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
 * Get one comment
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
    const datas = await client.query(`SELECT * FROM comments WHERE comment_id=${id};`);
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
 * Get all comments for a post
 * id = post_id
 */
router.get("/bypost/:id", async (req, res) => {

  const id = Number(req.params.id);
  // Check id is a number
  const isValid=checkId(id)
  if(!isValid)
  {
    return res.json({result:false,error: "L'identifiant est invalide"})
  }

  try {
    const datas = await client.query(`
         SELECT * FROM comments WHERE post_id=${id};
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
 * Get all comments for an user
 * id = user_id
 */
router.get("/byuser/:id", async (req, res) => {

  const id = Number(req.params.id);
  // Check id is a number
  const isValid=checkId(id)
  if(!isValid)
  {
    return res.json({result:false,error: "L'identifiant est invalide"})
  }

  try {
    const datas = await client.query(`
         SELECT * FROM comments WHERE user_id=${id};
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
 * Post comment
 */

router.post("/", async (req, res) => {

  if (!checkBody(req.body, ['title', 'content'])) {
    res.json({ result: false, error: 'Champs vides ou invalides' });
    return;
  }

  var formattedTitle = encodeURI(req.body.title);
  var formattedContent = encodeURI(req.body.content);

  const user = Number(req.body.user);
  if (typeof user != "number") {
    return res.json({
      result: false,
      error: "L'identifiant User est incohérent",
    });
  }

  const post = Number(req.body.post);
  if (typeof post != "number") {
    return res.json({
      result: false,
      error: "L'identifiant Post est incohérent",
    });
  }

  const newComment = {
    title: formattedTitle,
    content: formattedContent,
    user: user,
    post: post,
  };

  const query =
    "INSERT INTO comments (title,content,isDestroyed,isArchived,user_id,post_id) VALUES ($1, $2, DEFAULT, DEFAULT,$3,$4) RETURNING comment_id;";
  const values = [
    newComment.title,
    newComment.content,
    newComment.user,
    newComment.post,
  ];

  try {
    const datas = await client.query(query, values);

    if (datas.rowCount == 1) {
      res.json({ result: true, message: "Commentaire ajouté" });
    } else {
      res.json({ result: false, message: "Commentaire non ajouté" });
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
 * Put comment
 */
router.put("/:id", async (req, res) => {

  if (!checkBody(req.body, ['title','content'])) {
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
  var formattedContent = encodeURI(req.body.content);
  const editPost = {
    title: formattedTitle,
    content: formattedContent,
  };

  const query = `UPDATE posts SET title = $1 , content = $2 WHERE post_id = ${id};`;
  const values = [editPost.title, editPost.content];
  try {
    const datas = await client.query(query, values);

    if (datas.rowCount == 1) {
      res.json({ result: true, message: "Post modifié" });
    } else {
      res.json({ result: false, message: "Post non modifié" });
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
 *    update if comment is destroy
 * */
router.put("/isdestroyed/:id", async (req, res) => {

    const id = Number(req.params.id);
    // Check id is a number
    const isValid=checkId(id)
    if(!isValid)
    {
      return res.json({result:false,error: "L'identifiant est invalide"})
    }

  try {
    const datas = await client.query(`
         UPDATE posts SET isdestroyed = NOT isdestroyed WHERE post_id = ${id};`);
    if (datas.rowCount == 1) {
      const result = await client.query(`
            SELECT isdestroyed FROM posts WHERE post_id = ${id};`);
      res.json({
        result: true,
        message: "Post modifié",
        datas: result.rows,
      });
    } else {
      res.json({ result: false, message: "Post non modifié" });
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
 *    update if comment is archived
 * */
router.put("/isarchived/:id", async (req, res) => {

    const id = Number(req.params.id);
    // Check id is a number
    const isValid=checkId(id)
    if(!isValid)
    {
      return res.json({result:false,error: "L'identifiant est invalide"})
    }

  try {
    const datas = await client.query(`
         UPDATE posts SET isarchived = NOT isarchived WHERE post_id = ${id};`);
    if (datas.rowCount == 1) {
      const result = await client.query(`
            SELECT isarchived FROM posts WHERE post_id = ${id};`);
      res.json({
        result: true,
        message: "Post modifié",
        datas: result.rows,
      });
    } else {
      res.json({ result: false, message: "Post non modifié" });
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
 * Delete comment
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
         DELETE FROM posts WHERE post_id = ${id};`);
    if (datas.rowCount == 1) {
      res.json({ result: true, message: "Post supprimé" });
    } else {
      res.json({ result: false, message: "Post non supprimé" });
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
