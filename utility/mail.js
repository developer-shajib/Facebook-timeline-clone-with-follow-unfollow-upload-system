import nodemailer from 'nodemailer';




export const createMail = async (to,sub,data)=>{

  try {
    const transport = nodemailer.createTransport({
        host : process.env.Email_HOST,
        port : process.env.Email_PORT,
        auth : {
            user : process.env.Email_USER,
            pass : process.env.Email_PASS
        }
    });

    await transport.sendMail({
        from : `"Facebook" <${process.env.Email_USER}>`,
        to : to,
        subject : sub,
        html : `
        <!DOCTYPE html><html lang="en"><head> <meta charset="UTF-8"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>Verify Your Account</title> <link href="https://fonts.googleapis.com/css2?family=Comforter+Brush&family=Dosis:wght@200;300;400;500;600;700;800&display=swap" rel="stylesheet"> <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css"> <style>*{margin: 0; padding: 0; font-family: 'Dosis', sans-serif;}.wrapper{width: 100%; height: 100vh; background: #bababaee; margin: auto; padding: 137px 0px;}.container{background: white; width: 45%; margin: auto; border-radius: 5px;}.body-container{padding: 0px 43px;}.email_head a{font-size: 34px;}.email_head{padding-top: 28px; padding-bottom: 11px;}p.name{font-size: 28px; padding: 13px 0px; font-weight: 600; letter-spacing: .5px;}p.para1{font-size: 23px; font-weight: 400; line-height: 32px; padding-bottom: 44px;}a.verify_btn{background: #dc0606; color: white; text-decoration: none; font-size: 22px; font-weight: 600; letter-spacing: .6px; padding: 5px 38px; border-radius: 6px;}p.para2{font-size: 21px; padding-top: 23px; padding-bottom: 35px;}.email_footer p{font-size: 21px; background: black; color: white; text-align: center; padding: 17px 0px; margin-top: 27px;}</style></head><body> <div class="wrapper"> <div class="container"> <div class="body-container"> <div class="email_head"> <a href="#"><i class="fa-brands fa-facebook"></i></a> </div><hr> <div class="email_body"> <p class="name">Hi ${data.surName}</p><p class="para1">We received a request New Account verification.Your email is ${data.email}. Enter the following Email Verification button</p><a class="verify_btn" href="${data.link}">Verify</a> <p class="para2">If you want to know about to us go to our website. </p></div></div><div class="email_footer"> <p>©All right reserved by developershajib</p></div></div></div></body></html>
        `

    })
  } catch (error) {
    console.log(error.message);
  }


}


