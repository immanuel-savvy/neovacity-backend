import fs from "fs";
import { generate_random_string } from "generalised-datastore/utils/functions";
import {
  SCHOOLS,
  COURSES,
  COURSE_REVIEWS,
  CURRICULUM,
  WEEKS,
  STUDENT_COURSES,
  USERS,
  ENROLLMENTS,
  USERS_HASH,
  LECTURE_VIDEOS,
  LECTURE_URLS,
} from "../ds/conn";
import { course_enrolled, user_generated } from "./emails";
import { send_mail, to_title } from "./users";

const course = (req, res) => {
  let { course_id } = req.params;

  let course = COURSES.readone(course_id);

  course
    ? res.json({ ok: true, message: "course found", data: course })
    : res.json({ ok: false, message: "course not found", data: course_id });
};

const schools = (req, res) => {
  let { limit } = req.params;

  let schools_ = SCHOOLS.read(null, { limit: Number(limit) });

  for (let s = 0; s < schools_.length; s++)
    schools_[s].courses = COURSES.read(schools_[s].courses);

  res.json({ ok: true, message: "schools fetched", data: schools_ });
};

const create_school = (req, res) => {
  let school = req.body;

  school.image = save_image(school.image);
  school.title = school.title.replace(/ /g, "_");

  let result = SCHOOLS.write(school);
  school._id = result._id;
  school.created = result.created;

  res.json({ ok: true, message: "master course created", data: school });
};

const add_course = (req, res) => {
  let { course } = req.body;

  course.image = save_image(course.image);
  course.banner_image = save_image(course.banner_image);

  let result = COURSES.write(course);
  course._id = result._id;
  course.created = result.created;
  course.updated = result.updated;

  course.schools &&
    course.schools.length &&
    SCHOOLS.update_several(course.schools, {
      courses: { $push: course._id },
    });

  res.json({ ok: true, message: "course added", data: course });
};

const clean_course = (courses) => courses;

const courses = (req, res) => {
  let { filter, total_courses, skip, limit } = req.body;
  let search_param;
  if (filter) {
    if (filter.school) {
      filter.master_courses = filter.school;
      delete filter.school;
    }
    search_param = filter.search_param;
    delete filter.search_param;
  }

  let courses = COURSES.read(filter, { limit, skip, search_param });

  courses = clean_course(courses);

  if (total_courses)
    courses = { courses, total_courses: COURSES.config.total_entries };

  res.json({ ok: true, message: "courses fetched", data: courses });
};

const search_courses = (req, res) => {
  let { search_param } = req.body;

  let results = COURSES.read(null, { search_param });
  results = clean_course(results);

  res.json({ ok: true, message: "course search results", data: results });
};

const remove_course = (req, res) => {
  let { course } = req.params;

  let course_ = COURSES.remove(course);

  course_ &&
    course_.schools &&
    course_.schools.length &&
    SCHOOLS.update_several(course_.schools, {
      courses: { $splice: course },
    });

  remove_image(course.image);
  remove_image(course.banner_image);

  COURSE_REVIEWS.remove_several({ course });

  res.json({ ok: true, message: "course removed", data: course });
};

const remove_school = (req, res) => {
  let { school } = req.params;

  let school_ = SCHOOLS.remove(school);
  school_ && school_.image && remove_image(school_.image);

  res.json({ ok: true, message: "master course removed", data: school });
};

const update_course = (req, res) => {
  let { course } = req.body;

  let course_id = course._id;
  delete course._id;
  delete course.created;
  delete course.updated;

  let course_prev = COURSES.readone(course_id);

  if (course_prev.schools.length) {
    SCHOOLS.update_several(course_prev.schools, {
      courses: { $splice: course_id },
    });
  }

  course.schools.length &&
    SCHOOLS.update_several(course.schools, {
      courses: { $push: course_id },
    });

  course.image = save_image(course.image);

  COURSES.update(course_id, course);

  res.json({ ok: true, message: "course updated", data: { _id: course_id } });
};

