"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.update_question = exports.request_to_hire_graduate = exports.remove_question = exports.new_question = exports.hire_graduate_resolved = exports.get_request_to_hire_graduates = exports.find_admission_exam = exports.admission_questions = exports.admission_exam = void 0;
var _conn = require("../ds/conn");
var _functions = require("../functions");
var _emails = require("./emails");
var _users = require("./users");
var admission_questions = function admission_questions(req, res) {
  var _req$body = req.body,
    school = _req$body.school,
    limit = _req$body.limit;
  var pool = _conn.ADMISSION_QUESTIONS.read({
    school: school
  });
  var questions = new Array();
  if (limit) for (var l = 0; l < limit; l++) {
    if (!pool.length) break;
    questions.push(pool.splice((0, _functions.gen_random_int)(pool.length), 1)[0]);
  } else questions = pool;
  res.json({
    ok: true,
    message: "admission questions",
    data: {
      questions: questions
    }
  });
};
exports.admission_questions = admission_questions;
var new_question = function new_question(req, res) {
  var question = req.body;
  var result = _conn.ADMISSION_QUESTIONS.write(question);
  res.json({
    ok: true,
    message: "question inserted",
    data: {
      _id: result._id,
      created: result.created
    }
  });
};
exports.new_question = new_question;
var update_question = function update_question(req, res) {
  var question = req.body;
  var result = _conn.ADMISSION_QUESTIONS.update({
    _id: question._id,
    school: question.school
  }, question);
  res.json({
    ok: true,
    message: "question updated",
    data: {
      _id: result._id,
      created: result.created
    }
  });
};
exports.update_question = update_question;
var remove_question = function remove_question(req, res) {
  var _req$body2 = req.body,
    question = _req$body2.question,
    school = _req$body2.school;
  _conn.ADMISSION_QUESTIONS.remove({
    _id: question,
    school: school
  });
  res.end();
};
exports.remove_question = remove_question;
var admission_exam = function admission_exam(req, res) {
  var payload = req.body;
  var result = _conn.ADMISSION_EXAMS.write(payload);
  payload._id = result._id;
  payload.created = result.created;
  try {
    (0, _users.send_mail)({
      recipient: payload.email,
      recipient_name: (0, _users.to_title)("".concat(payload.firstname, " ").concat(payload.lastname)),
      sender: "signup@udaralinksapp.com",
      sender_pass: "signupudaralinks",
      sender_name: "Neovacity Africa",
      subject: "[Admissions - Neovacity Africa] Exam Details",
      html: (0, _emails.admission_exam_email)(payload)
    });
  } catch (e) {}
  res.json({
    ok: true,
    message: "admission exam",
    data: result
  });
};
exports.admission_exam = admission_exam;
var find_admission_exam = function find_admission_exam(req, res) {
  var _req$body3 = req.body,
    admission_id = _req$body3.admission_id,
    school = _req$body3.school,
    checking = _req$body3.checking;
  var exam = _conn.ADMISSION_EXAMS.readone({
    admission_id: admission_id,
    school: school
  });
  var data;
  if (exam) {
    if (!checking) data = exam;else {
      if (exam.used) data = {
        used: "Admission ID have already been used"
      };else data = {
        exam: exam._id
      };
    }
  } else data = {};
  res.json({
    ok: true,
    message: "admission exam",
    data: data
  });
};
exports.find_admission_exam = find_admission_exam;
var request_to_hire_graduate = function request_to_hire_graduate(req, res) {
  var details = req.body;
  details.resolved = false;
  var result = _conn.REQUESTS_TO_HIRE_GRADUATE.write(details);
  res.json({
    ok: true,
    message: "request to hire graduate",
    data: {
      _id: result._id
    }
  });
};
exports.request_to_hire_graduate = request_to_hire_graduate;
var get_request_to_hire_graduates = function get_request_to_hire_graduates(req, res) {
  var _req$body4 = req.body,
    limit = _req$body4.limit,
    skip = _req$body4.skip,
    resolved = _req$body4.resolved;
  var requests = _conn.REQUESTS_TO_HIRE_GRADUATE.read({
    resolved: resolved
  }, {
    skip: Number(skip),
    limit: Number(limit)
  });
  res.json({
    ok: true,
    message: "requests to hire graduate",
    data: requests
  });
};
exports.get_request_to_hire_graduates = get_request_to_hire_graduates;
var hire_graduate_resolved = function hire_graduate_resolved(req, res) {
  var request = req.params.request;
  _conn.REQUESTS_TO_HIRE_GRADUATE.update(request, {
    resolved: true
  });
  res.end();
};
exports.hire_graduate_resolved = hire_graduate_resolved;