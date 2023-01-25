import GDS from "generalised-datastore";

let gds;

let USERS,
  FAQS,
  ADMINSTRATORS,
  ADMIN_HASH,
  CONTACT_MESSAGES,
  GLOBALS,
  SCHOOLS,
  COURSES,
  REVIEWS,
  COMMENTS,
  REPLIES,
  CURRICULUM,
  COURSE_REVIEWS,
  ARTICLE_CATEGORIES,
  ARTICLES,
  STUDENT_COURSES,
  TRENDING_ARTICLES,
  INSTRUCTORS,
  TRUSTEES,
  ENROLLMENTS,
  WEEKS,
  LECTURE_VIDEOS,
  LECTURE_URLS,
  USERS_HASH;

const ds_conn = () => {
  gds = new GDS("neovacity").sync();

  USERS = gds.folder("users");
  ADMINSTRATORS = gds.folder("adminstrators");
  ADMIN_HASH = gds.folder("admin_hash", "admin");
  GLOBALS = gds.folder("globals", "global");
  USERS_HASH = gds.folder("user_hash", "user");
  FAQS = gds.folder("faqs");
  SCHOOLS = gds.folder("schools");
  COURSES = gds.folder("courses");
  COMMENTS = gds.folder("comments", "article");
  REPLIES = gds.folder("replies");
  REVIEWS = gds.folder("reviews");
  COURSE_REVIEWS = gds.folder("course_reviews", "course", "user");
  SCHOOLS = gds.folder("schools");
  CURRICULUM = gds.folder("curriculum", "course", "weeks");
  WEEKS = gds.folder("weeks");
  INSTRUCTORS = gds.folder("instructors");
  TRUSTEES = gds.folder("trustees");
  LECTURE_VIDEOS = gds.folder("lecture_videos", "course");
  LECTURE_URLS = gds.folder("lecture_urls", "course");
  ENROLLMENTS = gds.folder("enrollments", "course", "student");
  CONTACT_MESSAGES = gds.folder("contact_messages", null, "interest");
  ARTICLES = gds.folder("articles", null, "categories");
  ARTICLE_CATEGORIES = gds.folder("article_categories");
  STUDENT_COURSES = gds.folder("student_courses", "student", "course");
  TRENDING_ARTICLES = gds.folder("trending_articles", null, "article");
};

export {
  gds,
  USERS,
  FAQS,
  ADMINSTRATORS,
  ADMIN_HASH,
  CONTACT_MESSAGES,
  ARTICLE_CATEGORIES,
  ARTICLES,
  TRENDING_ARTICLES,
  GLOBALS,
  SCHOOLS,
  REVIEWS,
  COMMENTS,
  STUDENT_COURSES,
  REPLIES,
  CURRICULUM,
  COURSE_REVIEWS,
  INSTRUCTORS,
  LECTURE_VIDEOS,
  LECTURE_URLS,
  TRUSTEES,
  COURSES,
  WEEKS,
  USERS_HASH,
  ENROLLMENTS,
};
export default ds_conn;