const update_school = (req, res) => {
  let { _id, image, instructor, title, tags, short_description } = req.body;
  image = save_image(image);

  let school_ = SCHOOLS.readone(_id);
  SCHOOLS.update(_id, {
    title,
    short_description,
    tags,
    image,
    instructor,
  });

  res.json({ ok: true, message: "school updated", data: _id });
};

const curriculum = (req, res) => {
  let { course } = req.params;

  let curriculum_ = CURRICULUM.readone({ course });
  if (curriculum_)
    curriculum_.weeks = curriculum_.weeks.map((week) => {
      if (typeof week === "string") week = WEEKS.readone(week);
      return week;
    });

  res.json({
    ok: true,
    message: "course curriculum",
    data: curriculum_,
  });
};

const add_slide = (req, res) => {
  let { topic, course, subtopics } = req.body;

  let result = CURRICULUM.write({ course, topic, subtopics });
  COURSES.update(course, { lectures: { $inc: 1 } });

  res.json({
    ok: true,
    message: "slide inserted",
    data: { _id: result._id, created: result.created },
  });
};

const remove_slide = (req, res) => {
  let { slide, course } = req.body;

  CURRICULUM.remove({ _id: slide, course });
  COURSES.update(course, { lectures: { $dec: 1 } });

  res.end();
};

const update_slide = (req, res) => {
  let { _id, course, topic, subtopics } = req.body;

  let slide = CURRICULUM.readone({ _id, course });

  CURRICULUM.update({ _id, course }, { topic, subtopics });

  res.json({
    ok: true,
    message: "slide updated",
    data: { _id, course },
  });
};

const course_reviews = (req, res) => {
  let { course, limit, pager, reset_pager } = req.body;

  let reviews = COURSE_REVIEWS.read(
    { course },
    { limit, paging: pager, reset_pager }
  );

  res.json({ ok: true, message: "course reviews", data: reviews });
};

const post_review = (req, res) => {
  let { review } = req.body;

  let result = COURSE_REVIEWS.write(review);
  if (!result) return res.end();

  review._id = result._id;
  review.created = result.created;
  review.updated = result.updated;

  res.json({ ok: true, message: "review posted", data: review });
};

const review_like = (req, res) => {
  let { review, course } = req.params;

  COURSE_REVIEWS.update({ _id: review, course }, { likes: { $inc: 1 } });
  res.json({ ok: true, message: "review liked", data: review });
};

const review_unlike = (req, res) => {
  let { review, course } = req.params;

  COURSE_REVIEWS.update({ _id: review, course }, { unlikes: { $inc: 1 } });
  res.json({ ok: true, message: "review unliked", data: review });
};

const review_heart = (req, res) => {
  let { review, course } = req.params;

  COURSE_REVIEWS.update({ _id: review, course }, { hearts: { $inc: 1 } });
  res.json({ ok: true, message: "review hearted", data: review });
};

const update_course_image_hash = (req, res) => {
  let { course, image_hash } = req.body;

  COURSES.update(course, { image_hash });
  res.end();
};

const update_school_image_hash = (req, res) => {
  let { course, image_hash } = req.body;

  SCHOOLS.update(course, { image_hash });
  res.end();
};

const update_week = (req, res) => {
  let { week } = req.body;
};

const new_week = (req, res) => {
  let { week, dow } = req.body;

  week.lectures = week.lectures.map((lecture) => {
    if (lecture.resource && lecture.resource.startsWith("data")) {
      lecture.resource = save_file(
        lecture.resource,
        lecture.resource_file_name
      );
    }

    return lecture;
  });

  let result = WEEKS.write(week);
  week._id = result._id;
  week.created = result.created;

  let curr = CURRICULUM.readone({ course: week.course });
  if (curr)
    CURRICULUM.update(
      { _id: curr._id, course: week.course },
      { weeks: { $push: result._id }, dow }
    );
  else CURRICULUM.write({ course: week.course, weeks: [result._id], dow });

  COURSES.update(week.course, { lectures: { $inc: week.lectures.length } });

  res.json({ ok: true, message: "ok", data: { week } });
};

