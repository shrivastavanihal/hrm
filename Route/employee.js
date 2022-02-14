//router level middleware
const { Router } = require("express");
const multer = require("multer");
const EMPLOYEE_SCHEMA = require("../Model/Employee");
const {ensureAuthenticated} = require("../helper/authHelper")

const router = Router(); //top-level function

let { storage } = require("../middlewares/multer");
const upload = multer({ storage: storage });

/*@HTTP GET METHOD
  @ACCESS PUBLIC
  @URL employee/home
*/
router.get("/home", async (req, res) => {
  // res.render("../views/home", { title: "HOME PAGE" });
  let payload = await EMPLOYEE_SCHEMA.find({}).lean();
  res.render("../views/home", { title: "home page", payload });
});

/*@HTTP GET METHOD
  @ACCESS PUBLIC
  @URL employee/emp-profile
*/
router.get("/emp-profile", ensureAuthenticated, async (req, res) => {
  let payload = await EMPLOYEE_SCHEMA.find({ user: req.user.id }).lean();
  res.render("../views/employees/emp-profile", { payload });
})

/*@HTTP GET METHOD
  @ACCESS PRIVATE
  @URL employee/create-map
*/
router.get("/create-emp", ensureAuthenticated ,  (req, res) => {
  res.render("../views/employees/create-emp", { title: "HOME PAGE" });
});


/*@HTTP GET METHOD using slug
  @ACCESS PUBLIC
  @URL employee/id
*/
router.get("/:id",  async (req, res) => {
  // console.log(req.path);
  // console.log(req.params.name);
  // res.send("ok");
  let payload = await EMPLOYEE_SCHEMA.findOne({ _id: req.params.id }).lean();
  res.render("../views/employees/empProfile", { payload });
  // console.log(payload);
});

/*@HTTP GET METHOD
  @ACCESS PRIVATE
  @URL employee/create-map
*/
router.get("/edit-emp/:id", ensureAuthenticated, async (req, res) => {
  let editPayload = await EMPLOYEE_SCHEMA.findOne({
    _id: req.params.id,
  }).lean(); //to display
  res.render("../views/employees/editEmp", { editPayload });
});
/*===========END ALL GET METHODS===========*/

/*============START ALL POST METHODS=================*/
/*@HTTP POST METHOD
  @ACCESS PRIVATE
  @URL employee/create-map
*/
router.post("/create-emp", upload.single("emp_photo"), async (req, res) => {
  let {
    emp_id,
    emp_name,
    emp_skills,
    emp_phone,
    emp_gen,
    emp_edu,
    emp_exp,
    emp_loc,
    emp_des,
    emp_email,
    emp_salary,
  } = req.body;

  let payload = {
    emp_photo: req.file,
    emp_id,
    emp_name,
    emp_skills,
    emp_gen,
    emp_phone,
    emp_email,
    emp_edu,
    emp_exp,
    emp_loc,
    emp_salary,
    emp_des,
    user : req.user.id,
  };

  let body = await EMPLOYEE_SCHEMA.create(payload);
  req.flash("SUCCESS_MESSAGE", "succesfuly employee created");
  res.redirect("/employee/home", 302, { body });
});
//==============End all POST methods=========

//*=====================PUT request starts here============
router.put("/edit-emp/:id", upload.single("emp_photo"), (req, res) => {
  // res.send("ok");
  EMPLOYEE_SCHEMA.findOne({ _id: req.params.id })
    .then(editEmp => {
      //old                  //new
      (editEmp.emp_photo = req.file),
        (editEmp.emp_id = req.body.emp_id),
        (editEmp.emp_salary = req.body.emp_salary),
        (editEmp.emp_edu = req.body.emp_edu),
        (editEmp.emp_email = req.body.emp_email),
        (editEmp.emp_phone = req.body.emp_phone),
        (editEmp.emp_loc = req.body.emp_loc),
        (editEmp.emp_skills = req.body.emp_skills),
        (editEmp.emp_des = req.body.emp_des),
        (editEmp.emp_exp = req.body.emp_exp),
        // (editEmp.emp_gen = req.body.emp_gen);
        //update data in database
        editEmp.save().then(_ => {
          req.flash("SUCCESS_MESSAGE", "succesfuly employee edited");
          res.redirect("/employee/home", 302, {});
        });
    })
    .catch(err => {
      req.flash("ERROR_MESSAGE", "something went wrong");
      console.log(err);
    });
});
//*=====================PUT request ends here==============

//*====================DELETE REQUEST START HERE ==========*/
router.delete("/delete-emp/:id", async (req, res) => {
  await EMPLOYEE_SCHEMA.deleteOne({ _id: req.params.id });
  req.flash("SUCCESS_MESSAGE", "succesfully employee deleted");
  res.redirect("/employee/home", 302, {});
});
//*=================DELETE REQUEST END HERE ==================*/

module.exports = router;
