const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');

const groupe2 = path.join(
  __dirname,
  '../templates/accountValidation/assets/groupe2.png'
);
const groupe1 = path.join(
  __dirname,
  '../templates/accountValidation/assets/groupe1.png'
);
const gpi2 = path.join(
  __dirname,
  '../templates/accountValidation/assets/gpi2.png'
);
const orangex2 = path.join(
  __dirname,
  '../templates/accountValidation/assets/orangex2.png'
);

// async..await is not allowed in global scope, must use a wrapper

exports.mailer = async (to, data) => {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing

  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'beta.gov.consulting@gmail.com',
      pass: 'ttvwxcv1234'
    }
  });

  const { profile, email, _id } = data;

  const name = profile.lastName || `  ${profile.firstName}` || '';

  const html = await ejs.renderFile(
    path.join(__dirname, '../templates/accountValidation/index.ejs'),
    { name, email, id: _id.toString() }
  );

  // setup email data with unicode symbols
  const mailOptions = {
    from: '"DiagOriente Beta" <beta.gov.consulting@gmail.com>', // sender address
    to, // list of receivers
    subject: 'DiagOriente Beta inscription ✔', // Subject line
    html, // html body
    attachments: [
      {
        filename: 'groupe2.png',
        path: groupe2,
        cid: 'unique@groupe2' // same cid value as in the html img src
      },
      {
        filename: 'groupe1.png',
        path: groupe1,
        cid: 'unique@groupe1' // same cid value as in the html img src
      },
      {
        filename: 'gpi2.png',
        path: gpi2,
        cid: 'unique@gpi2' // same cid value as in the html img src
      },
      {
        filename: 'orangex2.png',
        path: orangex2,
        cid: 'unique@orangex2' // same cid value as in the html img src
      }
    ]
  };

  // send mail with defined transport object
  const info = await transporter.sendMail(mailOptions);
  return info;
};
