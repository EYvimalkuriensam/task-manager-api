const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "vimalkuriensam1992@gmail.com",
    subject: "Thanks for joining in!",
    text: `Welcome to the app, ${name}. Let me know how you get along with the app`
  });
};

const sendCancellationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "vimalkuriensam1992@gmail.com",
    subject: "Sorry to see you go!",
    text: `It was really nice that you participated in the progress of our app as a valuable customer. We are really sorry to see you go, ${name}. Please write to us incase if there is something we could have done to have kept you using our application`
  });
};

module.exports = {
  sendWelcomeEmail,
  sendCancellationEmail
};
