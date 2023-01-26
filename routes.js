import { admin_login, create_admin, get_admins } from "./route_handlers/admin";
import {
  admission_exam,
  admission_questions,
  find_admission_exam,
  new_question,
  remove_question,
  update_question,
} from "./route_handlers/admissions";
import {
  add_article_category,
  article,
  articles,
  article_categories,
  article_viewed,
  comments,
  get_replies,
  new_article,
  new_comment,
  new_reply,
  remove_article,
  remove_article_category,
  remove_trending_article,
  search_articles,
  trending_articles,
  update_article,
  update_article_category,
} from "./route_handlers/articles";
import {
  add_course,
  course,
  courses,
  remove_course,
  update_course,
  curriculum,
  course_reviews,
  post_review,
  review_like,
  review_unlike,
  review_heart,
  search_courses,
  update_course_image_hash,
  add_slide,
  update_slide,
  schools,
  update_school_image_hash,
  create_school,
  remove_school,
  update_school,
  remove_slide,
  new_week,
  delete_week,
  get_student_courses,
  register_course,
  lecture_video_upload,
  fetch_lecture_video_url,
  lecture_video_update,
  fetch_lecture_url,
  upload_lecture_url,
  update_lecture_url,
  student_already_enrolled,
} from "./route_handlers/courses";
import {
  about_statement,
  add_trusted_by,
  alumni_overview,
  approve_review,
  banner_stuffs,
  best_instructors_stuffs,
  faqs,
  handle_best_instructors_stuffs,
  handle_onboarding_stuffs,
  new_faq,
  new_review,
  onboarding_stuffs,
  remove_faq,
  remove_review,
  remove_trustee,
  reviews,
  trusted_by,
  update_alumni_overview,
  update_faq,
} from "./route_handlers/sections";
import {
  contact_messages,
  contact_message_seen,
  newsletter_subscribers,
  new_contact_message,
  remove_contact_messages,
  remove_subscriber,
  subscribe_newsletter,
  update_banner_image,
  update_banner_video,
  entry,
} from "./route_handlers/starter";
import {
  login,
  signup,
  update_user,
  user,
  verify_email,
} from "./route_handlers/users";

const router = (app) => {
  app.get("/course/:course_id", course);
  app.get("/schools/:limit", schools);
  app.get("/curriculum/:course", curriculum);
  app.get("/get_admins", get_admins);
  app.get("/entry", entry);
  app.get("/about_statement", about_statement);
  app.get("/comments/:article/:skip", comments);
  app.get("/article_categories", article_categories);
  app.get("/trusted_by", trusted_by);
  app.get("/alumni_overview", alumni_overview);
  app.get("/newsletter_subscribers", newsletter_subscribers);
  app.get("/trending_articles/:limit", trending_articles);
  app.get("/user/:user_id", user);
  app.get("/banner_stuffs", banner_stuffs);
  app.get("/article/:article", article);
  app.get("/onboarding_stuffs", onboarding_stuffs);
  app.get("/best_instructors_stuffs", best_instructors_stuffs);
  app.get("/get_student_courses/:student", get_student_courses);

  app.post("/update_banner_video", update_banner_video);
  app.post("/update_banner_image", update_banner_image);
  app.post("/handle_onboarding_stuffs", handle_onboarding_stuffs);
  app.post("/handle_best_instructors_stuffs", handle_best_instructors_stuffs);
  app.post("/update_school_image_hash", update_school_image_hash);
  app.post("/update_course_image_hash", update_course_image_hash);
  app.post("/reviews", reviews);
  app.post("/new_question", new_question);
  app.post("/remove_faq/:faq", remove_faq);
  app.post("/update_faq", update_faq);
  app.post("/new_faq", new_faq);
  app.post("/faqs", faqs);
  app.post("/admission_exam", admission_exam);
  app.post("/find_admission_exam", find_admission_exam);
  app.post("/update_question", update_question);
  app.post("/remove_question", remove_question);
  app.post("/update_user/:user", update_user);
  app.post("/update_alumni_overview", update_alumni_overview);
  app.post("/approve_review/:review", approve_review);
  app.post("/review_like/:course/:review", review_like);
  app.post("/review_unlike/:course/:review", review_unlike);
  app.post("/review_heart/:course/:review", review_heart);
  app.post("/course_reviews", course_reviews);
  app.post("/get_courses", (req, res) =>
    courses({ body: { filter: req.body.courses } }, res)
  );
  app.post("/articles", articles);
  app.post("/signup", signup);
  app.post("/login", login);
  app.post("/verify_email", verify_email);
  app.post("/register_course", register_course);
  app.post("/lecture_video_upload", lecture_video_upload);
  app.post("/lecture_video_update", lecture_video_update);
  app.post("/fetch_lecture_video_url", fetch_lecture_video_url);
  app.post("/fetch_lecture_url", fetch_lecture_url);
  app.post("/upload_lecture_url", upload_lecture_url);
  app.post("/update_lecture_url", update_lecture_url);
  app.post("/new_contact_message", new_contact_message);
  app.post("/admission_questions", admission_questions);
  app.post("/student_already_enrolled", student_already_enrolled);
  app.post("/remove_contact_message/:message", remove_contact_messages);
  app.post("/contact_message_seen/:message", contact_message_seen);
  app.post("/contact_messages", contact_messages);
  app.post("/get_replies", get_replies);
  app.post("/subscribe_newsletter", subscribe_newsletter);
  app.post("/remove_subscriber", remove_subscriber);
  app.post("/article_viewed/:article", article_viewed);
  app.post("/search_articles", search_articles);
  app.post("/new_week", new_week);
  app.post("/delete_week", delete_week);
  app.post("/new_reply", new_reply);
  app.post("/new_comment", new_comment);
  app.post("/new_article", new_article);
  app.post("/remove_article_category/:category", remove_article_category);
  app.post("/add_article_category", add_article_category);
  app.post("/update_article_category", update_article_category);
  app.post("/update_article", update_article);
  app.post("/remove_article/:article", remove_article);
  app.post("/create_school", create_school);
  app.post("/courses", courses);
  app.post("/add_slide", add_slide);
  app.post("/update_slide", update_slide);
  app.post("/remove_slide", remove_slide);
  app.post("/new_review", new_review);
  app.post("/remove_review/:review", remove_review);
  app.post("/search_courses", search_courses);
  app.post("/post_review", post_review);
  app.post("/add_course", add_course);
  app.post("/remove_course/:course", remove_course);
  app.post("/remove_school/:school", remove_school);
  app.post("/update_school", update_school);
  app.post("/update_course", update_course);
  app.post("/create_admin", create_admin);
  app.post("/admin_login", admin_login);
  app.post("/add_trusted_by", add_trusted_by);
  app.post("/remove_trustee/:trustee", remove_trustee);
  app.post("/remove_trending_article/:trending", remove_trending_article);
};

export default router;