const delete_week = (req, res) => {
  let { week, course } = req.body;

  CURRICULUM.update_several({ course }, { weeks: { $splice: week } });
  let week_ = WEEKS.remove(week);

  if (week_ && week_.lectures) {
    week_.lectures.map(
      (lecture) => lecture.resource && remove_file(lecture.resource)
    );

    COURSES.update(course, { lectures: { $dec: week_.lectures.length } });
  }

  res && res.end();
};

let strip_length = 14,
  prefix = "neovacity_africa";

const save_image = (base64_image, image_name) => {
  if (!base64_image || (base64_image && !base64_image.startsWith("data")))
    return base64_image;

  image_name = `${prefix}_${image_name || Date.now()}${
    image_name ? "" : generate_random_string(6, "alpha")
  }.jpg`;
  let image_path =
    __dirname.slice(0, __dirname.length - strip_length) +
    `Assets/Images/${image_name}`;
  fs.writeFileSync(
    image_path,
    Buffer.from(base64_image.slice(base64_image.indexOf(",")), "base64")
  );

  return image_name;
};

const save_file = (base64_file, file_name) => {
  if (!base64_file || (base64_file && !base64_file.startsWith("data")))
    return base64_file;

  file_name = `${prefix}_${
    file_name ? file_name.split(".")[0] + `-${Date.now()}` : Date.now()
  }${file_name ? "" : generate_random_string(6, "alpha")}.${
    file_name.split(".").slice(-1)[0]
  }`;
  let file_path =
    __dirname.slice(0, __dirname.length - strip_length) +
    `Assets/Files/${file_name}`;
  fs.writeFileSync(
    file_path,
    Buffer.from(base64_file.slice(base64_file.indexOf(",")), "base64")
  );

  return file_name;
};

const save_video = (base6_video) => {
  if (!base6_video || (base6_video && !base6_video.startsWith("data")))
    return base6_video;

  let video_name = `${prefix}_${Date.now()}${generate_random_string(
    6,
    "alpha"
  )}.mp4`;
  let video_path =
    __dirname.slice(0, __dirname.length - strip_length) +
    `Assets/Videos/${video_name}`;
  fs.writeFileSync(
    video_path,
    Buffer.from(base6_video.slice(base6_video.indexOf(",")), "base64")
  );

  return video_name;
};

const remove_image = (image) => {
  if (image === "user_image_placeholder.png" || !image) return;

  try {
    let image_path =
      __dirname.slice(0, __dirname.length - strip_length) +
      `Assets/Images/${image}`;
    fs.unlinkSync(image_path);
  } catch (e) {}
};

const remove_file = (file) => {
  if (file === "user_image_placeholder.png" || !file) return;

  try {
    let file_path =
      __dirname.slice(0, __dirname.length - strip_length) +
      `Assets/Files/${file}`;
    fs.unlinkSync(file_path);
  } catch (e) {}
};

const remove_video = (video) => {
  if (video === "user_image_placeholder.png" || !video) return;

  try {
    let video_path =
      __dirname.slice(0, __dirname.length - strip_length) +
      `Assets/Videos/${video}`;
    fs.unlinkSync(video_path);
  } catch (e) {}
};

const get_student_courses = (req, res) => {
  let { student } = req.params;

  let courses = STUDENT_COURSES.read({ student });

  res.json({ ok: true, data: courses, message: "student courses" });
};

const create_user = ({ email, firstname, lastname }) => {
  let user = { firstname, lastname, email, verified: true };

  let user_res = USERS.write(user);
  user._id = user_res._id;
  user.created = user_res.created;

  let key = generate_random_string(8, "alnum");
  USERS_HASH.write({ user: user._id, key });

  try {
    send_mail({
      recipient: email,
      recipient_name: to_title(`${firstname} ${lastname}`),
      sender: "signup@udaralinksapp.com",
      sender_pass: "signupudaralinks",
      sender_name: "Neovacity Africa",
      subject: `[Neovacity Africa] Profile Details`,
      html: user_generated(user, key),
    });
  } catch (e) {}

  return user;
};

