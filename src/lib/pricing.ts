import { PriceBreakdown, SamagriOption } from '@/types';

export interface PackagePricingInput {
  basePanditFee: number;
  baseSamagriCost: number;
  samagriOption: SamagriOption;
  locality?: string;
  isCustomPandit?: boolean;
}

export const PLATFORM_COMMISSION_PERCENT = 15; // 15%
export const STANDARD_TRAVEL_FEE = 300; // Flat intra-city travel allowance

/**
 * Calculates complete, validated server-side price breakdown.
 * All values are integer amounts in INR (no floating-point rounding errors).
 */
export function calculateBookingPrice(input: PackagePricingInput): PriceBreakdown {
  const panditFee = Math.round(input.basePanditFee);

  let samagriCost = 0;
  if (input.samagriOption === 'FULL_SAMAGRI_INCLUDED') {
    samagriCost = Math.round(input.baseSamagriCost);
  } else if (input.samagriOption === 'PARTIAL_SAMAGRI') {
    samagriCost = Math.round(input.baseSamagriCost * 0.5);
  } else {
    samagriCost = 0; // Customer provides all samagri
  }

  const travelCost = STANDARD_TRAVEL_FEE;
  
  // Platform fee: 10% of pandit fee + base service facilitation fee (min 150)
  const platformFee = Math.max(150, Math.round(panditFee * 0.10));
  
  // Applicable GST or service tax (5% on service elements)
  const taxableAmount = platformFee;
  const taxes = Math.round(taxableAmount * 0.18); // 18% GST on platform fee only

  const totalAmount = panditFee + samagriCost + travelCost + platformFee + taxes;

  return {
    panditFee,
    samagriCost,
    travelCost,
    platformFee,
    taxes,
    totalAmount,
    currency: 'INR',
  };
}

/**
 * Calculates partner payout vs platform earnings.
 */
export function calculatePartnerPayout(priceBreakdown: PriceBreakdown): {
  panditPayoutAmount: number;
  platformCommissionAmount: number;
} {
  // Pandit receives 100% of travel cost + 100% of samagri reimbursement + (pandit fee - 15% commission)
  const commissionFromPanditFee = Math.round((priceBreakdown.panditFee * PLATFORM_COMMISSION_PERCENT) / 100);
  const panditShareOfFee = priceBreakdown.panditFee - commissionFromPanditFee;
  
  const panditPayoutAmount = panditShareOfFee + priceBreakdown.samagriCost + priceBreakdown.travelCost;
  const platformCommissionAmount = priceBreakdown.totalAmount - panditPayoutAmount;

  return {
    panditPayoutAmount,
    platformCommissionAmount,
  };
}

export interface RefundCalculation {
  hoursUntilCeremony: number;
  refundPercentage: number;
  refundableAmount: number;
  cancellationFee: number;
  tierDescription: string;
}

/**
 * Calculates cancellation refund according to PujaConnect policy:
 * - >= 48 hours: 100% refund (minus ₹150 flat processing charge)
 * - 24 to 48 hours: 75% refund
 * - 12 to 24 hours: 50% refund
 * - < 12 hours: 0% refund (Pandit blocked schedule and procured perishable samagri)
 */
export function calculateCancellationRefund(
  totalPaid: number,
  scheduledDate: string, // "YYYY-MM-DD"
  startTime: string,     // "HH:MM"
  cancellationTime: Date = new Date()
): RefundCalculation {
  const ceremonyDateTime = new Date(`${scheduledDate}T${startTime}:00+05:30`);
  const diffMs = ceremonyDateTime.getTime() - cancellationTime.getTime();
  const hoursUntilCeremony = diffMs / (1000 * 60 * 60);

  if (hoursUntilCeremony >= 48) {
    const flatProcessingFee = Math.min(150, Math.round(totalPaid * 0.05));
    const refundableAmount = Math.max(0, totalPaid - flatProcessingFee);
    return {
      hoursUntilCeremony: Math.round(hoursUntilCeremony),
      refundPercentage: 100,
      refundableAmount,
      cancellationFee: flatProcessingFee,
      tierDescription: 'Early cancellation (>= 48h): Full refund minus ₹150 gateway/processing fee',
    };
  } else if (hoursUntilCeremony >= 24) {
    const refundableAmount = Math.round(totalPaid * 0.75);
    return {
      hoursUntilCeremony: Math.round(hoursUntilCeremony),
      refundPercentage: 75,
      refundableAmount,
      cancellationFee: totalPaid - refundableAmount,
      tierDescription: 'Standard cancellation (24-48h): 75% refund',
    };
  } else if (hoursUntilCeremony >= 12) {
    const refundableAmount = Math.round(totalPaid * 0.50);
    return {
      hoursUntilCeremony: Math.round(hoursUntilCeremony),
      refundPercentage: 50,
      refundableAmount,
      cancellationFee: totalPaid - refundableAmount,
      tierDescription: 'Late cancellation (12-24h): 50% refund',
    };
  } else {
    return {
      hoursUntilCeremony: Math.max(0, Math.round(hoursUntilCeremony)),
      refundPercentage: 0,
      refundableAmount: 0,
      cancellationFee: totalPaid,
      tierDescription: 'Critical cancellation (< 12h): Non-refundable due to reserved pandit schedule & samagri procurement',
    };
  }
}
