import transporter from "./nodeMailer.js"

export const sendEmail = async(email, subject, html) => {
    await transporter.sendMail({
        from : process.env.EMAIL_USER,
        to : email,
        subject,
        html
    })
};