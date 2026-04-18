const nodemailer = require("nodemailer");

const APP_NAME = process.env.APP_NAME || "ExpenseTracker";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(value || 0);

const baseTemplate = ({ title, subtitle, content, ctaLabel, ctaLink }) => `
  <div style="background:#0a0a0a;padding:32px 16px;font-family:Montserrat,Arial,sans-serif;color:#ffffff;">
    <div style="max-width:620px;margin:0 auto;background:#111111;border:1px solid #222222;border-radius:24px;overflow:hidden;">
      <div style="padding:32px;border-bottom:1px solid #1f1f1f;background:linear-gradient(135deg,#0f172a 0%,#0a0a0a 45%,#052e16 100%);">
        <div style="font-size:32px;font-weight:900;letter-spacing:0.02em;color:#22c55e;">₹ ${APP_NAME}</div>
        <div style="margin-top:16px;font-size:28px;font-weight:800;color:#ffffff;">${title}</div>
        <div style="margin-top:8px;font-size:14px;line-height:1.6;color:#a3a3a3;">${subtitle}</div>
      </div>
      <div style="padding:32px;">
        ${content}
        ${
          ctaLink
            ? `<div style="margin-top:28px;">
                <a href="${ctaLink}" style="display:inline-block;padding:14px 22px;background:#22c55e;color:#03150a;text-decoration:none;border-radius:999px;font-size:14px;font-weight:800;">
                  ${ctaLabel}
                </a>
              </div>`
            : ""
        }
      </div>
    </div>
  </div>
`;

const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  });
};

const sendMagicLink = async (email, link) => {
  const html = baseTemplate({
    title: "Your secure login link",
    subtitle: `Tap the button below to sign in to ${APP_NAME}. This link expires in 15 minutes.`,
    ctaLabel: "Open Magic Link",
    ctaLink: link,
    content: `
      <div style="font-size:15px;line-height:1.8;color:#e5e7eb;">
        <p style="margin:0 0 14px;">Use this one-time sign-in link to access your tracker.</p>
        <div style="padding:18px;background:#0b0b0b;border:1px solid #1f2937;border-radius:18px;color:#22c55e;word-break:break-all;">
          ${link}
        </div>
      </div>
    `,
  });

  await sendEmail({
    to: email,
    subject: `Your ${APP_NAME} Login Link`,
    html,
  });
};

const sendDailySummary = async (user, summaryData) => {
  const transactionItems = summaryData.transactions
    .map((transaction) => {
      const amountColor = transaction.type === "expense" ? "#ef4444" : "#22c55e";
      const prefix = transaction.type === "expense" ? "-" : "+";
      return `
        <div style="padding:14px 16px;margin-bottom:10px;background:#0b0b0b;border:1px solid #1f1f1f;border-radius:16px;">
          <div style="display:flex;justify-content:space-between;gap:12px;align-items:center;">
            <div>
              <div style="font-size:15px;font-weight:800;color:#ffffff;">${transaction.reason}</div>
              <div style="font-size:12px;color:#9ca3af;">${transaction.category} · ${transaction.time}</div>
            </div>
            <div style="font-size:15px;font-weight:900;color:${amountColor};">${prefix}${formatCurrency(transaction.amount)}</div>
          </div>
        </div>
      `;
    })
    .join("");

  const html = baseTemplate({
    title: "Your daily money snapshot",
    subtitle: `A quick look at how today moved for your money on ${summaryData.dateLabel}.`,
    content: `
      <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;">
        <div style="padding:18px;background:#052e16;border:1px solid #14532d;border-radius:18px;">
          <div style="font-size:12px;color:#bbf7d0;">Total earned today</div>
          <div style="margin-top:8px;font-size:24px;font-weight:900;color:#22c55e;">${formatCurrency(summaryData.totalIncome)}</div>
        </div>
        <div style="padding:18px;background:#450a0a;border:1px solid #7f1d1d;border-radius:18px;">
          <div style="font-size:12px;color:#fecaca;">Total spent today</div>
          <div style="margin-top:8px;font-size:24px;font-weight:900;color:#ef4444;">${formatCurrency(summaryData.totalExpenses)}</div>
        </div>
      </div>
      <div style="margin-top:24px;font-size:15px;font-weight:800;color:#ffffff;">Today's transactions</div>
      <div style="margin-top:16px;">${transactionItems}</div>
    `,
  });

  await sendEmail({
    to: user.email,
    subject: "💸 Your Daily Expense Summary",
    html,
  });
};

const sendRecurringIncomeReminder = async (user, incomeSource) => {
  const html = baseTemplate({
    title: `Reminder: add your ${incomeSource.sourceName} income`,
    subtitle: "A recurring income is due today, so this is your nudge to record it in the app.",
    ctaLabel: "Open ExpenseTracker",
    ctaLink: process.env.FRONTEND_URL,
    content: `
      <div style="padding:18px;background:#052e16;border:1px solid #14532d;border-radius:18px;color:#e5e7eb;line-height:1.8;">
        It's time to add your recurring <strong>${incomeSource.sourceName}</strong> income of
        <span style="color:#22c55e;font-weight:900;">${formatCurrency(incomeSource.amount)}</span>.
        Open the app to confirm.
      </div>
    `,
  });

  await sendEmail({
    to: user.email,
    subject: `💰 Reminder: Add your ${incomeSource.sourceName} income`,
    html,
  });
};

module.exports = {
  sendDailySummary,
  sendMagicLink,
  sendRecurringIncomeReminder,
};
