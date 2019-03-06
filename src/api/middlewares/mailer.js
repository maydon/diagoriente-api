const nodemailer = require('nodemailer');

// async..await is not allowed in global scope, must use a wrapper

exports.mailer = async (to) => {
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

  // setup email data with unicode symbols
  const mailOptions = {
    from: '"trouveTaVoie 👻" <beta.gov.consulting@gmail.com>', // sender address
    to, // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world?', // plain text body
    html: '<b>Hello world?</b>' // html body
  };

  // send mail with defined transport object
  const info = await transporter.sendMail(mailOptions);
  return info;
  // Preview only available when sending through an Ethereal account
  //console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
};
