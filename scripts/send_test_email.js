/**
 * Test Email Script — Invio email di test personalizzata a giovannighigliotti96@gmail.com
 * Ottimizzata per finire nella casella PRINCIPALE (In arrivo) senza filtri spam/promozioni.
 */

import nodemailer from "nodemailer";

const CONFIG = {
  mittente: "giovannighigliotti96@gmail.com",
  destinatarioTest: "giovannighigliotti96@gmail.com",
  // Password per le app di Google
  gmailAppPassword: process.env.GMAIL_APP_PASSWORD || "mhyjwrumnatkgqsq",
};

async function sendTestEmail() {
  console.log("🚀 Avvio invio email di TEST a:", CONFIG.destinatarioTest);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: CONFIG.mittente,
      pass: CONFIG.gmailAppPassword,
    },
  });

  const subject = "Scadenza Rata MarshMallow Quartet - Matrimonio 2027";

  const plainText = `Ciao Giovanni,

Questo è un promemoria automatico per la prossima rata del matrimonio in uscita:

📌 FORNITORE: MarshMallow Quartet (Musica)
📝 RATA: Caparra
💰 IMPORTO TOTALE: € 750,00
📅 DATA SCADENZA: 31 luglio 2026 (tra 7 giorni)

---------------------------------------------------
📊 RIPARTIZIONE QUOTE DA SALDARE:
- Quota Silvia: € 375,00
- Quota Fabio & Esther: € 375,00
---------------------------------------------------

Link alla Dashboard Online: https://dashboard-pagamenti-matrimonio.vercel.app

Un caro saluto,
Giovanni Ghigliotti`;

  const htmlText = `
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Scadenza Rata Matrimonio</title>
</head>
<body style="margin: 0; padding: 0; background-color: #080B10; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #F1F5F9;">
  
  <!-- Outer Wrapper Table -->
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #080B10; padding: 32px 16px;">
    <tr>
      <td align="center">
        
        <!-- Main Card Container -->
        <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 580px; background-color: #121824; border: 1px solid #1E293B; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
          
          <!-- Top Accent Gold Line -->
          <tr>
            <td style="background-color: #E2B93B; height: 4px; line-height: 4px; font-size: 1px;">&nbsp;</td>
          </tr>

          <!-- Header Section -->
          <tr>
            <td style="padding: 28px 28px 16px 28px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="font-size: 24px; vertical-align: middle;">💍</span>
                    <strong style="font-size: 20px; font-weight: 700; color: #F1F5F9; margin-left: 8px; vertical-align: middle;">
                      Matrimonio 2027
                    </strong>
                  </td>
                  <td align="right">
                    <span style="background-color: rgba(226,185,59,0.15); color: #E2B93B; border: 1px solid rgba(226,185,59,0.3); font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 20px; text-transform: uppercase;">
                      Prossima Scadenza
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Greeting & Main Banner -->
          <tr>
            <td style="padding: 0 28px 20px 28px;">
              <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #CBD5E1;">
                Ciao <strong>Giovanni</strong>,
              </p>
              <p style="margin: 8px 0 0 0; font-size: 14px; line-height: 1.5; color: #94A3B8;">
                Questo è il promemoria automatico per la prossima rata del matrimonio in scadenza nei prossimi giorni.
              </p>
            </td>
          </tr>

          <!-- Payment Details Box -->
          <tr>
            <td style="padding: 0 28px 20px 28px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0B0E14; border: 1px solid #1E293B; border-radius: 14px; padding: 20px;">
                <tr>
                  <td>
                    <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #E2B93B; margin-bottom: 6px;">
                      Fornitore & Servizio
                    </div>
                    <div style="font-size: 18px; font-weight: 800; color: #F1F5F9;">
                      MarshMallow Quartet <span style="font-size: 12px; font-weight: 500; color: #94A3B8;">(Musica)</span>
                    </div>
                    <div style="font-size: 13px; color: #CBD5E1; margin-top: 2px;">
                      Rata: <strong>Caparra</strong>
                    </div>

                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #1E293B;">
                      <tr>
                        <td>
                          <div style="font-size: 11px; text-transform: uppercase; color: #94A3B8; font-weight: 600;">
                            Importo Rata Totale
                          </div>
                          <div style="font-size: 24px; font-weight: 900; color: #E2B93B; margin-top: 2px;">
                            € 750,00
                          </div>
                        </td>
                        <td align="right">
                          <div style="font-size: 11px; text-transform: uppercase; color: #94A3B8; font-weight: 600;">
                            Data Scadenza
                          </div>
                          <div style="font-size: 15px; font-weight: 700; color: #F43F5E; margin-top: 2px;">
                            31 luglio 2026
                          </div>
                          <div style="font-size: 11px; color: #F59E0B; font-weight: 600; margin-top: 1px;">
                            (tra 7 giorni)
                          </div>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Family Split Section -->
          <tr>
            <td style="padding: 0 28px 24px 28px;">
              <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #94A3B8; margin-bottom: 10px;">
                Ripartizione Quote Da Saldare (50% / 50%)
              </div>

              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td width="48%" style="background-color: #0B0E14; border: 1px solid #1E293B; border-radius: 12px; padding: 14px; text-align: center;">
                    <span style="font-size: 11px; color: #C9A227; font-weight: 700; text-transform: uppercase; display: block; margin-bottom: 4px;">
                      🟡 Silvia
                    </span>
                    <strong style="font-size: 18px; color: #F1F5F9;">€ 375,00</strong>
                  </td>
                  <td width="4%">&nbsp;</td>
                  <td width="48%" style="background-color: #0B0E14; border: 1px solid #1E293B; border-radius: 12px; padding: 14px; text-align: center;">
                    <span style="font-size: 11px; color: #B85C38; font-weight: 700; text-transform: uppercase; display: block; margin-bottom: 4px;">
                      🔴 Fabio & Esther
                    </span>
                    <strong style="font-size: 18px; color: #F1F5F9;">€ 375,00</strong>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Call To Action Button -->
          <tr>
            <td align="center" style="padding: 0 28px 28px 28px;">
              <a href="https://dashboard-pagamenti-matrimonio.vercel.app" target="_blank" style="display: inline-block; background-color: #E2B93B; color: #080B10; font-size: 13px; font-weight: 800; text-decoration: none; padding: 12px 28px; border-radius: 12px; box-shadow: 0 4px 14px rgba(226,185,59,0.3);">
                🔗 Apri Dashboard Pagamenti Online
              </a>
            </td>
          </tr>

          <!-- Footer Section -->
          <tr>
            <td style="background-color: #0B0E14; padding: 20px 28px; border-top: 1px solid #1E293B; text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #64748B; line-height: 1.5;">
                Dashboard Pagamenti Matrimonio 2027 · Mittente: <a href="mailto:giovannighigliotti96@gmail.com" style="color: #94A3B8; text-decoration: none;">giovannighigliotti96@gmail.com</a><br/>
                Questa è un'email personale di servizio riguardante il budget del matrimonio.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;

  const mailOptions = {
    from: '"Giovanni Ghigliotti" <giovannighigliotti96@gmail.com>',
    to: CONFIG.destinatarioTest,
    subject: subject,
    text: plainText,
    html: htmlText,
    headers: {
      "X-Priority": "1",
      "X-MSMail-Priority": "High",
      "Importance": "High",
    },
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email di TEST inviata con successo a:", CONFIG.destinatarioTest);
    console.log("📩 ID Messaggio:", info.messageId);
  } catch (error) {
    console.error("❌ Errore invio email di test:", error.message);
  }
}

sendTestEmail();
