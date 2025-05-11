export const JOIN_TEAM_SWEDISH = (
  invitatorName,
  organisationName,
  redirectUrl,
  invitationId,
  teamName
) => {
  const invitationText = teamName
    ? `${invitatorName} har bjudit in dig till teamet "${teamName}" hos ${organisationName} på NordicPro`
    : `${invitatorName} har bjudit in dig till ${organisationName} på NordicPro`;

  return `
   <!DOCTYPE html>
<html lang="sv">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Inbjudan till NordicPro-team</title>
    <link
      href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap"
      rel="stylesheet"
    />
    <style>
      /* Base styles */
      body {
        font-family: 'Poppins', Arial, sans-serif;
        line-height: 1.6;
        color: #333333;
        background-color: #f8fafc;
        margin: 0;
        padding: 0;
      }

      .container {
        width: 100%;
        max-width: 600px;
        margin: 20px auto;
        padding: 0;
      }

      .email-wrapper {
        background-color: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        overflow: hidden;
      }

      .header {
        background-color: #f8fafc;
        padding: 40px 20px;
      }

      .logo img {
        max-height: 80px;
        max-width: 200px;
        width: auto;
        display: block;
        margin: 0 auto;
        padding: 10px;
      }

      .content {
        padding: 40px 30px;
      }

      h1 {
        color: #007bff;
        font-size: 26px;
        font-weight: 700;
        margin: 0 0 20px;
      }

      p {
        margin: 0 0 16px;
        color: #555555;
      }

      .highlight {
        background-color: #e6f0ff;
        border-left: 4px solid #007bff;
        padding: 20px;
        margin: 20px 0;
        border-radius: 8px;
        text-align: left;
      }

      .button {
        display: inline-block;
        background-color: #ff4500;
        color: #ffffff;
        text-decoration: none;
        padding: 14px 32px;
        border-radius: 50px;
        font-weight: 600;
        font-size: 16px;
        margin: 20px 0;
      }

      .info-box {
        background-color: #f8fafc;
        border-radius: 8px;
        padding: 20px;
        margin: 20px 0;
        text-align: left;
      }

      .info-label {
        font-weight: 600;
        color: #007bff;
        margin-bottom: 8px;
      }

      .footer {
        background-color: #f1f5f9;
        padding: 20px;
        text-align: center;
        font-size: 14px;
        color: #6b7280;
      }

      .social-links {
        margin-top: 15px;
      }

      .social-link {
        display: inline-block;
        margin: 0 12px;
        color: #007bff;
        text-decoration: none;
        font-weight: 600;
      }

      /* Responsive design */
      @media only screen and (max-width: 600px) {
        .container {
          margin: 10px;
          padding: 0;
        }

        .content {
          padding: 20px;
        }

        h1 {
          font-size: 22px;
        }

        .button {
          padding: 12px 24px;
          font-size: 14px;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="email-wrapper">
        <div class="header">
          <a class="logo" href="https://nordicpro.se">
            <img
              src="https://nordicpro.se/images/nordic-pro-logo.png"
              alt="NordicPro Logo"
              border="0"
            />
          </a>
        </div>

        <div class="content">
          <h1>${invitationText}</h1>

          <p>
            Du har blivit inbjuden att gå med i ett team på NordicPro – plattformen
            som samlar mental hälsa, motivation och laghantering på ett och samma
            ställe.
          </p>

          <div class="highlight">
            <p>
              Genom att gå med i teamet får du tillgång till alla verktyg och resurser 
              som NordicPro erbjuder för att förbättra lagsamarbete, mental hälsa och 
              prestationsförmåga.
            </p>
          </div>

          <h2>Teamets information</h2>

          <div class="info-box">
            ${
              teamName
                ? `<p style="margin: 0 0 8px;"><span class="info-label">Team:</span> ${teamName}</p>`
                : ``
            }
            <p style="margin: 0 0 8px;"><span class="info-label">Organisation:</span> ${organisationName}</p>
            <p style="margin: 0 0 8px;"><span class="info-label">Inbjuden av:</span> ${invitatorName}</p>
          </div>

          <p>
            Klicka på knappen nedan för att registrera dig och gå med i teamet. Det tar bara några minuter!
          </p>

          <div style="text-align: center;">
            <a href="${redirectUrl}/register?invitationId=${invitationId}" class="button">
              Registrera dig på NordicPro
            </a>
          </div>

          <p>
            Har du frågor eller behöver hjälp? Kontakta oss på
            <a href="mailto:info@nordicpro.se">info@nordicpro.se</a>.
          </p>

          <p>
            Vänliga hälsningar,<br />Teamet bakom NordicPro
          </p>
        </div>

        <div class="footer">
          <p>© 2025 NordicPro. Alla rättigheter förbehållna.</p>
          <p>
            Du får detta e-postmeddelande eftersom du har blivit inbjuden till ett team på NordicPro.
          </p>
          <div class="social-links">
            <a href="https://www.linkedin.com/company/nordicpro" class="social-link">LinkedIn</a>
            <a href="https://instagram.com/_nordicpro" class="social-link">Instagram</a>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
  `;
};
