/**
 * WhatsApp Notification Dispatcher (AISensy / Wati / Twilio API Wrapper)
 * Sourced for Indian healthcare consumer expectations.
 */

interface WhatsAppPayload {
  phoneNumber: string;
  templateName: string;
  parameters: string[];
}

/**
 * Low-level HTTP caller to WhatsApp Business CSP Endpoint
 */
async function callWhatsAppApi(payload: WhatsAppPayload): Promise<boolean> {
  const apiKey = process.env.WHATSAPP_API_KEY;
  const endpoint = process.env.WHATSAPP_API_ENDPOINT; // e.g. https://api.aisensy.com/v1/send

  console.log(`[WHATSAPP DISPATCH LOG] Target: ${payload.phoneNumber} | Template: ${payload.templateName} | Params:`, payload.parameters);

  if (!apiKey || !endpoint) {
    console.log('[WHATSAPP DISPATCH LOG] Integration credentials missing. Logging to console only (stub mode).');
    return true;
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
  // Normalize phone to E.164 without prefix duplicates
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
 * 3. Send Completed notification with payment update
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