const register_course = (req, res) => {
  let { course, email, phone, student, firstname, set, lastname } = req.body;
  if (!student) {
    student = USERS.readone({ email });
    if (!student) student = create_user({ email, firstname, lastname });
  } else student = USERS.readone(student);

  let course_ = COURSES.update(course, { enrollments: { $inc: 1 } });
  ENROLLMENTS.write({ course, phone, student: student._id, set });

  STUDENT_COURSES.write({
    student: student._id,
    course,
  });

  USERS.update(student._id, { courses_enrolled: { $inc: 1 } });

  try {
    send_mail({
      recipient: email,
      recipient_name: to_title(`${firstname} ${lastname}`),
      sender: "signup@udaralinksapp.com",
      sender_pass: "signupudaralinks",
      sender_name: "Neovacity Africa",
      subject: `[Neovacity Africa] Course Enrollment - ${course_.title}`,
      html: course_enrolled(course, student, set),
    });
  } catch (e) {}

  res.json({
    ok: true,
    message: "course enrolled by student",
    data: { user: student, set },
  });
};

const lecture_video_upload = (req, res) => {
  let payload = req.body;

  payload.thumbnail = save_image(payload.thumbnail);

  let result = LECTURE_VIDEOS.write(payload);
  payload._id = result._id;
  payload.created = result.created;

  res.json({ ok: true, message: "lecture video upload", data: payload });
};

const lecture_video_update = (req, res) => {
  let payload = req.body;

  payload.thumbnail = save_image(payload.thumbnail);

  let result = LECTURE_VIDEOS.update(
    { course: payload.course, _id: payload._id },
    { ...payload }
  );
  payload._id = result._id;
  payload.created = result.created;

  res.json({ ok: true, message: "lecture video updated", data: payload });
};

const fetch_lecture_video_url = (req, res) => {
  let { course, outline, set } = req.body;

  res.json({
    ok: true,
    message: "video url",
    data: LECTURE_VIDEOS.readone({ course, outline, set }),
  });
};

const update_lecture_url = (req, res) => {
  let payload = req.body;

  let result = LECTURE_URLS.update(
    { course: payload.course, _id: payload._id },
    { ...payload }
  );
  payload._id = result._id;
  payload.created = result.created;

  res.json({ ok: true, message: "lecture url updated", data: payload });
};

const upload_lecture_url = (req, res) => {
  let payload = req.body;

  let result = LECTURE_URLS.write(payload);
  payload._id = result._id;
  payload.created = result.created;

  res.json({ ok: true, message: "lecture url upload", data: payload });
};

const fetch_lecture_url = (req, res) => {
  let { course, outline, set } = req.body;

  res.json({
    ok: true,
    message: "lecture url",
    data: LECTURE_URLS.readone({ course, outline, set }),
  });
};

const student_already_enrolled = (req, res) => {
  let { email, student, course } = req.body,
    enrolled;

  if (!student) {
    student = USERS.readone({ email });
    student = student && student._id;

    if (!student) enrolled = false;
  }
  if (student) {
    enrolled = !!STUDENT_COURSES.readone({ student, course });
  }

  res.json({
    ok: true,
    message: "student_already_enrolled",
    data: { enrolled },
  });
};

export {
  new_week,
  delete_week,
  update_week,
  save_file,
  get_student_courses,
  register_course,
  fetch_lecture_url,
  upload_lecture_url,
  update_lecture_url,
  save_image,
  student_already_enrolled,
  fetch_lecture_video_url,
  lecture_video_update,
  lecture_video_upload,
  save_video,
  remove_image,
  remove_file,
  remove_video,
  course,
  schools,
  create_school,
  add_course,
  add_slide,
  remove_course,
  remove_school,
  course_reviews,
  courses,
  search_courses,
  update_course,
  update_school_image_hash,
  update_school,
  curriculum,
  update_slide,
  remove_slide,
  post_review,
  review_like,
  review_heart,
  review_unlike,
  update_course_image_hash,
};
