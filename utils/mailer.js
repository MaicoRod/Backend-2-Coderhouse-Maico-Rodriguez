import nodemailer from 'nodemailer';
import config from '../config/config.js';

let transporter;

if (config.MAIL_USER && config.MAIL_PASS) {
    transporter = nodemailer.createTransport({
        host: config.MAIL_HOST,
        port: config.MAIL_PORT,
        secure: config.MAIL_SECURE,
        auth: { user: config.MAIL_USER, pass: config.MAIL_PASS },
    });
} else {
    transporter = null;
    console.log('MAILER: sin credenciales SMTP; se usará console.log para los enlaces de reset.');
}

export async function sendPasswordReset(to, link) {
    if (!transporter) {
        console.log('RESET LINK =>', link, ' (destinatario:', to, ')');
        return;
    }
    await transporter.sendMail({
        from: config.MAIL_FROM,
        to,
        subject: 'Restablecer contraseña',
        html: `
      <p>Hacé click para restablecer tu contraseña. El enlace expira en 1 hora.</p>
      <p><a href="${link}">Restablecer contraseña</a></p>
    `,
    });
}
