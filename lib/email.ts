import nodemailer from "nodemailer";

export async function sendConfirmationEmails(data: {
  consultationTitle: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  date: string;
  time: string;
  notes?: string;
}) {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.FROM_EMAIL;
  const admin = process.env.ADMIN_EMAIL;

  if (!host || !user || !pass || !from || !admin) {
    throw new Error("Missing SMTP email settings.");
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  const customerHtml = `
    <div style="font-family:Arial,sans-serif;color:#2b241f;line-height:1.6">
      <h2 style="font-family:Georgia,serif;font-weight:400">Your appointment has been confirmed</h2>
      <p>Dear ${data.name},</p>
      <p>Thank you for booking your appointment with Minar Jewellers.</p>
      <p><strong>Consultation:</strong> ${data.consultationTitle}<br>
      <strong>Date:</strong> ${data.date}<br>
      <strong>Time:</strong> ${data.time}<br>
      <strong>Location:</strong> Minar Jewellers, 181 Upper Tooting Road, London SW17 7TG</p>
      <p>We look forward to welcoming you.</p>
      <p>Minar Jewellers</p>
    </div>
  `;

  const adminHtml = `
    <div style="font-family:Arial,sans-serif;color:#2b241f;line-height:1.6">
      <h2>New Appointment Booking</h2>
      <p><strong>Consultation:</strong> ${data.consultationTitle}</p>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      <p><strong>Address:</strong> ${data.address}</p>
      <p><strong>Date:</strong> ${data.date}</p>
      <p><strong>Time:</strong> ${data.time}</p>
      <p><strong>Notes:</strong> ${data.notes || "None"}</p>
    </div>
  `;

  await transporter.sendMail({
    from,
    to: data.email,
    subject: "Your Minar Jewellers appointment is confirmed",
    html: customerHtml,
  });

  await transporter.sendMail({
    from,
    to: admin,
    subject: `New Minar appointment - ${data.consultationTitle}`,
    html: adminHtml,
  });
}
