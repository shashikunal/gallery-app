const express = require("express");
const router = express.Router();
const multer = require("multer");
let { ensureAuthenticated } = require("../helpers/auth_helper");
const { storage } = require("../Config/multer");
console.log(storage);
const upload = multer({
  storage,
});

const GALLERY_SCHEMA = require("../Model/Gallery");
const USER = require("../Model/Auth");

/*-----------ALL  GET ROUTES-----------------*/
router.get("/create-gallery", ensureAuthenticated, (req, res) => {
  console.log(req.user);
  res.render("./gallery/CreateGallery");
});

router.get("/", ensureAuthenticated, async (req, res) => {
  let gallery = await GALLERY_SCHEMA.find({ user: req.user }).lean();
  res.render("./home", { gallery });
});
//all video and images

router.get("/all-galleries", async (req, res) => {
  let gallery = await GALLERY_SCHEMA.find().lean();
  res.render("./gallery/all-galleries", { gallery });
});

/*-----------ALL  POST ROUTES-----------------*/
router.post("/create-gallery", upload.single("photo"), async (req, res) => {
  try {
    let { photo_name, photo_description } = req.body;
    let video = "";
    if (req.file.mimetype === "video/webm") {
      video = req.file;
    }

    console.log(video);

    let newGallery = {
      video: video,
      photo: req.file,
      photo_name,
      photo_description,
      user: req.user,
    };
    await new GALLERY_SCHEMA(newGallery).save();
    req.flash("SUCCESS_MESSAGE", "successfully Gallery created");
    res.redirect("/gallery", 302, () => {});
  } catch (err) {
    console.log(err);
  }
});
/*-----------ALL  PUT ROUTES-----------------*/
/*-----------ALL  DELETE ROUTES-----------------*/

module.exports = router;
