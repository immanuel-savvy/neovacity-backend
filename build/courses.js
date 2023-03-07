"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.upload_lecture_url = exports.update_week = exports.update_slide = exports.update_school_image_hash = exports.update_school = exports.update_lecture_url = exports.update_course_image_hash = exports.update_course = exports.student_already_enrolled = exports.search_courses = exports.schools = exports.save_video = exports.save_image = exports.save_file = exports.review_unlike = exports.review_like = exports.review_heart = exports.remove_video = exports.remove_slide = exports.remove_school = exports.remove_image = exports.remove_file = exports.remove_course = exports.register_course = exports.post_review = exports.new_week = exports.lecture_video_upload = exports.lecture_video_update = exports.get_student_courses = exports.fetch_lecture_video_url = exports.fetch_lecture_url = exports.delete_week = exports.curriculum = exports.create_school = exports.courses = exports.course_reviews = exports.course = exports.add_slide = exports.add_course = void 0;
var _fs = _interopRequireDefault(require("fs"));
var _functions = require("generalised-datastore/utils/functions");
var _conn = require("../ds/conn");
var _emails = require("./emails");
var _users = require("./users");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var course = function course(req, res) {
  var course_id = req.params.course_id;
  var course = _conn.COURSES.readone(course_id);
  course ? res.json({
    ok: true,
    message: "course found",
    data: course
  }) : res.json({
    ok: false,
    message: "course not found",
    data: course_id
  });
};
exports.course = course;
var schools = function schools(req, res) {
  var limit = req.params.limit;
  var schools_ = _conn.SCHOOLS.read(null, {
    limit: Number(limit)
  });
  for (var s = 0; s < schools_.length; s++) {
    schools_[s].courses = _conn.COURSES.read(schools_[s].courses);
  }
  res.json({
    ok: true,
    message: "schools fetched",
    data: schools_
  });
};
exports.schools = schools;
var create_school = function create_school(req, res) {
  var school = req.body;
  school.image = save_image(school.image);
  school.title = school.title.replace(/ /g, "_");
  var result = _conn.SCHOOLS.write(school);
  school._id = result._id;
  school.created = result.created;
  res.json({
    ok: true,
    message: "master course created",
    data: school
  });
};
exports.create_school = create_school;
var add_course = function add_course(req, res) {
  var course = req.body.course;
  course.image = save_image(course.image);
  course.banner_image = save_image(course.banner_image);
  var result = _conn.COURSES.write(course);
  course._id = result._id;
  course.created = result.created;
  course.updated = result.updated;
  course.schools && course.schools.length && _conn.SCHOOLS.update_several(course.schools, {
    courses: {
      $push: course._id
    }
  });
  res.json({
    ok: true,
    message: "course added",
    data: course
  });
};
exports.add_course = add_course;
var clean_course = function clean_course(courses) {
  return courses;
};
var courses = function courses(req, res) {
  var _req$body = req.body,
    filter = _req$body.filter,
    total_courses = _req$body.total_courses,
    skip = _req$body.skip,
    limit = _req$body.limit;
  var search_param;
  if (filter) {
    if (filter.school) {
      filter.master_courses = filter.school;
      delete filter.school;
    }
    search_param = filter.search_param;
    delete filter.search_param;
  }
  var courses = _conn.COURSES.read(filter, {
    limit: limit,
    skip: skip,
    search_param: search_param
  });
  courses = clean_course(courses);
  if (total_courses) courses = {
    courses: courses,
    total_courses: _conn.COURSES.config.total_entries
  };
  res.json({
    ok: true,
    message: "courses fetched",
    data: courses
  });
};
exports.courses = courses;
var search_courses = function search_courses(req, res) {
  var search_param = req.body.search_param;
  var results = _conn.COURSES.read(null, {
    search_param: search_param
  });
  results = clean_course(results);
  res.json({
    ok: true,
    message: "course search results",
    data: results
  });
};
exports.search_courses = search_courses;
var remove_course = function remove_course(req, res) {
  var course = req.params.course;
  var course_ = _conn.COURSES.remove(course);
  course_ && course_.schools && course_.schools.length && _conn.SCHOOLS.update_several(course_.schools, {
    courses: {
      $splice: course
    }
  });
  remove_image(course.image);
  remove_image(course.banner_image);
  _conn.COURSE_REVIEWS.remove_several({
    course: course
  });
  res.json({
    ok: true,
    message: "course removed",
    data: course
  });
};
exports.remove_course = remove_course;
var remove_school = function remove_school(req, res) {
  var school = req.params.school;
  var school_ = _conn.SCHOOLS.remove(school);
  school_ && school_.image && remove_image(school_.image);
  res.json({
    ok: true,
    message: "master course removed",
    data: school
  });
};
exports.remove_school = remove_school;
var update_course = function update_course(req, res) {
  var course = req.body.course;
  var course_id = course._id;
  delete course._id;
  delete course.created;
  delete course.updated;
  var course_prev = _conn.COURSES.readone(course_id);
  if (course_prev.schools.length) {
    _conn.SCHOOLS.update_several(course_prev.schools, {
      courses: {
        $splice: course_id
      }
    });
  }
  course.schools.length && _conn.SCHOOLS.update_several(course.schools, {
    courses: {
      $push: course_id
    }
  });
  course.image = save_image(course.image);
  _conn.COURSES.update(course_id, course);
  res.json({
    ok: true,
    message: "course updated",
    data: {
      _id: course_id
    }
  });
};
exports.update_course = update_course;
var update_school = function update_school(req, res) {
  var _req$body2 = req.body,
    _id = _req$body2._id,
    image = _req$body2.image,
    instructor = _req$body2.instructor,
    title = _req$body2.title,
    tags = _req$body2.tags,
    short_description = _req$body2.short_description;
  image = save_image(image);
  var school_ = _conn.SCHOOLS.readone(_id);
  _conn.SCHOOLS.update(_id, {
    title: title,
    short_description: short_description,
    tags: tags,
    image: image,
    instructor: instructor
  });
  res.json({
    ok: true,
    message: "school updated",
    data: _id
  });
};
exports.update_school = update_school;
var curriculum = function curriculum(req, res) {
  var course = req.params.course;
  var curriculum_ = _conn.CURRICULUM.readone({
    course: course
  });
  if (curriculum_) curriculum_.weeks = curriculum_.weeks.map(function (week) {
    if (typeof week === "string") week = _conn.WEEKS.readone(week);
    return week;
  });
  res.json({
    ok: true,
    message: "course curriculum",
    data: curriculum_
  });
};
exports.curriculum = curriculum;
var add_slide = function add_slide(req, res) {
  var _req$body3 = req.body,
    topic = _req$body3.topic,
    course = _req$body3.course,
    subtopics = _req$body3.subtopics;
  var result = _conn.CURRICULUM.write({
    course: course,
    topic: topic,
    subtopics: subtopics
  });
  _conn.COURSES.update(course, {
    lectures: {
      $inc: 1
    }
  });
  res.json({
    ok: true,
    message: "slide inserted",
    data: {
      _id: result._id,
      created: result.created
    }
  });
};
exports.add_slide = add_slide;
var remove_slide = function remove_slide(req, res) {
  var _req$body4 = req.body,
    slide = _req$body4.slide,
    course = _req$body4.course;
  _conn.CURRICULUM.remove({
    _id: slide,
    course: course
  });
  _conn.COURSES.update(course, {
    lectures: {
      $dec: 1
    }
  });
  res.end();
};
exports.remove_slide = remove_slide;
var update_slide = function update_slide(req, res) {
  var _req$body5 = req.body,
    _id = _req$body5._id,
    course = _req$body5.course,
    topic = _req$body5.topic,
    subtopics = _req$body5.subtopics;
  var slide = _conn.CURRICULUM.readone({
    _id: _id,
    course: course
  });
  _conn.CURRICULUM.update({
    _id: _id,
    course: course
  }, {
    topic: topic,
    subtopics: subtopics
  });
  res.json({
    ok: true,
    message: "slide updated",
    data: {
      _id: _id,
      course: course
    }
  });
};
exports.update_slide = update_slide;
var course_reviews = function course_reviews(req, res) {
  var _req$body6 = req.body,
    course = _req$body6.course,
    limit = _req$body6.limit,
    pager = _req$body6.pager,
    reset_pager = _req$body6.reset_pager;
  var reviews = _conn.COURSE_REVIEWS.read({
    course: course
  }, {
    limit: limit,
    paging: pager,
    reset_pager: reset_pager
  });
  res.json({
    ok: true,
    message: "course reviews",
    data: reviews
  });
};
exports.course_reviews = course_reviews;
var post_review = function post_review(req, res) {
  var review = req.body.review;
  var result = _conn.COURSE_REVIEWS.write(review);
  if (!result) return res.end();
  review._id = result._id;
  review.created = result.created;
  review.updated = result.updated;
  res.json({
    ok: true,
    message: "review posted",
    data: review
  });
};
exports.post_review = post_review;
var review_like = function review_like(req, res) {
  var _req$params = req.params,
    review = _req$params.review,
    course = _req$params.course;
  _conn.COURSE_REVIEWS.update({
    _id: review,
    course: course
  }, {
    likes: {
      $inc: 1
    }
  });
  res.json({
    ok: true,
    message: "review liked",
    data: review
  });
};
exports.review_like = review_like;
var review_unlike = function review_unlike(req, res) {
  var _req$params2 = req.params,
    review = _req$params2.review,
    course = _req$params2.course;
  _conn.COURSE_REVIEWS.update({
    _id: review,
    course: course
  }, {
    unlikes: {
      $inc: 1
    }
  });
  res.json({
    ok: true,
    message: "review unliked",
    data: review
  });
};
exports.review_unlike = review_unlike;
var review_heart = function review_heart(req, res) {
  var _req$params3 = req.params,
    review = _req$params3.review,
    course = _req$params3.course;
  _conn.COURSE_REVIEWS.update({
    _id: review,
    course: course
  }, {
    hearts: {
      $inc: 1
    }
  });
  res.json({
    ok: true,
    message: "review hearted",
    data: review
  });
};
exports.review_heart = review_heart;
var update_course_image_hash = function update_course_image_hash(req, res) {
  var _req$body7 = req.body,
    course = _req$body7.course,
    image_hash = _req$body7.image_hash;
  _conn.COURSES.update(course, {
    image_hash: image_hash
  });
  res.end();
};
exports.update_course_image_hash = update_course_image_hash;
var update_school_image_hash = function update_school_image_hash(req, res) {
  var _req$body8 = req.body,
    course = _req$body8.course,
    image_hash = _req$body8.image_hash;
  _conn.SCHOOLS.update(course, {
    image_hash: image_hash
  });
  res.end();
};
exports.update_school_image_hash = update_school_image_hash;
var update_week = function update_week(req, res) {
  var week = req.body.week;
};
exports.update_week = update_week;
var new_week = function new_week(req, res) {
  var _req$body9 = req.body,
    week = _req$body9.week,
    dow = _req$body9.dow;
  week.lectures = week.lectures.map(function (lecture) {
    if (lecture.resource && lecture.resource.startsWith("data")) {
      lecture.resource = save_file(lecture.resource, lecture.resource_file_name);
    }
    return lecture;
  });
  var result = _conn.WEEKS.write(week);
  week._id = result._id;
  week.created = result.created;
  var curr = _conn.CURRICULUM.readone({
    course: week.course
  });
  if (curr) _conn.CURRICULUM.update({
    _id: curr._id,
    course: week.course
  }, {
    weeks: {
      $push: result._id
    },
    dow: dow
  });else _conn.CURRICULUM.write({
    course: week.course,
    weeks: [result._id],
    dow: dow
  });
  _conn.COURSES.update(week.course, {
    lectures: {
      $inc: week.lectures.length
    }
  });
  res.json({
    ok: true,
    message: "ok",
    data: {
      week: week
    }
  });
};
exports.new_week = new_week;
var delete_week = function delete_week(req, res) {
  var _req$body10 = req.body,
    week = _req$body10.week,
    course = _req$body10.course;
  _conn.CURRICULUM.update_several({
    course: course
  }, {
    weeks: {
      $splice: week
    }
  });
  var week_ = _conn.WEEKS.remove(week);
  if (week_ && week_.lectures) {
    week_.lectures.map(function (lecture) {
      return lecture.resource && remove_file(lecture.resource);
    });
    _conn.COURSES.update(course, {
      lectures: {
        $dec: week_.lectures.length
      }
    });
  }
  res && res.end();
};
exports.delete_week = delete_week;
var strip_length = 14,
  prefix = "neovacity_africa";
