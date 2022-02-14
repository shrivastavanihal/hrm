const { Schema, model } = require("mongoose");

const EmpSchema = new Schema(
  {
    emp_id: {
      type: String,
      required: true,
    },
    emp_name: {
      type: String,
      required: true,
    },
    emp_skills: {
      type: [" "],
      required: true,
    },
    emp_phone: {
      type: Number,
      required: true,
    },

    emp_gen: {
      type: String,
      required: true,
      enum: ["male", "female","others"],
    },

    emp_edu: {
      type: String,
      required: true,
    },

    emp_exp: {
      type: Number,
      required: true,
    },

    emp_loc: {
      type: String,
      required: true,
    },

    emp_salary: {
      type: Number,
      required: true,
    },

    emp_des: {
      type: String,
      required: true,
    },
    emp_email: {
      type: String,
      required: true,
    },
    emp_photo: {
      type: [""],
      required: true,
      default: [
        "https://cdn-icons.flaticon.com/png/512/1144/premium/1144709.png?token=exp=1643956906~hmac=73efdb48532ec4a91d1dadf1c2682d1b",
      ],
    },
  },
  { timestamps: true }
);

module.exports = model("EmpSchema", EmpSchema);
