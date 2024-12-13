export function forgotPasswordTemplate(resetLink: string) {
  return `<h1>Reset Your Password</h1>
<p>Click the link below to reset your password:</p>
<a href=" ${resetLink}">Reset Password</a>`;
}

export function sendOTPTemplate(otp: number) {
  return `<p>Use the following code to complete your verification process:</p>
<h2>{${otp}}</h2>`;
}
