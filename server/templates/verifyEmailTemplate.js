export const verifyEmailTemplate = (name, url) => `
<h2> Hello ${name} </h2>
<p> Please verify your email </p>
<a href = "${url}">verify Email </a>
<p> Link expires in 1hour. </p>
`;
