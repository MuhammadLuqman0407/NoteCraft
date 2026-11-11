export function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export function getOtpHtml(otp) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>Verify OTP</title>
      <style>
        body { font-family: Arial, sans-serif; background:#f4f6f8; padding:20px; }
        .box { background:white; padding:24px; border-radius:10px; max-width:420px; margin:auto; }
        .otp { font-size:28px; font-weight:bold; letter-spacing:4px; color:#4f46e5; }
      </style>
    </head>
    <body>
      <div class="box">
        <h2>Your OTP Code</h2>
        <p>Please use this code to verify your email.</p>
        <div class="otp">${otp}</div>
      </div>
    </body>
    </html>
  `;
}