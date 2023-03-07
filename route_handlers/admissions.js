import {
  ADMISSION_EXAMS,
  ADMISSION_QUESTIONS,
  REQUESTS_TO_HIRE_GRADUATE,
} from "../ds/conn";
import { gen_random_int } from "../functions";
import { admission_exam_email } from "./emails";
import { send_mail, to_title } from "./users";

const admission_questions = (req, res) => {
  let { school, limit } = req.body;

  let pool = ADMISSION_QUESTIONS.read({ school });
  let questions = new Array();

  if (limit)
    for (let l = 0; l < limit; l++) {
      if (!pool.length) break;

      questions.push(pool.splice(gen_random_int(pool.length), 1)[0]);
    }
  else questions = pool;

  res.json({ ok: true, message: "admission questions", data: { questions } });
};

const new_question = (req, res) => {
  let question = req.body;

  let result = ADMISSION_QUESTIONS.write(question);

  res.json({
    ok: true,
    message: "question inserted",
    data: { _id: result._id, created: result.created },
  });
};

const update_question = (req, res) => {
  let question = req.body;

  let result = ADMISSION_QUESTIONS.update(
    { _id: question._id, school: question.school },
    question
  );

  res.json({
    ok: true,
    message: "question updated",
    data: { _id: result._id, created: result.created },
  });
};

const remove_question = (req, res) => {
  let { question, school } = req.body;

  ADMISSION_QUESTIONS.remove({ _id: question, school });

  res.end();
};

const admission_exam = (req, res) => {
  let payload = req.body;

  let result = ADMISSION_EXAMS.write(payload);
  payload._id = result._id;
  payload.created = result.created;

  try {
    send_mail({
      recipient: payload.email,
      recipient_name: to_title(`${payload.firstname} ${payload.lastname}`),
      sender: "signup@udaralinksapp.com",
      sender_pass: "signupudaralinks",
      sender_name: "Neovacity Africa",
      subject: `[Admissions - Neovacity Africa] Exam Details`,
      html: admission_exam_email(payload),
    });
  } catch (e) {}

  res.json({ ok: true, message: "admission exam", data: result });
};

const find_admission_exam = (req, res) => {
  let { admission_id, school, checking } = req.body;

  let exam = ADMISSION_EXAMS.readone({ admission_id, school });

  let data;
  if (exam) {
    if (!checking) data = exam;
    else {
      if (exam.used) data = { used: "Admission ID have already been used" };
      else data = { exam: exam._id };
    }
  } else data = {};

  res.json({
    ok: true,
    message: "admission exam",
    data,
  });
};

const request_to_hire_graduate = (req, res) => {
  let details = req.body;

  details.resolved = false;
  let result = REQUESTS_TO_HIRE_GRADUATE.write(details);

  res.json({
    ok: true,
    message: "request to hire graduate",
    data: { _id: result._id },
  });
};

const get_request_to_hire_graduates = (req, res) => {
  let { limit, skip, resolved } = req.body;

  let requests = REQUESTS_TO_HIRE_GRADUATE.read(
    { resolved },
    { skip: Number(skip), limit: Number(limit) }
  );

  res.json({ ok: true, message: "requests to hire graduate", data: requests });
};

const hire_graduate_resolved = (req, res) => {
  let { request } = req.params;

  REQUESTS_TO_HIRE_GRADUATE.update(request, { resolved: true });

  res.end();
};

export {
  update_question,
  get_request_to_hire_graduates,
  admission_questions,
  new_question,
  admission_exam,
  remove_question,
  find_admission_exam,
  request_to_hire_graduate,
  hire_graduate_resolved,
};
