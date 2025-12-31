import SibApiV3Sdk from "sib-api-v3-sdk";

const client = SibApiV3Sdk.ApiClient.instance;
client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

const sender = {
  email: process.env.SENDER_EMAIL,
  name: "Hotel Booking",
};

export const sendConfirmBookingEmail = async ({
  to,
  username,
  booking,
  hotelName,
  confirmUrl,
}) => {
  return tranEmailApi.sendTransacEmail({
    sender,
    to: [{ email: to }],
    subject: "Confirm your booking",
    htmlContent: `
      <h2>🏨 Confirm Your Booking</h2>
      <p>Hello <b>${username}</b>,</p>
      <p>Please confirm your booking:</p>

      <ul>
        <li><b>Hotel:</b> ${hotelName}</li>
        <li><b>Check-in:</b> ${booking.checkInDate.toDateString()}</li>
        <li><b>Check-out:</b> ${booking.checkOutDate.toDateString()}</li>
        <li><b>Total:</b> $${booking.totalPrice}</li>
      </ul>

      <a href="${confirmUrl}"
        style="display:inline-block;padding:12px 20px;
        background:#2563eb;color:#fff;border-radius:6px;text-decoration:none">
        ✅ Confirm Booking
      </a>

      <p style="color:red">This link expires in 24 hours.</p>
    `,
  });
};

export const sendBookingConfirmedEmail = async ({
  to,
  username,
  booking,
  hotelName,
}) => {
  return tranEmailApi.sendTransacEmail({
    sender,
    to: [{ email: to }],
    subject: "Your booking is confirmed",
    htmlContent: `
      <h2>✅ Booking Confirmed</h2>
      <p>Hello <b>${username}</b>,</p>
      <p>Your booking at <b>${hotelName}</b> has been confirmed.</p>

      <ul>
        <li><b>Check-in:</b> ${booking.checkInDate.toDateString()}</li>
        <li><b>Check-out:</b> ${booking.checkOutDate.toDateString()}</li>
      </ul>
    `,
  });
};
