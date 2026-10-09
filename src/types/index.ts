export type UserRole = 'CUSTOMER' | 'PANDIT' | 'ADMIN' | 'SUPPORT';

export type VerificationStatus = 
  | 'NOT_SUBMITTED' 
  | 'PENDING_REVIEW' 
  | 'MORE_INFO_REQUIRED' 
  | 'APPROVED' 
  | 'REJECTED' 
  | 'SUSPENDED';

export type BookingStatus = 
  | 'DRAFT'
  | 'PENDING_CONFIRMATION'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REFUNDED';

export type BookingMode = 'INSTANT' | 'REQUEST_BASED';

export type SamagriOption = 
  | 'CUSTOMER_ARRANGED' 
  | 'PARTIAL_SAMAGRI' 
  | 'FULL_SAMAGRI_INCLUDED';

export type PackageTier = 'BASIC' | 'STANDARD' | 'PREMIUM';

export type PaymentProvider = 'RAZORPAY' | 'SANDBOX_SIMULATOR';

export type PaymentStatus = 'INITIATED' | 'SUCCESS' | 'FAILED' | 'REFUNDED';

export interface PriceBreakdown {
  panditFee: number;
  samagriCost: number;
  travelCost: number;
  platformFee: number;
  taxes: number;
  totalAmount: number;
  currency: string;
}

export interface AuthSession {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string | null;
  avatarUrl?: string | null;
}
