/**
 * WhatsApp Notification Dispatcher (AISensy / Wati / Twilio API Wrapper)
 * Supports automated server-side message dispatch to Customers, Nurses, and Admin.
 */

interface WhatsAppPayload {
  phoneNumber: string;
  templateName: string;
  parameters: string[];
}

/**
 * Low-level HTTP caller to WhatsApp Business CSP Endpoint
 */
export async function callWhatsAppApi(payload: WhatsAppPayload): Promise<boolean> {
  const apiKey = process.env.WHATSAPP_API_KEY;
  const endpoint = process.env.WHATSAPP_API_ENDPOINT; // e.g. https://api.aisensy.com/v1/send

  if (!apiKey || !endpoint) {
    console.error('[WHATSAPP DISPATCH ERROR] Messaging integration is not configured.');
    return false;
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        apiKey,
        campaignName: payload.templateName,
        destination: payload.phoneNumber,
        userName: payload.parameters[0] || 'Customer',
        source: 'neetha-website',
        templateParams: payload.parameters,
      }),
    });

    const data = await response.json();
    return response.ok && data.success;
  } catch (err) {
    console.error('[WHATSAPP DISPATCH ERROR] Failed to send message:', err);
    return false;
  }
}

/**
 * 1. Send Booking Confirmation alert to Customer
 */
export async function sendBookingConfirmation(
  phone: string,
  customerName: string,
  bookingNumber: string,
  serviceName: string
) {
  const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;

  return callWhatsAppApi({
    phoneNumber: formattedPhone,
    templateName: 'booking_received_neetha',
    parameters: [
      customerName,       // Parameter 1: Name
      bookingNumber,      // Parameter 2: Reference
      serviceName,        // Parameter 3: Service type
    ],
  });
}

/**
 * 2. Send Nurse details to Customer on assignment
 */
export async function sendNurseAssignment(
  phone: string,
  customerName: string,
  bookingNumber: string,
  nurseName: string,
  nursePhone: string
) {
  const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;

  return callWhatsAppApi({
    phoneNumber: formattedPhone,
    templateName: 'nurse_assigned_neetha',
    parameters: [
      customerName,       // Parameter 1: Name
      bookingNumber,      // Parameter 2: Reference
      nurseName,          // Parameter 3: Nurse Name
      nursePhone,         // Parameter 4: Nurse Contact
    ],
  });
}

/**
 * 3. Send Patient Assignment Dispatch to Nurse (Location/Address Only, Patient Phone Hidden)
 */
export async function sendNurseJobDispatch(
  nursePhone: string,
  nurseName: string,
  bookingNumber: string,
  serviceName: string,
  patientName: string,
  locationAddress: string
) {
  const formattedPhone = nursePhone.startsWith('+') ? nursePhone : `+91${nursePhone}`;

  return callWhatsAppApi({
    phoneNumber: formattedPhone,
    templateName: 'job_dispatch_nurse_neetha',
    parameters: [
      nurseName,
      bookingNumber,
      serviceName,
      patientName,
      locationAddress, // Service location and address (No patient phone)
    ],
  });
}

/**
 * 4. Send Immediate Lead Notification to Admin
 */
export async function sendAdminNewBookingAlert(details: {
  bookingNumber: string;
  customerName: string;
  customerPhone: string;
  area: string;
  serviceName: string;
  price: number;
  promoCode?: string;
  message?: string;
  hasPrescription: boolean;
}) {
  const adminPhone = process.env.ADMIN_WHATSAPP_PHONE || '+918341069693';
  const formattedPhone = adminPhone.startsWith('+') ? adminPhone : `+91${adminPhone}`;

  return callWhatsAppApi({
    phoneNumber: formattedPhone,
    templateName: 'admin_lead_alert_neetha',
    parameters: [
      details.bookingNumber,
      details.customerName,
      details.customerPhone,
      details.area,
      details.serviceName,
      `Rs. ${details.price}`,
      details.promoCode || 'None',
      details.message || 'None',
      details.hasPrescription ? 'Yes (Prescription Attached)' : 'No',
    ],
  });
}

/**
 * 5. Send Completed notification with payment update
 */
export async function sendBookingCompleted(
  phone: string,
  customerName: string,
  bookingNumber: string,
  totalAmount: number
) {
  const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;

  return callWhatsAppApi({
    phoneNumber: formattedPhone,
    templateName: 'booking_completed_neetha',
    parameters: [
      customerName,
      bookingNumber,
      `Rs. ${totalAmount}`,
    ],
  });
}

/**
 * 6. Send Customer Login / Verification OTP via SMS or WhatsApp
 */
export async function sendCustomerOtp(
  phone: string,
  otpCode: string,
  channel: 'WHATSAPP' | 'SMS' = 'WHATSAPP'
) {
  const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;

  return callWhatsAppApi({
    phoneNumber: formattedPhone,
    templateName: 'customer_login_otp_neetha',
    parameters: [
      otpCode,
      '5 minutes',
    ],
  });
}
