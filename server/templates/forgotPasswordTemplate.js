export const forgotPasswordTemplate = (name, url) => `
<h2> Hello ${name} </h2>
<p> Reset your password </p>
<a href = "${url}"> Reset Password </a>
<p> Link expires in 1hour. </p>
`;