var save_image = function save_image(base64_image, image_name) {
  if (!base64_image || base64_image && !base64_image.startsWith("data")) return base64_image;
  image_name = "".concat(prefix, "_").concat(image_name || Date.now()).concat(image_name ? "" : (0, _functions.generate_random_string)(6, "alpha"), ".jpg");
  var image_path = __dirname.slice(0, __dirname.length - strip_length) + "Assets/Images/".concat(image_name);
  _fs["default"].writeFileSync(image_path, Buffer.from(base64_image.slice(base64_image.indexOf(",")), "base64"));
  return image_name;
};
exports.save_image = save_image;
var save_file = function save_file(base64_file, file_name) {
  if (!base64_file || base64_file && !base64_file.startsWith("data")) return base64_file;
  file_name = "".concat(prefix, "_").concat(file_name ? file_name.split(".")[0] + "-".concat(Date.now()) : Date.now()).concat(file_name ? "" : (0, _functions.generate_random_string)(6, "alpha"), ".").concat(file_name.split(".").slice(-1)[0]);
  var file_path = __dirname.slice(0, __dirname.length - strip_length) + "Assets/Files/".concat(file_name);
  _fs["default"].writeFileSync(file_path, Buffer.from(base64_file.slice(base64_file.indexOf(",")), "base64"));
  return file_name;
};
exports.save_file = save_file;
var save_video = function save_video(base6_video) {
  if (!base6_video || base6_video && !base6_video.startsWith("data")) return base6_video;
  var video_name = "".concat(prefix, "_").concat(Date.now()).concat((0, _functions.generate_random_string)(6, "alpha"), ".mp4");
  var video_path = __dirname.slice(0, __dirname.length - strip_length) + "Assets/Videos/".concat(video_name);
  _fs["default"].writeFileSync(video_path, Buffer.from(base6_video.slice(base6_video.indexOf(",")), "base64"));
  return video_name;
};
exports.save_video = save_video;
var remove_image = function remove_image(image) {
  if (image === "user_image_placeholder.png" || !image) return;
  try {
    var image_path = __dirname.slice(0, __dirname.length - strip_length) + "Assets/Images/".concat(image);
    _fs["default"].unlinkSync(image_path);
  } catch (e) {}
};
exports.remove_image = remove_image;
var remove_file = function remove_file(file) {
  if (file === "user_image_placeholder.png" || !file) return;
  try {
    var file_path = __dirname.slice(0, __dirname.length - strip_length) + "Assets/Files/".concat(file);
    _fs["default"].unlinkSync(file_path);
  } catch (e) {}
};
exports.remove_file = remove_file;
var remove_video = function remove_video(video) {
  if (video === "user_image_placeholder.png" || !video) return;
  try {
    var video_path = __dirname.slice(0, __dirname.length - strip_length) + "Assets/Videos/".concat(video);
    _fs["default"].unlinkSync(video_path);
  } catch (e) {}
};
exports.remove_video = remove_video;
var get_student_courses = function get_student_courses(req, res) {
  var student = req.params.student;
  var courses = _conn.STUDENT_COURSES.read({
    student: student
  });
  res.json({
    ok: true,
    data: courses,
    message: "student courses"
  });
};
exports.get_student_courses = get_student_courses;
var create_user = function create_user(_ref) {
  var email = _ref.email,
    firstname = _ref.firstname,
    lastname = _ref.lastname;
  var user = {
    firstname: firstname,
    lastname: lastname,
    email: email,
    verified: true
  };
  var user_res = _conn.USERS.write(user);
  user._id = user_res._id;
  user.created = user_res.created;
  var key = (0, _functions.generate_random_string)(8, "alnum");
  _conn.USERS_HASH.write({
    user: user._id,
    key: key
  });
  try {
    (0, _users.send_mail)({
      recipient: email,
      recipient_name: (0, _users.to_title)("".concat(firstname, " ").concat(lastname)),
      sender: "signup@udaralinksapp.com",
      sender_pass: "signupudaralinks",
      sender_name: "Neovacity Africa",
      subject: "[Neovacity Africa] Profile Details",
      html: (0, _emails.user_generated)(user, key)
    });
  } catch (e) {}
  return user;
};
var register_course = function register_course(req, res) {
  var _req$body11 = req.body,
    course = _req$body11.course,
    email = _req$body11.email,
    phone = _req$body11.phone,
    student = _req$body11.student,
    firstname = _req$body11.firstname,
    set = _req$body11.set,
    lastname = _req$body11.lastname;
  if (!student) {
    student = _conn.USERS.readone({
      email: email
    });
    if (!student) student = create_user({
      email: email,
      firstname: firstname,
      lastname: lastname
    });
  } else student = _conn.USERS.readone(student);
  var course_ = _conn.COURSES.update(course, {
    enrollments: {
      $inc: 1
    }
  });
  _conn.ENROLLMENTS.write({
    course: course,
    phone: phone,
    student: student._id,
    set: set
  });
  _conn.STUDENT_COURSES.write({
    student: student._id,
    course: course
  });
  _conn.USERS.update(student._id, {
    courses_enrolled: {
      $inc: 1
    }
  });
  try {
    (0, _users.send_mail)({
      recipient: email,
      recipient_name: (0, _users.to_title)("".concat(firstname, " ").concat(lastname)),
      sender: "signup@udaralinksapp.com",
      sender_pass: "signupudaralinks",
      sender_name: "Neovacity Africa",
      subject: "[Neovacity Africa] Course Enrollment - ".concat(course_.title),
      html: (0, _emails.course_enrolled)(course, student, set)
    });
  } catch (e) {}
  res.json({
    ok: true,
    message: "course enrolled by student",
    data: {
      user: student,
      set: set
    }
  });
};
exports.register_course = register_course;
var lecture_video_upload = function lecture_video_upload(req, res) {
  var payload = req.body;
  payload.thumbnail = save_image(payload.thumbnail);
  var result = _conn.LECTURE_VIDEOS.write(payload);
  payload._id = result._id;
  payload.created = result.created;
  res.json({
    ok: true,
    message: "lecture video upload",
    data: payload
  });
};
exports.lecture_video_upload = lecture_video_upload;
var lecture_video_update = function lecture_video_update(req, res) {
  var payload = req.body;
  payload.thumbnail = save_image(payload.thumbnail);
  var result = _conn.LECTURE_VIDEOS.update({
    course: payload.course,
    _id: payload._id
  }, _objectSpread({}, payload));
  payload._id = result._id;
  payload.created = result.created;
  res.json({
    ok: true,
    message: "lecture video updated",
    data: payload
  });
};
exports.lecture_video_update = lecture_video_update;
var fetch_lecture_video_url = function fetch_lecture_video_url(req, res) {
  var _req$body12 = req.body,
    course = _req$body12.course,
    outline = _req$body12.outline,
    set = _req$body12.set;
  res.json({
    ok: true,
    message: "video url",
    data: _conn.LECTURE_VIDEOS.readone({
      course: course,
      outline: outline,
      set: set
    })
  });
};
exports.fetch_lecture_video_url = fetch_lecture_video_url;
var update_lecture_url = function update_lecture_url(req, res) {
  var payload = req.body;
  var result = _conn.LECTURE_URLS.update({
    course: payload.course,
    _id: payload._id
  }, _objectSpread({}, payload));
  payload._id = result._id;
  payload.created = result.created;
  res.json({
    ok: true,
    message: "lecture url updated",
    data: payload
  });
};
exports.update_lecture_url = update_lecture_url;
var upload_lecture_url = function upload_lecture_url(req, res) {
  var payload = req.body;
  var result = _conn.LECTURE_URLS.write(payload);
  payload._id = result._id;
  payload.created = result.created;
  res.json({
    ok: true,
    message: "lecture url upload",
    data: payload
  });
};
exports.upload_lecture_url = upload_lecture_url;
var fetch_lecture_url = function fetch_lecture_url(req, res) {
  var _req$body13 = req.body,
    course = _req$body13.course,
    outline = _req$body13.outline,
    set = _req$body13.set;
  res.json({
    ok: true,
    message: "lecture url",
    data: _conn.LECTURE_URLS.readone({
      course: course,
      outline: outline,
      set: set
    })
  });
};
exports.fetch_lecture_url = fetch_lecture_url;
var student_already_enrolled = function student_already_enrolled(req, res) {
  var _req$body14 = req.body,
    email = _req$body14.email,
    student = _req$body14.student,
    course = _req$body14.course,
    enrolled;
  if (!student) {
    student = _conn.USERS.readone({
      email: email
    });
    student = student && student._id;
    if (!student) enrolled = false;
  }
  if (student) {
    enrolled = !!_conn.STUDENT_COURSES.readone({
      student: student,
      course: course
    });
  }
  res.json({
    ok: true,
    message: "student_already_enrolled",
    data: {
      enrolled: enrolled
    }
  });
};
exports.student_already_enrolled = student_already_enrolled;