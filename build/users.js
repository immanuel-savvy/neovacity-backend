"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verify_email = exports.user = exports.update_user = exports.to_title = exports.signup = exports.send_mail = exports.login = void 0;
var _conn = require("../ds/conn");
var _nodemailer = _interopRequireDefault(require("nodemailer"));
var _functions = require("generalised-datastore/utils/functions");
var _emails = require("./emails");
var _courses = require("./courses");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var email_verification_codes = new Object();
var to_title = function to_title(string) {
  if (!string) return string;
  var str = "";
  string.split(" ").map(function (s) {
    if (s) str += " " + s[0].toUpperCase() + s.slice(1);
  });
  return str.trim();
};
exports.to_title = to_title;
var send_mail = function send_mail(_ref) {
  var recipient = _ref.recipient,
    recipient_name = _ref.recipient_name,
    sender_pass = _ref.sender_pass,
    sender_name = _ref.sender_name,
    sender = _ref.sender,
    subject = _ref.subject,
    text = _ref.text,
    html = _ref.html,
    to = _ref.to;
  var transporter;
  try {
    transporter = _nodemailer["default"].createTransport({
      host: "66.29.137.48" || "udaralinksapp.com",
      port: 465,
      secure: true,
      tls: {
        servername: "udaralinksapp.com"
      },
      auth: {
        user: sender,
        pass: sender_pass
      }
    });
  } catch (e) {}
  try {
    transporter.sendMail({
      from: "".concat(sender_name, " <").concat(sender, ">"),
      to: to || "".concat(recipient_name, " <").concat(recipient, ">"),
      subject: subject,
      text: text,
      html: html
    });
  } catch (e) {}
};
exports.send_mail = send_mail;
var signup = function signup(req, res) {
  var user = req.body;
  var key = user.password;
  delete user.password;
  user.email = user.email.toLowerCase().trim();
  var user_exists = _conn.USERS.readone({
    email: user.email
  });
  if (user_exists && user_exists.verified) return res.json({
    ok: false,
    message: "user exists",
    data: "email already used."
  });
  if (user_exists) {
    user._id = user_exists._id;
    _conn.USERS.update(user._id, {
      firstname: user.firstname,
      lastname: user.lastname
    });
    _conn.USERS_HASH.update({
      user: user._id
    }, {
      key: key
    });
  } else {
    user.image = (0, _courses.save_image)(user.image);
    var result = _conn.USERS.write(user);
    user._id = result._id;
    user.created = result.created;
    _conn.USERS_HASH.write({
      user: user._id,
      key: key
    });
  }
  var code = (0, _functions.generate_random_string)(6);
  email_verification_codes[user.email] = code;
  var fullname = to_title("".concat(user.firstname, " ").concat(user.lastname));
  send_mail({
    recipient: user.email,
    recipient_name: fullname,
    subject: "[Neovacity Africa] Please verify your email",
    sender: "signup@udaralinksapp.com",
    sender_name: "Neovacity Africa",
    sender_pass: "signupudaralinks",
    html: (0, _emails.verification)(code, fullname)
  });
  res.json({
    ok: true,
    message: "user signup",
    data: {
      email: user.email,
      _id: user._id
    }
  });
};
exports.signup = signup;
var update_user = function update_user(req, res) {
  var user = req.params.user;
  var user_obj = req.body;
  var prior_user = _conn.USERS.readone(user);
  if (prior_user.image && user_obj.image && !user_obj.image.endsWith(".jpg")) (0, _courses.remove_image)(prior_user.image);
  user_obj.image = (0, _courses.save_image)(user_obj.image);
  user = _conn.USERS.update(user, _objectSpread({}, user_obj));
  res.json({
    ok: true,
    message: "user updated",
    data: _objectSpread(_objectSpread({}, user), {}, {
      image: user_obj.image
    })
  });
};
exports.update_user = update_user;
var user = function user(req, res) {
  var user_id = req.params.user_id;
  res.json({
    ok: true,
    message: "user fetched",
    data: _conn.USERS.readone(user_id)
  });
};
exports.user = user;
var verify_email = function verify_email(req, res) {
  var _req$body = req.body,
    email = _req$body.email,
    verification_code = _req$body.verification_code;
  email = email && email.trim().toLowerCase();
  verification_code = verification_code && verification_code.trim();
  var code = email_verification_codes[email];
  if (!code || code !== verification_code) return res.json({
    ok: false,
    message: "",
    data: "Email verification failed."
  });
  var user = _conn.USERS.readone({
    email: email
  });
  _conn.USERS.update(user._id, {
    verified: true
  });
  res.json({
    ok: true,
    message: "user email verified",
    data: user
  });
};
exports.verify_email = verify_email;
var login = function login(req, res) {
  var _req$body2 = req.body,
    email = _req$body2.email,
    password = _req$body2.password;
  var user = _conn.USERS.readone({
    email: email.toLowerCase()
  });
  if (!user) return res.json({
    ok: false,
    message: "user not found",
    data: "User not found"
  });
  var user_hash = _conn.USERS_HASH.readone({
    user: user._id
  });
  if (!user_hash || user_hash && user_hash.key !== password) return res.json({
    ok: false,
    message: "invalid password",
    data: "Invalid password"
  });
  res.json({
    ok: true,
    message: "user logged-in",
    data: user
  });
};
exports.login = login;