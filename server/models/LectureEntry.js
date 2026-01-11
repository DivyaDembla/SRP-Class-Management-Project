const mongoose = require("mongoose");

const LectureEntrySchema = new mongoose.Schema(
  {
    teacher: { type: String, required: true },
    date: { type: String, required: true },
    className: { type: String, required: true },
    section: { type: String, required: true },
    subject: { type: String, required: true },
    chapterName: { type: String, required: true },
    topicDescription: String,
    timeFrom: { type: String, required: true },
    timeTo: { type: String, required: true },
    remarks: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("LectureEntry", LectureEntrySchema);
