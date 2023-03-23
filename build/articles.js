"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.update_article_image_hash = exports.update_article_category = exports.update_article = exports.trending_articles = exports.search_articles = exports.remove_trending_article = exports.remove_article_category = exports.remove_article = exports.new_reply = exports.new_comment = exports.new_article = exports.get_replies = exports.comments = exports.articles = exports.article_viewed = exports.article_categories = exports.article = exports.add_article_category = exports.GLOBAL_trending_articles = void 0;
var _conn = require("../ds/conn");
var _courses = require("./courses");
var articles = function articles(req, res) {
  var _req$body = req.body,
    limit = _req$body.limit,
    skip = _req$body.skip,
    total_articles = _req$body.total_articles;
  var articles_ = _conn.ARTICLES.read(null, {
    limit: Number(limit),
    skip: skip
  });
  if (total_articles) articles_ = {
    articles: articles_,
    total_articles: _conn.ARTICLES.config.total_entries
  };
  res.json({
    ok: true,
    message: "articles fetched",
    data: articles_
  });
};
exports.articles = articles;
var search_articles = function search_articles(req, res) {
  var _req$body2 = req.body,
    search_param = _req$body2.search_param,
    limit = _req$body2.limit,
    exclude = _req$body2.exclude;
  var articles = _conn.ARTICLES.read(null, {
    limit: Number(limit),
    search_param: search_param,
    exclude: exclude
  });
  res.json({
    ok: true,
    message: "article search results",
    data: articles
  });
};
exports.search_articles = search_articles;
var update_article_image_hash = function update_article_image_hash(req, res) {
  var _req$body3 = req.body,
    article = _req$body3.article,
    image_hash = _req$body3.image_hash;
  _conn.ARTICLES.update(article, {
    image_hash: image_hash
  });
  res.end();
};
exports.update_article_image_hash = update_article_image_hash;
var new_article = function new_article(req, res) {
  var article = req.body;
  article.image = (0, _courses.save_image)(article.image);
  article.views = 0;
  article.categories = article.categories.map(function (cat) {
    return cat._id;
  });
  var result = _conn.ARTICLES.write(article);
  article._id = result._id;
  article.created = result.created;
  if (article.trending) article.trending = _conn.TRENDING_ARTICLES.write({
    article: article._id
  })._id;
  _conn.ARTICLE_CATEGORIES.update_several(article.categories, {
    articles: {
      $push: article._id
    }
  });
  res.json({
    ok: true,
    message: "article created",
    data: article
  });
};
exports.new_article = new_article;
var remove_trending_article = function remove_trending_article(req, res) {
  var trending = req.params.trending;
  _conn.TRENDING_ARTICLES.remove(trending);
  res.json({
    ok: true,
    message: "article removed from trending",
    data: trending
  });
};
exports.remove_trending_article = remove_trending_article;
var trending_articles = function trending_articles(req, res) {
  var limit = req.params.limit;
  var articles = _conn.TRENDING_ARTICLES.read(null, {
    limit: Number(limit)
  });
  res.json({
    ok: true,
    message: "trending articles",
    data: articles.map(function (art) {
      return art.article;
    })
  });
};
exports.trending_articles = trending_articles;
var update_article = function update_article(req, res) {
  var article = req.body;
  var image = article.image,
    title = article.title,
    sections = article.sections,
    categories = article.categories,
    _id = article._id;
  image = (0, _courses.save_image)(image);
  categories = categories && categories.map(function (cat) {
    return cat._id;
  });
  _conn.ARTICLES.update(_id, {
    image: image,
    title: title,
    sections: sections,
    categories: categories
  });
  res.json({
    ok: true,
    message: "article updated",
    data: article
  });
};
exports.update_article = update_article;
var remove_article = function remove_article(req, res) {
  var article = req.params.article;
  var result = _conn.ARTICLES.remove(article);
  (0, _courses.remove_image)(result.image);
  _conn.ARTICLE_CATEGORIES.update_several(result.categories, {
    articles: {
      $splice: article
    }
  });
  res.json({
    ok: true,
    message: "article removed",
    data: result
  });
};
exports.remove_article = remove_article;
var article_categories = function article_categories(req, res) {
  res.json({
    ok: true,
    message: "article categories",
    data: _conn.ARTICLE_CATEGORIES.read()
  });
};
exports.article_categories = article_categories;
var add_article_category = function add_article_category(req, res) {
  var cat = req.body;
  var result = _conn.ARTICLE_CATEGORIES.write(cat);
  cat._id = result._id;
  cat.created = result.created;
  res.json({
    ok: true,
    message: "article category added",
    data: cat
  });
};
exports.add_article_category = add_article_category;
var update_article_category = function update_article_category(req, res) {
  var category = req,
    body;
  var result = _conn.ARTICLE_CATEGORIES.update(category._id, {
    title: category.title,
    tags: category.tags
  });
  res.json({
    ok: true,
    message: "article category updated",
    data: result
  });
};
exports.update_article_category = update_article_category;
var remove_article_category = function remove_article_category(req, res) {
  var category = req.params.category;
  var result = _conn.ARTICLE_CATEGORIES.remove(category);
  _conn.ARTICLES.update_several(result.articles, {
    categories: {
      $splice: category
    }
  });
  res.json({
    ok: true,
    message: "article category removed",
    data: category
  });
};
exports.remove_article_category = remove_article_category;
var comments = function comments(req, res) {
  var article = req.params.article;
  var comments_ = _conn.COMMENTS.read({
    article: article
  });
  res.json({
    ok: true,
    message: "article comments",
    data: comments_
  });
};
exports.comments = comments;
var new_comment = function new_comment(req, res) {
  var comment = req.body;
  var result = _conn.COMMENTS.write(comment);
  comment._id = result._id;
  comment.created = result.created;
  _conn.ARTICLES.update(comment.article, {
    comments: {
      $inc: 1
    }
  });
  res.json({
    ok: true,
    message: "commented",
    data: comment
  });
};
exports.new_comment = new_comment;
var get_replies = function get_replies(req, res) {
  var replies = req.body.replies;
  replies = _conn.REPLIES.read(replies);
  res.json({
    ok: true,
    message: "replies fetched",
    data: replies
  });
};
exports.get_replies = get_replies;
var new_reply = function new_reply(req, res) {
  var reply = req.body;
  var result = _conn.REPLIES.write(reply);
  reply._id = result._id;
  reply.created = result.created;
  _conn.COMMENTS.update(reply.comment, {
    replies: {
      $push: reply._id
    }
  }, {
    subfolder: reply.article
  });
  _conn.ARTICLES.update(reply.article, {
    comments: {
      $inc: 1
    }
  });
  res.json({
    ok: true,
    message: "replied",
    data: reply
  });
};
exports.new_reply = new_reply;
var GLOBAL_trending_articles = "trending_articles";
exports.GLOBAL_trending_articles = GLOBAL_trending_articles;
var article_viewed = function article_viewed(req, res) {
  var article = req.params.article;
  var result = _conn.ARTICLES.update(article, {
    views: {
      $inc: 1
    }
  });
  if (result) {
    var _trending_articles = _conn.GLOBALS.readone({
      global: GLOBAL_trending_articles
    });
    if (!_trending_articles) {
      _trending_articles = {
        global: GLOBAL_trending_articles,
        articles: new Array()
      };
      _conn.GLOBALS.write(_trending_articles);
    }
    _trending_articles = _trending_articles.articles;
    if (_trending_articles.length < 5) _conn.GLOBALS.update({
      global: GLOBAL_trending_articles
    }, {
      articles: {
        $push: {
          article: article,
          views: result.views
        }
      }
    });else {
      _trending_articles = _trending_articles.map(function (article_) {
        if (article_.views < result.views) return {
          article: article,
          views: result.views
        };
        return article_;
      });
      _conn.GLOBALS.update({
        global: GLOBAL_trending_articles
      }, {
        articles: _trending_articles
      });
    }
  }
  res.end();
};
exports.article_viewed = article_viewed;
var article = function article(req, res) {
  return res.json({
    ok: true,
    message: "article",
    data: _conn.ARTICLES.readone(req.params.article)
  });
};
exports.article = article;