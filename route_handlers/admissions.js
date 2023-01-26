import { ADMISSION_EXAMS, ADMISSION_QUESTIONS } from "../ds/conn";
import { gen_random_int } from "../functions";

const admission_questions = (req, res) => {
  let { school, limit } = req.body;

  console.log(school, limit);

  let pool = ADMISSION_QUESTIONS.read({ school });
  let questions = new Array();

  console.log(pool);

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

  res.json({ ok: true, message: "admission exam", data: result });
};

const find_admission_exam = (req, res) => {
  let { admission_id, school } = req.body;

  let exam = ADMISSION_EXAMS.readone({ admission_id, school });

  res.json({
    ok: true,
    message: "admission exam",
    data: checking ? { exam: exam && exam._id } : exam,
  });
};

export {
  update_question,
  admission_questions,
  new_question,
  admission_exam,
  remove_question,
  find_admission_exam,
};
