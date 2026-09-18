import nodemailer, { type Transporter } from "nodemailer";
import type { Inquiry } from "@prisma/client";
import { logger } from "@/lib/logger";

export interface LeadEmailPayload {
  inquiryId: string;
  clientName: string;
  email: string;
  company?: string | null;
  phone?: string | null;
  projectType: string;
  timeline?: string | null;
  budget?: string | null;
  technicalDetails: string;
  attachmentsCount: number;
  submittedAt: Date;
}

export interface EmailDispatchResult {
  internalAlertSent: boolean;
  clientConfirmationSent: boolean;
  queuedForRetry?: boolean;
  error?: string;
}

// Resilient dead-letter / retry queue for notifications that failed to deliver
export interface FailedNotificationEntry {
  inquiryId: string;
  recipient: string;
  type: "internal_alert" | "client_confirmation";
  attemptedAt: Date;
  error: string;
}

const failedNotificationsQueue: FailedNotificationEntry[] = [];

/**
 * Returns the current failed notifications retry queue (for audit and telemetry).
 */
export function getFailedNotificationsQueue(): readonly FailedNotificationEntry[] {
  return failedNotificationsQueue;
}

/**
 * Clear or reset the queue (for test teardowns).
 */
export function clearFailedNotificationsQueue(): void {
  failedNotificationsQueue.length = 0;
}

// Cached Nodemailer transport instance
let transportInstance: Transporter | null = null;

function getEmailTransport(): Transporter | null {
  if (transportInstance) return transportInstance;

  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  // If SMTP is not configured with real credentials (e.g. in test or dev without SMTP), return null
  if (!host || host.includes("example.com") || !user || user.includes("example.com")) {
    return null;
  }

  transportInstance = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  return transportInstance;
}

/**
 * Enterprise Lead Notification Pipeline.
 *
 * Architecture:
 * - Invoked exclusively by inquiry.service after database transaction commits.
 * - Safely handles internal alerts and client receipt confirmations.
 * - Database persistence never blocks on email failures.
 * - Zero private storage credentials or provider keys are exposed.
 */
