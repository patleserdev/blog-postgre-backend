var express = require("express");
var router = express.Router();
const {checkId} = require("../modules/checkId")
const {checkBody} = require("../modules/checkBody")
const client = require("../db");

const fs = require("fs");
const cloudinary = require("cloudinary").v2;

/**
 *  get all posts
 */
router.get("/", async (req, res) => {
  try {
    const datas = await client.query("SELECT * FROM posts");
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
 * Get one post
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
         SELECT * FROM posts WHERE post_id=${req.params.id};
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
 * Post post
 */

router.post("/", async (req, res) => {

  if (!checkBody(req.body, ['title','content','categorie'])) {
    res.json({ result: false, error: 'Champs vides ou invalides' });
    return;
  }

  var formattedTitle = encodeURI(req.body.title);
  var formattedContent = encodeURI(req.body.content);
  const newPost = {
    title: formattedTitle,
    content: formattedContent,
    categorie:req.body.categorie,
    picture_url:req.body.picture_url
  };

  const query =
    "INSERT INTO posts (title,content,categorie_id,isDestroyed,isArchived,picture_url) VALUES ($1, $2,$3, DEFAULT, DEFAULT,$4) RETURNING post_id;";
  const values = [newPost.title, newPost.content,newPost.categorie,newPost.picture_url];

  try {
    const datas = await client.query(query, values);

    if (datas.rowCount == 1) {
      res.json({ result: true, message: "Post ajouté" });
    } else {
      res.json({ result: false, message: "Post non ajouté" });
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
 *    permet d'ajouter un fichier stocké dans cloudinary
 */
// ${URL}/protected/addfile
router.post("/addfile", (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send({ message: "No files were uploaded." });
  }

  let uploadedFile = req.files.file;
  // Uploader directement depuis le buffer du fichier
  cloudinary.uploader
    .upload_stream(
      {
        folder: "blog",
        resource_type: "auto",
        transformation: [{ aspect_ratio: "1.0", height: 800, crop: "fit" }],
      },
      (error, result) => {
        if (error) {
          return res
            .status(500)
            .send({ error: "Failed to upload to Cloudinary", details: error });
        }
        // console.log('resultCloudinary',result)
        res.json({
          result: true,
          url: result.secure_url,
          publicid: result.public_id,
        });
      }
    )
    .end(uploadedFile.data); // Envoyer le buffer directement à Cloudinary

});

/**
 * Put post
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
    categorie:req.body.categorie
  };

  const query = `UPDATE posts SET title = $1 , content = $2 , categorie_id = $3 WHERE post_id = ${id};`;
  const values = [editPost.title, editPost.content,editPost.categorie];
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
 *    update if post is destroy
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
 *    update if post is archived
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
 * Delete post
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
