import {
  ADMINSTRATORS,
  ADMIN_HASH,
  CONTACT_MESSAGES,
  GLOBALS,
  USERS,
  USERS_HASH,
} from "../ds/conn";
import { remove_image, remove_video, save_image, save_video } from "./courses";
import {
  GLOBAL_best_instructor_stuffs,
  GLOBAL_onboarding_stuffs,
} from "./sections";

let default_admin = "adminstrators~123neovacity~1234567890123",
  default_user = "users~123neovacity~1234567890123";

const GLOBAL_newsletter = "newsletter",
  GLOBAL_unseen_messages = "contact_messages";

const create_default_admin = () => {
  if (!ADMINSTRATORS.readone(default_admin)) {
    ADMINSTRATORS.write({
      firstname: "Neovacity",
      lastname: "Africa",
      image: "logo_single.png",
      email: "admin@neovacity.com",
      _id: default_admin,
    });
    ADMIN_HASH.write({ admin: default_admin, key: "adminstrator#1" });
  }

  if (!USERS.readone(default_user)) {
    USERS.write({
      _id: default_user,
      firstname: "Neovacity",
      lastname: "Africa",
      verified: true,
      email: "neovacityafrica@gmail.com",
    });
    USERS_HASH.write({ user: default_user, key: "adminstrator#1" });
  }
};

const subscribe_newsletter = (req, res) => {
  let { email } = req.body;
  if (email && typeof email === "string") {
    email = email.trim().toLowerCase();
    if (GLOBALS.readone({ global: GLOBAL_newsletter }))
      GLOBALS.update(
        { global: GLOBAL_newsletter },
        { subscribers: { $set: email } }
      );
    else {
      GLOBALS.write({
        global: GLOBAL_newsletter,
        subscribers: new Array(email),
      });
    }
  }

  res.end();
};

const remove_subscriber = (req, res) => {
  let { email } = req.body;

  email &&
    typeof email === "string" &&
    GLOBALS.update(
      { global: GLOBAL_newsletter },
      { subscribers: { $splice: email.trim().toLowerCase() } }
    );

  res.end();
};

const newsletter_subscribers = (req, res) => {
  let subscribers = GLOBALS.readone({ global: GLOBAL_newsletter });
  res.json({
    ok: true,
    message: "newsletter subscribers",
    data: subscribers ? subscribers.subscribers : new Array(),
  });
};

const contact_messages = (req, res) => {
  let { seen } = req.body || new Object();

  let msgs = (
      GLOBALS.read({ global: GLOBAL_unseen_messages }) || {
        messages: new Array(),
      }
    ).messages,
    messages;
  messages = seen
    ? CONTACT_MESSAGES.read({ _id: { $ne: msgs } })
    : CONTACT_MESSAGES.read(msgs);

  res.json({ ok: true, message: "contact messages fetched", data: messages });
};

const remove_contact_messages = (req, res) => {
  let { message } = req.params;

  CONTACT_MESSAGES.remove(message);
  res.end();
};

const contact_message_seen = (req, res) => {
  let { message } = req.params;

  GLOBALS.update(
    { global: GLOBAL_unseen_messages },
    { messages: { $splice: message } }
  );
  CONTACT_MESSAGES.update(message, { seen: true });

  res.end();
};

const new_contact_message = (req, res) => {
  let message = req.body;

  let result = CONTACT_MESSAGES.write(message);
  if (GLOBALS.readone({ global: GLOBAL_unseen_messages }))
    GLOBALS.update(
      { global: GLOBAL_unseen_messages },
      { messages: { $push: result._id } }
    );
  else
    GLOBALS.write({
      global: GLOBAL_unseen_messages,
      messages: new Array(result._id),
    });

  res.end();
};

const GLOBAL_banner_stuffs = "banner_stuffs";

const update_banner_video = (req, res) => {
  let { video, thumbnail, thumbnail_hash } = req.body;

  let initial_thumbnail = thumbnail;
  video = save_video(video);
  thumbnail = save_image(thumbnail);

  let banner_vid = GLOBALS.readone({ global: GLOBAL_banner_stuffs });
  banner_vid &&
    (initial_thumbnail.startsWith("data") && remove_image(banner_vid.thumbnail),
    remove_video(banner_vid.video));

  if (
    !GLOBALS.update(
      { global: GLOBAL_banner_stuffs },
      { video, thumbnail, thumbnail_hash }
    )
  )
    GLOBALS.write({
      global: GLOBAL_banner_stuffs,
      video,
      thumbnail,
      thumbnail_hash,
    });

  res.json({
    ok: true,
    message: "banner video updated",
    data: { video, thumbnail },
  });
};

const update_banner_image = (req, res) => {
  let { image } = req.body;

  try {
    remove_image("neovacity_africa_banner_background_image.jpg");
  } catch (e) {}

  image = save_image(image, "banner_background_image");

  if (!GLOBALS.update({ global: GLOBAL_banner_stuffs }, { image }))
    GLOBALS.write({ global: GLOBAL_banner_stuffs, image });

  res.json({ ok: true, message: "banner image updated", data: { image } });
};

const entry = (req, res) => {
  let banner_stuffs = GLOBALS.readone({ global: GLOBAL_banner_stuffs });
  let onboarding_stuffs = GLOBALS.readone({ global: GLOBAL_onboarding_stuffs });
  let best_instructors_stuffs = GLOBALS.readone({
    global: GLOBAL_best_instructor_stuffs,
  });

  res.json({
    ok: true,
    message: "entry stuffs",
    data: {
      banner_stuffs,
      onboarding_stuffs,
      best_instructors_stuffs,
    },
  });
};

export {
  remove_subscriber,
  create_default_admin,
  subscribe_newsletter,
  contact_messages,
  new_contact_message,
  newsletter_subscribers,
  remove_contact_messages,
  contact_message_seen,
  entry,
  update_banner_image,
  update_banner_video,
  GLOBAL_banner_stuffs,
  GLOBAL_newsletter,
};