export async function sendLeadInquiryNotifications(
  payload: LeadEmailPayload,
): Promise<EmailDispatchResult> {
  const result: EmailDispatchResult = {
    internalAlertSent: false,
    clientConfirmationSent: false,
  };

  const recipientDesk = process.env.INQUIRY_RECIPIENT_EMAIL || "engineering@frontiersystems.co";
  const fromAddress = process.env.SMTP_FROM || "Frontier Systems <desk@frontiersystems.co>";
  const transport = getEmailTransport();

  // -------------------------------------------------------------------------
  // 1. Internal Engineering Desk Notification
  // -------------------------------------------------------------------------
  const internalSubject = `[LEAD INQUIRY] ${payload.projectType || "General Systems"} — ${payload.clientName}`;
  const internalHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 620px; margin: 0 auto; color: #111416; background: #ffffff; padding: 24px; border: 1px solid #E2E8F0; border-radius: 4px;">
      <div style="border-bottom: 2px solid #63C7D9; padding-bottom: 12px; margin-bottom: 20px;">
        <h2 style="margin: 0; font-size: 18px; color: #0B0D0E; letter-spacing: 0.05em; text-transform: uppercase;">Frontier Systems // Lead Ingestion Desk</h2>
        <p style="margin: 4px 0 0 0; font-size: 12px; color: #64748B; font-family: monospace;">INQUIRY_ID: ${payload.inquiryId}</p>
      </div>

      <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
        <tr>
          <td style="padding: 8px 0; color: #64748B; width: 140px; font-weight: 600;">Client Name:</td>
          <td style="padding: 8px 0; color: #0B0D0E; font-weight: bold;">${payload.clientName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748B; font-weight: 600;">Client Email:</td>
          <td style="padding: 8px 0; color: #0B0D0E;"><a href="mailto:${payload.email}" style="color: #2C8799;">${payload.email}</a></td>
        </tr>
        ${payload.company ? `<tr><td style="padding: 8px 0; color: #64748B; font-weight: 600;">Organization:</td><td style="padding: 8px 0; color: #0B0D0E;">${payload.company}</td></tr>` : ""}
        ${payload.phone ? `<tr><td style="padding: 8px 0; color: #64748B; font-weight: 600;">Telephone:</td><td style="padding: 8px 0; color: #0B0D0E;">${payload.phone}</td></tr>` : ""}
        <tr>
          <td style="padding: 8px 0; color: #64748B; font-weight: 600;">Project Pillar:</td>
          <td style="padding: 8px 0; color: #0B0D0E;">${payload.projectType}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748B; font-weight: 600;">Target Timeline:</td>
          <td style="padding: 8px 0; color: #0B0D0E;">${payload.timeline || "Not specified"}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748B; font-weight: 600;">Budget Allocation:</td>
          <td style="padding: 8px 0; color: #0B0D0E;">${payload.budget || "Open / Custom"}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748B; font-weight: 600;">Verified Attachments:</td>
          <td style="padding: 8px 0; color: #0B0D0E;">${payload.attachmentsCount} specification document(s) securely registered</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748B; font-weight: 600;">Submission Timestamp:</td>
          <td style="padding: 8px 0; color: #0B0D0E; font-family: monospace;">${payload.submittedAt.toISOString()}</td>
        </tr>
      </table>

      <div style="background: #F8FAFC; padding: 16px; border-left: 3px solid #63C7D9; border-radius: 2px;">
        <h4 style="margin: 0 0 8px 0; font-size: 13px; color: #334155; text-transform: uppercase; letter-spacing: 0.05em;">Technical Details & Requirements</h4>
        <p style="margin: 0; font-size: 13px; color: #0F172A; white-space: pre-wrap; line-height: 1.6;">${payload.technicalDetails}</p>
      </div>

      <div style="margin-top: 24px; padding-top: 12px; border-top: 1px solid #E2E8F0; font-size: 11px; color: #94A3B8; font-family: monospace;">
        CONFIDENTIALITY NOTICE: This transmission is intended solely for Frontier Systems engineering staff. Private documents must be reviewed via authenticated administrator portal.
      </div>
    </div>
  `;

  // -------------------------------------------------------------------------
  // 2. Client Confirmation Notification (Strictly Non-Promissory)
  // -------------------------------------------------------------------------
  const clientSubject = `Inquiry Receipt Acknowledged // Frontier Systems [${payload.inquiryId}]`;
  const clientHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; color: #F5F5F3; background: #0B0D0E; padding: 32px; border: 1px solid #292D30; border-radius: 4px;">
      <div style="border-bottom: 1px solid #292D30; padding-bottom: 16px; margin-bottom: 24px;">
        <span style="font-size: 11px; font-family: monospace; color: #63C7D9; letter-spacing: 0.15em; text-transform: uppercase;">FRONTIER SYSTEMS // VERIFIED INGESTION</span>
        <h2 style="margin: 8px 0 0 0; font-size: 20px; font-weight: 500; color: #F5F5F3; letter-spacing: -0.01em;">Consultation Inquiry Received</h2>
      </div>

      <p style="font-size: 14px; line-height: 1.6; color: #A6AAAC; margin-bottom: 16px;">
        Dear ${payload.clientName},
      </p>

      <p style="font-size: 14px; line-height: 1.6; color: #A6AAAC; margin-bottom: 16px;">
        Thank you for submitting your architectural specifications to Frontier Systems. We have safely logged your project brief under reference identifier:
      </p>

      <div style="background: #111416; border: 1px solid #292D30; border-radius: 4px; padding: 14px 16px; font-family: monospace; font-size: 13px; color: #63C7D9; margin-bottom: 24px;">
        REFERENCE: ${payload.inquiryId}
      </div>

      <p style="font-size: 14px; line-height: 1.6; color: #A6AAAC; margin-bottom: 16px;">
        Our technical partners and engineering leads review incoming architecture briefs to evaluate structural compatibility, resource requirements, and technical scope.
      </p>

      <p style="font-size: 14px; line-height: 1.6; color: #A6AAAC; margin-bottom: 24px;">
        Should you need to augment your submission with additional data or sensitive specifications, you may quote your reference identifier in direct correspondence with our engineering desk at <a href="mailto:hello@frontiersystems.co" style="color: #63C7D9; text-decoration: none;">hello@frontiersystems.co</a>.
      </p>

      <div style="border-top: 1px solid #292D30; padding-top: 16px; font-size: 12px; color: #6E7376;">
        <p style="margin: 0;">Frontier Systems &bull; Enterprise AI, Autonomous Systems & Critical Infrastructure</p>
        <p style="margin: 4px 0 0 0; font-size: 11px;">London &bull; Global Operations</p>
      </div>
    </div>
  `;

  // Attempt internal alert dispatch
  try {
    if (transport) {
      await transport.sendMail({
        from: fromAddress,
        to: recipientDesk,
        subject: internalSubject,
        html: internalHtml,
      });
      result.internalAlertSent = true;
    } else {
      // In development/test environments without live SMTP, record clean simulation
      logger.info("Internal lead notification dispatched (simulated)", {
        inquiryId: payload.inquiryId,
        recipient: recipientDesk,
        subject: internalSubject,
      });
      result.internalAlertSent = true;
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    logger.warn("Internal lead email delivery failed; queued for retry", {
      inquiryId: payload.inquiryId,
      error: errorMsg,
    });
    failedNotificationsQueue.push({
      inquiryId: payload.inquiryId,
      recipient: recipientDesk,
      type: "internal_alert",
      attemptedAt: new Date(),
      error: errorMsg,
    });
    result.queuedForRetry = true;
    result.error = errorMsg;
  }

  // Attempt client confirmation dispatch
  try {
    if (transport) {
      await transport.sendMail({
        from: fromAddress,
        to: payload.email,
        subject: clientSubject,
        html: clientHtml,
      });
      result.clientConfirmationSent = true;
    } else {
      logger.info("Client receipt confirmation email dispatched (simulated)", {
        inquiryId: payload.inquiryId,
        recipient: payload.email,
        subject: clientSubject,
      });
      result.clientConfirmationSent = true;
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    logger.warn("Client confirmation email delivery failed; queued for retry", {
      inquiryId: payload.inquiryId,
      recipient: payload.email,
      error: errorMsg,
    });
    failedNotificationsQueue.push({
      inquiryId: payload.inquiryId,
      recipient: payload.email,
      type: "client_confirmation",
      attemptedAt: new Date(),
      error: errorMsg,
    });
    result.queuedForRetry = true;
  }

  return result;
}

/**
 * Adapter bridging Inquiry database record to email service payload.
 */
export function buildLeadEmailPayloadFromInquiry(
  inquiry: Inquiry,
  attachmentsCount: number,
  options?: {
    timeline?: string | null | undefined;
    budget?: string | null | undefined;
    technicalDetails?: string | undefined;
  },
): LeadEmailPayload {
  return {
    inquiryId: inquiry.id,
    clientName: inquiry.name,
    email: inquiry.email,
    company: inquiry.company,
    phone: inquiry.phone,
    projectType: inquiry.service || "Enterprise Systems",
    timeline: options?.timeline ?? null,
    budget: inquiry.budget ?? options?.budget ?? null,
    technicalDetails: options?.technicalDetails ?? inquiry.message,
    attachmentsCount,
    submittedAt: inquiry.createdAt,
  };
}

export interface MagicLinkEmailPayload {
  email: string;
  clientName: string;
  verifyUrl: string;
  expiresInMinutes: number;
}

export const lastSentMagicLinks: Array<{ email: string; verifyUrl: string; sentAt: Date }> = [];

/**
 * Dispatches a passwordless magic link email for Customer Portal authentication.
 *
 * Requirements:
 * - Clearly states it was requested for portal access.
 * - Includes an expiry notice (e.g. 15 minutes).
 * - Does NOT include any project/invoice details in the email body.
 */
export async function sendMagicLinkEmail(
  payload: MagicLinkEmailPayload,
): Promise<{ success: boolean; error?: string }> {
  const fromAddress = process.env.SMTP_FROM || "Frontier Systems <desk@frontiersystems.co>";
  const transport = getEmailTransport();

  const subject = "Frontier Systems Client Portal Access Link";
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 580px; margin: 0 auto; color: #F5F5F3; background: #0B0D0E; padding: 32px; border: 1px solid #292D30; border-radius: 4px;">
      <div style="border-bottom: 1px solid #292D30; padding-bottom: 16px; margin-bottom: 24px;">
        <span style="font-size: 11px; font-family: monospace; color: #63C7D9; letter-spacing: 0.15em; text-transform: uppercase;">FRONTIER SYSTEMS // CLIENT PORTAL</span>
        <h2 style="margin: 8px 0 0 0; font-size: 20px; font-weight: 500; color: #F5F5F3; letter-spacing: -0.01em;">Secure Sign-In Link</h2>
      </div>

      <p style="font-size: 14px; line-height: 1.6; color: #A6AAAC; margin-bottom: 16px;">
        Hello ${payload.clientName || "Client"},
      </p>

      <p style="font-size: 14px; line-height: 1.6; color: #A6AAAC; margin-bottom: 24px;">
        A single-use authentication link was requested to access your Frontier Systems Client Portal. Click the button below to sign in directly:
      </p>

      <div style="margin-bottom: 28px;">
        <a href="${payload.verifyUrl}" style="display: inline-block; background-color: #F5F5F3; color: #0B0D0E; padding: 12px 24px; font-size: 13px; font-weight: 600; text-decoration: none; border-radius: 2px; letter-spacing: 0.02em;">
          Sign In to Client Portal &rarr;
        </a>
      </div>

      <p style="font-size: 12px; line-height: 1.5; color: #6E7376; margin-bottom: 16px;">
        Or paste this URL into your browser:<br/>
        <a href="${payload.verifyUrl}" style="color: #63C7D9; word-break: break-all; font-family: monospace; font-size: 11px;">${payload.verifyUrl}</a>
      </p>

      <div style="background: #111416; border: 1px solid #292D30; border-radius: 2px; padding: 12px 14px; margin-bottom: 24px;">
        <p style="margin: 0; font-size: 12px; color: #A6AAAC;">
          <strong style="color: #F5F5F3;">Security Notice:</strong> This link is strictly single-use and will expire in <strong>${payload.expiresInMinutes} minutes</strong>. If you did not request this login link, you can safely disregard this email.
        </p>
      </div>

      <div style="border-top: 1px solid #292D30; padding-top: 16px; font-size: 11px; color: #6E7376;">
        <p style="margin: 0;">Frontier Systems Ltd &bull; High-Assurance Engineering &amp; AI Systems</p>
        <p style="margin: 4px 0 0 0;">London, United Kingdom</p>
      </div>
    </div>
  `;

  // Record in memory for test verification
  lastSentMagicLinks.push({
    email: payload.email,
    verifyUrl: payload.verifyUrl,
    sentAt: new Date(),
  });

  try {
    if (transport) {
      await transport.sendMail({
        from: fromAddress,
        to: payload.email,
        subject,
        html,
      });
    } else {
      logger.info("Magic link email dispatched (simulated)", {
        recipient: payload.email,
        verifyUrl: payload.verifyUrl,
        expiresInMinutes: payload.expiresInMinutes,
      });
    }
    return { success: true };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    logger.error("Failed to deliver magic link email", { error: errorMsg, recipient: payload.email });
    return { success: false, error: errorMsg };
  }
}
