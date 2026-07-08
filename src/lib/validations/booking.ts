import { z } from 'zod';

export const bookingDetailsSchema = z.object({
  serviceId: z.string().min(1, 'Please select a service'),

  // Customer Details
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  customerPhone: z.string()
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number')
    .transform(phone => `+91${phone}`), // Normalize to E.164
  customerEmail: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
  addressLine1: z.string().min(5, 'Address Line 1 must be at least 5 characters'),
  addressLine2: z.string().optional(),
  pincode: z.string().regex(/^\d{6}$/, 'Please enter a valid 6-digit PIN code (e.g. 500019)'),

  // Patient Details
  patientName: z.string().min(2, 'Patient name must be at least 2 characters'),
  patientAge: z.coerce.number().int().min(1, 'Age must be positive').max(120, 'Please enter a valid age'),
  patientGender: z.enum(['Male', 'Female', 'Other'], {
    errorMap: () => ({ message: 'Please select patient gender' }),
  }),

  // Schedule
  startDate: z.string().min(1, 'Please select a start date'),
  endDate: z.string().min(1, 'Please select an end date'),
  shiftType: z.enum(['DAY_12HR', 'NIGHT_12HR', 'FULL_24HR', 'HOURLY'], {
    errorMap: () => ({ message: 'Please select a shift duration' }),
  }),

  // Clinical Notes (PII / PHI)
  medicalConditions: z.string().min(5, 'Please summarize the patient\'s medical conditions'),
  specialInstructions: z.string().optional(),

  // DPDP Consent Checkbox
  consentGiven: z.literal(true, {
    errorMap: () => ({ message: 'You must consent to data processing for care coordination' }),
  }),
});

export type BookingDetailsInput = z.infer<typeof bookingDetailsSchema>;
