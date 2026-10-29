import { Resend } from "resend";
import { config } from "../config/config.js";

const resend = new Resend(config.RESEND_API_KEY);

export const sendVerificationEmail = async ({ to, name, verificationUrl }) => {
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify your Drift account</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f8fafc;
                color: #0f172a;
            }
            .wrapper {
                max-width: 580px;
                margin: 40px auto;
                background: #ffffff;
                border: 1px solid #e2e8f0;
                border-radius: 12px;
                overflow: hidden;
            }
            .header {
                background: #09090b;
                padding: 28px 32px;
                text-align: center;
            }
            .brand {
                font-size: 24px;
                font-weight: 800;
                letter-spacing: 0.15em;
                color: #ffffff;
                margin: 0;
                text-transform: uppercase;
            }
            .content {
                padding: 36px 32px;
            }
            .title {
                font-size: 20px;
                font-weight: 700;
                color: #0f172a;
                margin: 0 0 16px;
            }
            .text {
                font-size: 15px;
                line-height: 1.6;
                color: #475569;
                margin: 0 0 24px;
            }
            .btn-container {
                text-align: center;
                margin: 32px 0;
            }
            .btn {
                background-color: #09090b;
                color: #ffffff !important;
                display: inline-block;
                padding: 14px 32px;
                font-size: 15px;
                font-weight: 600;
                text-decoration: none;
                border-radius: 8px;
                letter-spacing: 0.02em;
            }
            .footer {
                padding: 24px 32px;
                background: #f8fafc;
                border-top: 1px solid #f1f5f9;
                font-size: 13px;
                color: #94a3b8;
                line-height: 1.5;
            }
            .fallback-link {
                color: #0284c7;
                word-break: break-all;
                font-size: 13px;
            }
        </style>
    </head>
    <body>
        <div class="wrapper">
            <div class="header">
                <h1 class="brand">DRIFT</h1>
            </div>
            <div class="content">
                <h2 class="title">Verify your email address</h2>
                <p class="text">Hi ${name || "there"},</p>
                <p class="text">Thank you for joining Drift. To activate your account and start shopping, please click the button below to verify your email address:</p>
                <div class="btn-container">
                    <a href="${verificationUrl}" class="btn" target="_blank">Verify Account</a>
                </div>
                <p class="text" style="font-size: 13px; color: #64748b; margin-top: 24px;">This link will expire in 24 hours. If you did not create a Drift account, you can safely ignore this email.</p>
            </div>
            <div class="footer">
                <p style="margin: 0 0 8px;">If the button above does not work, paste this URL into your browser:</p>
                <a href="${verificationUrl}" class="fallback-link">${verificationUrl}</a>
                <p style="margin: 16px 0 0; font-size: 12px;">© ${new Date().getFullYear()} DRIFT. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    return await resend.emails.send({
        from: config.EMAIL_FROM,
        to,
        subject: "Verify your email address | DRIFT",
        html: htmlContent,
    });
};
