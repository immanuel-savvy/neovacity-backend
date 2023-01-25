import {
  ARTICLES,
  ARTICLE_CATEGORIES,
  COMMENTS,
  GLOBALS,
  REPLIES,
  TRENDING_ARTICLES,
} from "../ds/conn";
import { remove_image, save_image } from "./courses";

const articles = (req, res) => {
  let { limit, skip, total_articles } = req.body;

  let articles_ = ARTICLES.read(null, { limit: Number(limit), skip });
  if (total_articles)
    articles_ = {
      articles: articles_,
      total_articles: ARTICLES.config.total_entries,
    };

  res.json({ ok: true, message: "articles fetched", data: articles_ });
};

const search_articles = (req, res) => {
  let { search_param, limit, exclude } = req.body;

  let articles = ARTICLES.read(null, {
    limit: Number(limit),
    search_param,
    exclude,
  });

  res.json({ ok: true, message: "article search results", data: articles });
};

const update_article_image_hash = (req, res) => {
  let { article, image_hash } = req.body;

  ARTICLES.update(article, { image_hash });
  res.end();
};

const new_article = (req, res) => {
  let article = req.body;

  article.image = save_image(article.image);
  article.views = 0;
  article.categories = article.categories.map((cat) => cat._id);
  let result = ARTICLES.write(article);
  article._id = result._id;
  article.created = result.created;

  if (article.trending)
    article.trending = TRENDING_ARTICLES.write({
      article: article._id,
    })._id;

  ARTICLE_CATEGORIES.update_several(article.categories, {
    articles: { $push: article._id },
  });

  res.json({ ok: true, message: "article created", data: article });
};

const remove_trending_article = (req, res) => {
  let { trending } = req.params;
  TRENDING_ARTICLES.remove(trending);

  res.json({
    ok: true,
    message: "article removed from trending",
    data: trending,
  });
};

const trending_articles = (req, res) => {
  let { limit } = req.params;

  let articles = TRENDING_ARTICLES.read(null, { limit: Number(limit) });

  res.json({
    ok: true,
    message: "trending articles",
    data: articles.map((art) => art.article),
  });
};

const update_article = (req, res) => {
  let article = req.body;

  let { image, title, sections, categories, _id } = article;

  image = save_image(image);
  categories = categories && categories.map((cat) => cat._id);

  ARTICLES.update(_id, { image, title, sections, categories });

  res.json({ ok: true, message: "article updated", data: article });
};

const remove_article = (req, res) => {
  let { article } = req.params;

  let result = ARTICLES.remove(article);
  remove_image(result.image);

  ARTICLE_CATEGORIES.update_several(result.categories, {
    articles: { $splice: article },
  });

  res.json({ ok: true, message: "article removed", data: result });
};

const article_categories = (req, res) => {
  res.json({
    ok: true,
    message: "article categories",
    data: ARTICLE_CATEGORIES.read(),
  });
};

const add_article_category = (req, res) => {
  let cat = req.body;

  let result = ARTICLE_CATEGORIES.write(cat);
  cat._id = result._id;
  cat.created = result.created;

  res.json({ ok: true, message: "article category added", data: cat });
};

const update_article_category = (req, res) => {
  let category = req,
    body;

  let result = ARTICLE_CATEGORIES.update(category._id, {
    title: category.title,
    tags: category.tags,
  });

  res.json({ ok: true, message: "article category updated", data: result });
};

const remove_article_category = (req, res) => {
  let { category } = req.params;

  let result = ARTICLE_CATEGORIES.remove(category);
  ARTICLES.update_several(result.articles, {
    categories: { $splice: category },
  });

  res.json({ ok: true, message: "article category removed", data: category });
};

const comments = (req, res) => {
  let { article } = req.params;
  let comments_ = COMMENTS.read({ article });

  res.json({ ok: true, message: "article comments", data: comments_ });
};

const new_comment = (req, res) => {
  let comment = req.body;

  let result = COMMENTS.write(comment);
  comment._id = result._id;
  comment.created = result.created;
  ARTICLES.update(comment.article, { comments: { $inc: 1 } });

  res.json({ ok: true, message: "commented", data: comment });
};

const get_replies = (req, res) => {
  let { replies } = req.body;

  replies = REPLIES.read(replies);
  res.json({ ok: true, message: "replies fetched", data: replies });
};

const new_reply = (req, res) => {
  let reply = req.body;

  let result = REPLIES.write(reply);
  reply._id = result._id;
  reply.created = result.created;

  COMMENTS.update(
    reply.comment,
    {
      replies: { $push: reply._id },
    },
    { subfolder: reply.article }
  );

  ARTICLES.update(reply.article, { comments: { $inc: 1 } });

  res.json({ ok: true, message: "replied", data: reply });
};

const GLOBAL_trending_articles = "trending_articles";

const article_viewed = (req, res) => {
  let { article } = req.params;

  let result = ARTICLES.update(article, { views: { $inc: 1 } });

  if (result) {
    let trending_articles = GLOBALS.readone({
      global: GLOBAL_trending_articles,
    });
    if (!trending_articles) {
      trending_articles = {
        global: GLOBAL_trending_articles,
        articles: new Array(),
      };
      GLOBALS.write(trending_articles);
    }

    trending_articles = trending_articles.articles;
    if (trending_articles.length < 5)
      GLOBALS.update(
        { global: GLOBAL_trending_articles },
        { articles: { $push: { article, views: result.views } } }
      );
    else {
      trending_articles = trending_articles.map((article_) => {
        if (article_.views < result.views)
          return { article, views: result.views };
        return article_;
      });

      GLOBALS.update(
        { global: GLOBAL_trending_articles },
        { articles: trending_articles }
      );
    }
  }

  res.end();
};

const article = (req, res) =>
  res.json({
    ok: true,
    message: "article",
    data: ARTICLES.readone(req.params.article),
  });

export {
  article,
  articles,
  new_article,
  remove_article,
  update_article,
  article_categories,
  add_article_category,
  remove_article_category,
  update_article_category,
  update_article_image_hash,
  new_comment,
  comments,
  get_replies,
  article_viewed,
  new_reply,
  trending_articles,
  remove_trending_article,
  search_articles,
  GLOBAL_trending_articles,
};
