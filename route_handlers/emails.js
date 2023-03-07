import { month_index } from "../functions";
import { client_domain, domain_name } from "./admin";

const verification = (code, fullname) => {
  return `<!DOCTYPE html><html><head><title></title><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="X-UA-Compatible"content="IE=edge"/><style type="text/css">@media screen {@font-face {font-family: \'Lato\';font-style: normal;font-weight: 400;src: local(\'Lato Regular\'), local(\'Lato-Regular\'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format(\'woff\');}@font-face {font-family: \'Lato\';font-style: normal;font-weight: 700;src: local(\'Lato Bold\'), local(\'Lato-Bold\'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format(\'woff\');}@font-face {font-family: \'Lato\';font-style: italic;font-weight: 400;src: local(\'Lato Italic\'), local(\'Lato-Italic\'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format(\'woff\');}@font-face {font-family: \'Lato\';font-style: italic;font-weight: 700;src: local(\'Lato Bold Italic\'), local(\'Lato-BoldItalic\'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format(\'woff\');}}/* CLIENT-SPECIFIC STYLES */body,table,td,a {-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;}table,td {mso-table-lspace: 0pt;mso-table-rspace: 0pt;}img {-ms-interpolation-mode: bicubic;}/* RESET STYLES */img {border: 0;height: auto;line-height: 100%;outline: none;text-decoration: none;}table {border-collapse: collapse !important;}body {height: 100% !important;margin: 0 !important;padding: 0 !important;width: 100% !important;}/* iOS BLUE LINKS */a[x-apple-data-detectors] {color: inherit !important;text-decoration: none !important;font-size: inherit !important;font-family: inherit !important;font-weight: inherit !important;line-height: inherit !important;}/* MOBILE STYLES */@media screen and (max-width:600px) {h1 {font-size: 32px !important;line-height: 32px !important;}}/* ANDROID CENTER FIX */div[style*="margin: 16px 0;"] {margin: 0 !important;}.p_code{  margin:14px;  font-size: 24px;  letter-spacing:2.5px;  font-weight: bold;  color:#fff;}</style></head><body style="background-color: #ff6905; margin: 0 !important; padding: 0 !important;"><!-- HIDDEN PREHEADER TEXT --><div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: \'Lato\', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;"> We\'re thrilled to have you here! Get ready to dive into your new account.</div><table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td bgcolor="#FFA73B" align="center"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">  <tr>  <td align="center" valign="top" style="padding: 40px 10px 40px 10px;"> </td>  </tr></table></td></tr><tr><td bgcolor="#FFA73B" align="center" style="padding: 0px 10px 0px 10px;"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">  <tr>  <td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: \'Lato\', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">  <h1 style="font-size: 36px; font-weight: 400; margin: 2;">Welcome ${fullname}!</h1> <img src="https://api.giitafrica.com/Images/logo_single.png" width="125" height="120" style="display: block; border: 0px;" />  </td>  </tr></table></td></tr><tr><td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">  <tr>  <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 40px 30px; color: #666666; font-family: \'Lato\', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">  <p style="margin: 0;">We\'re excited to have you get started. First, you need to confirm your account. Just return the code below.</p>  </td>  </tr>  <tr>  <td bgcolor="#ffffff" align="left">  <table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px;"><table border="0" cellspacing="0" cellpadding="0"><tr><td align="center" style="border-radius: 3px;" bgcolor="#ff6905"><p class="p_code">${code}</p></td></tr></table></td></tr>  </table>  </td>  </tr> <!-- COPY -->  <tr>  <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 20px 30px; color: #666666; font-family: \'Lato\', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">  <p style="margin: 0;">If you have any questions, just reply to this email&mdash;we\'re always happy to help out.</p>  </td>  </tr>  <tr>  <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 40px 30px; border-radius: 0px 0px 4px 4px; color: #666666; font-family: \'Lato\', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">  <p style="margin: 0;">Cheers,<br>GIIT Africa</p>  </td>  </tr></table></td></tr><tr><td bgcolor="#f4f4f4" align="center" style="padding: 30px 10px 0px 10px;"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">  <tr>  <td bgcolor="#FFECD1" align="center" style="padding: 30px 30px 30px 30px; border-radius: 4px 4px 4px 4px; color: #666666; font-family: \'Lato\', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">  <h2 style="font-size: 20px; font-weight: 400; color: #111111; margin: 0;">Need more help?</h2>  <p style="margin: 0;"><a href="#" target="_blank" style="color: #FFA73B;">We&rsquo;re here to help you out</a></p>  </td>  </tr></table></td></tr><tr><td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">  <tr>  <td bgcolor="#f4f4f4" align="left" style="padding: 0px 30px 30px 30px; color: #666666; font-family: \'Lato\', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 400; line-height: 18px;"> <br><!--  <p style="margin: 0;">If these emails get annoying, please feel free to <a href="#" target="_blank" style="color: #111111; font-weight: 700;">unsubscribe</a>.</p> -->  </td>  </tr></table></td></tr></table></body></html>`;
};

const generate_newsletter = (articles, email_id) => {
  let html = `<!DOCTYPE html><html lang="en"xmlns="http://www.w3.org/1999/xhtml"xmlns:v="urn:schemas-microsoft-com:vml"xmlns:o="urn:schemas-microsoft-com:office:office"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width" /><meta http-equiv="X-UA-Compatible" content="IE=edge" /><meta name="x-apple-disable-message-reformatting" /><title></title><linkhref="https://fonts.googleapis.com/css?family=Josefin+Sans:300,400,600,700|Lato:300,400,700"rel="stylesheet"/><style>html,body{margin: 0 auto !important;padding: 0 !important;height: 100% !important;width: 100% !important;background: #f1f1f1;}* {-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;}div[style*="margin: 16px 0"]{margin: 0 !important;}table,td{mso-table-lspace: 0pt !important;mso-table-rspace: 0pt !important;}table {border-spacing: 0 !important;border-collapse: collapse !important;table-layout: fixed !important;margin: 0 auto !important;}img {-ms-interpolation-mode: bicubic;}a {text-decoration: none;}*[x-apple-data-detectors],.unstyle-auto-detected-links *,.aBn {border-bottom: 0 !important;cursor: default !important;color: inherit !important;text-decoration: none !important;font-size: inherit !important;font-family: inherit !important;font-weight: inherit !important;line-height: inherit !important;}.a6S{display: none !important;opacity: 0.01 !important;}.im{color: inherit !important;}img.g-img + div {display: none !important;}@media only screen and (min-device-width: 320px) and (max-device-width: 374px){u ~ div .email-container { min-width: 320px !important;}}@media only screen and (min-device-width: 375px) and (max-device-width: 413px){u ~ div .email-container{min-width: 375px !important;}}@media only screen and (min-device-width: 414px){u ~ div .email-container {min-width: 414px !important;}}</style><style>.primary {background:#448ef6;}.bg_white {background:#ffffff;}.bg_light {background:#fafafa;}.bg_black {background:#000000;}.bg_dark {background:rgba(0,0,0,0.8);}.email-section {padding:2.5em;}.btn {padding:5px 15px;display:inline-block;}.btn.btn-primary {border-radius:30px;background:#448ef6;color:#ffffff;}.btn.btn-white {border-radius:30px;background:#ffffff;color:#000000;}.btn.btn-white-outline {border-radius:30px;background:transparent;border:1px solid #fff;color:#fff;}h1,h2,h3,h4,h5,h6 {font-family:"Josefin Sans", sans-serif;color:#000000;margin-top:0;font-weight:400;}body {font-family:"Josefin Sans", sans-serif;font-weight:400;font-size:15px;line-height:1.8;color:rgba(0, 0, 0, 0.4);}a {color:#448ef6;}table {}.logo {margin:0;display:inline-block;position:absolute;top:10px;left:0;right:0;margin-bottom:0;}.logo a {color:#fff;font-size:24px;font-weight:700;text-transform:uppercase;font-family:"Josefin Sans", sans-serif;display:inline-block;border:2px solid #fff;line-height:1.3;padding:10px 15px 4px 15px;margin:0;}.logo h1 a span {line-height:1;}.navigation {padding:0;}.navigation li {list-style:none;display:inline-block;margin-left:5px;font-size:13px;font-weight:500;}.navigation li a {color:rgba(0, 0, 0, 0.4);}.hero {position:relative;z-index:0;}.hero .overlay {position:absolute;top:0;left:0;right:0;bottom:0;content:"";width:100%;background:#000000;z-index:-1;opacity:0.3;}.hero .text {color:rgba(255, 255, 255, 0.9);}.hero .text h2 {color:#fff;font-size:40px;margin-bottom:0;font-weight:600;line-height:1;text-transform:uppercase;}.hero .text h2 span {font-weight:600;color:#448ef6;}.heading-section {}.heading-section h2 {color:#000000;font-size:28px;margin-top:0;line-height:1.4;font-weight:700;text-transform:uppercase;letter-spacing:1px;}.heading-section .subheading {margin-bottom:20px !important;display:inline-block;font-size:13px;text-transform:uppercase;letter-spacing:2px;  color:rgba(0, 0, 0, 0.4);  position:relative;}.heading-section .subheading::after {  position:absolute;left:0;right:0;bottom:-10px;content:"";width:100%;height:2px;background:#448ef6;margin:0 auto;}.heading-section-white {color:rgba(255, 255, 255, 0.8);}.heading-section-white h2 {line-height:1;padding-bottom:0;}.heading-section-white h2 {color:#ffffff;}.heading-section-white .subheading {margin-bottom:0;display:inline-block;font-size:13px;text-transform:uppercase;letter-spacing:2px;color:rgba(255, 255, 255, 0.4);}.blog-entry {border:1px solid red;padding-bottom:30px !important;}.text-blog .meta {text-transform:uppercase;font-size:13px;margin-bottom:0;}.footer {color:rgba(255, 255, 255, 0.5);}.footer .heading {color:#ffffff;font-size:20px;}.footer ul {margin:0;padding:0;}.footer ul li {list-style:none;margin-bottom:10px;}.footer ul li a {color:rgba(255, 255, 255, 1);} @media screen and (max-width:500px) {}</style></head><body width="100%"style="margin:0;padding:0 !important;mso-line-height-rule:exactly;background-color:#222222;"><center style="width:100%; background-color:#f1f1f1"><div style="display:none;font-size:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;font-family:sans-serif;">&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;</div><div style="max-width:600px; margin:0 auto" class="email-container"><table align="center" role="presentation"cellspacing="0"cellpadding="0" border="0" width="100%"style="margin:auto"><tr><td valign="middle"class="hero bg_white" style="`;

  let head_article = articles[0];
  html += `background-image:url(${domain_name}/Images/${
    head_article.image
  })background-size:cover;height:400px;"><div class="overlay"></div><table><tr><td><div class="text"style="padding:0 4em; text-align:center"><h1 class="logo"><a href="${client_domain}"><img src='${domain_name}/Images/${"giit_africa_logo_blue.png"}'/></a></h1>
  <h2>${head_article.title}</h2><p>${(
    head_article.sections.find((sec) => sec.type === "paragraph") || {
      text: "",
    }
  ).text.slice(0, 65)}...</p><p><a href="${client_domain}/articles?_id=${
    head_article._id
  }" class="btn btn-primary">Read more</a></p></div></td></tr></table></td></tr><tr><td class="bg_white email-section"><div class="heading-section" style="text-align:center; padding:0 30px"><h2>Best articles in this month</h2></div><table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">`;

  articles.slice(2).map((article) => {
    let text = (
        article.sections.find((sec) => sec.type === "paragraph") || { text: "" }
      ).text.slice(0, 65),
      posted = new Date(article.created);

    html += `<tr><td style="padding-bottom:30px"><table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"><td valign="middle" width="50%"><img src="${domain_name}/Images/${
      article.image
    }" alt=""style="  width:100%;max-width:600px;height:auto;margin:auto;display:block;"/></td><td valign="middle" width="50%"><divclass="text-blog"style="text-align:left; padding-left:25px"><p class="meta"><span>Posted on ${`${
      month_index[posted.getMonth()]
    } ${posted.getDate()}, ${posted.getFullYear()}`}</span><span>${""}</span></p><h2>${
      article.title
    }</h2><p>${text}</p><p><a href="${client_domain}/article?_id=${
      article._id
    }" class="btn btn-primary">more</a></p></div></td></table></td></tr>`;
  });

  let presentation_article = articles[1];
  let posted = new Date(presentation_article.created);
  html += `<tr><td class="bg_white"><table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"><tr><td><a href="${client_domain}/article?_id=${
    presentation_article._id
  }"><img src="${domain_name}/Images/${
    presentation_article.image
  }" alt=""style="width:100%;max-width:600px;height:auto;margin:auto;display:block;"/></a></td></tr><tr><td class="text-blog"style="text-align:center; padding:2em 2.5em"><p class="meta"><span>Posted on ${`${
    month_index[posted.getMonth()]
  } ${posted.getDate()}, ${posted.getFullYear()}`}</span> <span>${""}</span></p>
          <h3 style="font-size:24px">${presentation_article.title}</h3><p>
           ${(
             presentation_article.sections.find(
               (sec) => sec.type === "paragraph"
             ) || { text: "" }
           ).text.slice(0, 150)}
          </p>
          <p><a href="${client_domain}/article?_id=${
    presentation_article._id
  }" class="btn btn-primary">Read more</a></p>
        </td>
      </tr>
    </table>
  </td>
</tr>`;

  html += `<table align="center"role="presentation"cellspacing="0"cellpadding="0"border="0"width="100%"style="margin:auto"><tr><td valign="middle" class="bg_black footer email-section"><table><tr><td valign="top" width="33.333%" style="padding-top:20px"><table role="presentation"cellspacing="0"cellpadding="0"border="0"width="100%"><tr><td style="text-align:left; padding-right:10px"><h3 class="heading">About</h3><p>${"GIIT is a global leader delivering a wide range of management and technical training."}</p></td></tr></table></td><td valign="top" width="33.333%" style="padding-top:20px"><table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"><tr><td style=" text-align:left; padding-left:5px; padding-right:5px;"><h3 class="heading">Contact Info</h3><ul><li><span class="text">3, Obafemi Awolowo way, Ikeja, Lagos State, Nigeria,</span></li><li><a><span class="text">+(234) 806 051 5686</span></a></li></ul></td></tr></table></td><td valign="top" width="33.333%" style="padding-top:20px" <table role="presentation" cellspacing="0" cellpadding="0" border="0"width="100%"><tr><td style="text-align:left; padding-left:10px"><h3 class="heading">Useful Links</h3><ul><li><a href="${client_domain}">Home</a></li><li><a href="${client_domain}/courses">Courses</a></li><li><a href="${client_domain}/about">About</a></li><li><a href="${client_domain}/services">Services</a></li></ul></td></tr></table></td></tr></table></td></tr><tr><td valign="middle" class="bg_black footer email-section"><table><tr><td valign="top" width="33.333%"><table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"><tr><td style="text-align:left; padding-right:10px"><p>&copy; GIIT Africa. All Rights Reserved</p></td></tr></table></td><td valign="top" width="33.333%"><table role="presentation" cellspacing="0" cellpadding="0" border="0"width="100%"><tr><td style="text-align:right;padding-left:5px;padding-right:5px;"><p><a href="${client_domain}/unsubcribe" style="color:rgba(255, 255, 255, 0.4">Unsubcribe</a></p></td></tr></table></td></tr></table></td></tr></table></div></center></body></html>`;
};

const user_generated = (user, key) => {
  return `<div>${JSON.stringify({
    user,
    key,
  })}</div>`;
};

const course_enrolled = (course, student, set) => {
  return `<div>${JSON.stringify({
    course,
    student,
    set,
  })}</div>`;
};

const admission_exam_email = (payload) => {
  return `<div>${JSON.stringify(payload)}</div>`;
};

export {
  verification,
  generate_newsletter,
  admission_exam_email,
  user_generated,
  course_enrolled,
};
