import { config } from './config'

export const ROLES = {
  ADMIN: 'admin',
  CUSTOMER: 'customer',
  VENDOR: 'vendor',
} as const
export type recurrenceType = 'daily' | 'weekly' | 'monthly'
//for dashboard inputs
export type timeGranularityType = 'daily' | 'weekly' | 'monthly' | 'yearly'

export type bookingStatus = 'available' | 'booked' | 'cancelled'
export type statusTypes = 'active' | 'blocked'
export type verificationTypes = 'accepted' | 'rejected' | 'pending'

export type TRole = 'customer' | 'admin' | 'vendor'

export const WALLET_TRANSACTION_TYPES = ['credit', 'debit'] as const
export type WalletTransactionType = (typeof WALLET_TRANSACTION_TYPES)[number]

export const WALLET_TRANSACTION_SOURCES = [
  'service-booking',
  'wallet-topup',
  'booking-refund',
  'admin-adjustment',
  'service-payout',
  'opening-balance',
] as const
export type WalletTransactionSource =
  (typeof WALLET_TRANSACTION_SOURCES)[number]

export const PAYMENT_PHASE = {
  ADVANCE: 'advance',
  REMAINING: 'remaining',
} as const

export type TPaymentPhase = (typeof PAYMENT_PHASE)[keyof typeof PAYMENT_PHASE]

export const ADVANCE_PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
} as const

export type TAdvancePaymentStatus =
  (typeof ADVANCE_PAYMENT_STATUS)[keyof typeof ADVANCE_PAYMENT_STATUS]

export const REMAINING_PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
} as const

export type TRemainingPaymentStatus =
  (typeof REMAINING_PAYMENT_STATUS)[keyof typeof REMAINING_PAYMENT_STATUS]

export const REFUND_STATUS = {
  PENDING: 'pending',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed',
} as const

export type TRefundStatus = (typeof REFUND_STATUS)[keyof typeof REFUND_STATUS]

export const SLOT_PAYMENT_STATUS = {
  ADVANCE_PAID: 'advance-paid',
  ADVANCE_REFUNDED: 'advance-refunded',
  REMAINING_PENDING: 'remaining-pending',
  FULLY_PAID: 'fully-paid',
  CANCELLED: 'cancelled',
} as const

export type TSlotPaymentStatus =
  (typeof SLOT_PAYMENT_STATUS)[keyof typeof SLOT_PAYMENT_STATUS]

export const PAYMENT_STATUS = {
  ADVANCE_PAID: 'advance-paid',
  PARTIALLY_REFUNDED: 'partially-refunded',
  REFUNDED: 'refunded',
  PARTIALLY_PAID: 'partially-paid',
  FULLY_PAID: 'fully-paid',
} as const
export const DATE_FORMAT_MAP = {
  daily: '%Y-%m-%d',
  weekly: '%Y-%U',
  monthly: '%Y-%m',
  yearly: '%Y',
}

export type TPaymentStatus =
  (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS]

export const CURRENCY = {
  INR: 'INR',
} as const

export type TCurrency = (typeof CURRENCY)[keyof typeof CURRENCY]

export const SOCKET_EVENTS = {
  NOTIFICATION_NEW: 'notifications:new',
  NOTIFICATION_READ: 'notifications:read',
  NOTIFICATION_READ_ALL: 'notifications:read-all',

  CHAT_JOIN: 'chat:join',
  CHAT_LEAVE: 'chat:leave',

  CHAT_SEND: 'chat:message:send',
  CHAT_NEW: 'chat:message:new',

  CHAT_READ: 'chat:message:read',

  CHAT_LIST_UPDATE: 'chat:list:update',

  CHAT_TYPING_START: 'chat:typing:start',
  CHAT_TYPING_STOP: 'chat:typing:stop',

  USER_ONLINE: 'presence:online',
  USER_OFFLINE: 'presence:offline',
  PRESENCE_PING: 'presence:ping',

  DASHBOARD_JOIN_ADMIN: 'dashboard:join:admin',
  DASHBOARD_JOIN_VENDOR: 'dashboard:join:vendor',
  DASHBOARD_STATS_UPDATE: 'dashboard:stats:update',
}

export interface SocketUser {
  userId: string
  role: 'customer' | 'vendor' | 'admin'
  email: string
}

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  GONE: 410,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  PAYLOAD_TOO_LARGE: 413,
  UNSUPPORTED_MEDIA_TYPE: 415,
  TOO_MANY_REQUESTS: 429,

  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Logged in',
  REGISTRATION_SUCCESS: 'Registration completed',
  OTP_SEND_SUCCESS: 'OTP sent',
  OTP_VERIFIED: 'OTP verified',
  VERIFICATION_SUCCESS: 'Verification done',
  OPERATION_SUCCESS: 'Action completed',
  PASSWORD_RESET_SUCCESS: 'Password reset',
  LOGOUT_SUCCESS: 'Logged out',
  EMAIL_SENT_SUCCESSFULLY: 'Email sent',
  APPROVAL_REQUEST_SENT: 'Approval request send to the admin',
  PROFILE_FETCHED_SUCCESSFULLY: ' Profile fetched successfully',
  PROFILE_UPDATED_SUCCESSFULLY: 'Profile updated successfully',
  UPDATED: 'Successfully Updated.',
  FILE_UPLOAD_SUCCESS: 'File upload successfully.',
  USER_LOGOUT_SUCCESS: 'Logged out successfully.',
  REFRESH_TOKEN_REFRESHED_SUCCESS: 'Refresh Token Refreshed Successfully',
  USERS_FOUND: 'Users Found Successfully',
  BLOCK_STATUS_OF_USER_CHANGED_SUCCESSFULLY:
    'Block Status Changed Successfully.',
  VENDOR_REQUESTS_FOUND: 'Requests found successfully.',
  VERIFICATION_STATUS_CHANGED:
    'Verification status of the user changed successfully.',
  PASSWORD_CHANGED_SUCCESSFULLY: 'Password changed successfully',

  SERVICE_CATEGORIES_FOUND_SUCCESSFULLY:
    'Service categories found successfully.',
  SERVICE_CATGORIES_CREATED_SUCCESSFULLY:
    'Service categories created successfully.',
  SERVICE_CATEGORIES_EDITED_SUCCESSFULLY:
    'Service categories edited successfully.',
  SERVICE_BLOCKED_SUCCESSFULLY: 'Service blocked successfully.',
  CREATED_SUB_SERVICE_CATEGORY:
    'Successfully created the sub service category.',

  SUB_SERVICE_CATEGORIES_FOUND_SUCCESSFULLY:
    'Sub Service Categories Found Succesfully.',
  EDITED_SUB_SERVICE_CATEGORY: 'Edited Sub Service Category Successfully.',
  SUB_SERVICE_CATEGORY_FETCHED_SUCCESSFULLY:
    'Sub Service Category Fetched Successfully',
  SUB_SERVICE_CATEGORY_STATUS_CHANGED_SUCCESSFULLY:
    'Sub service category status changed successfully.',
  SUB_SERVICE_CATEGORY_VERIFICATION_STATUS_CHANGED_SUCCESSFULLY:
    'Sub service category verification status changed successfully.',

  SERVICE_CREATED_SUCCESSFULLY: 'Service created successfully.',
  SERVICE_FOUND_SUCCESSFULLY: 'Service found successfully.',

  SLOTS_FETCHED: 'Slots fetched successfully.',
  BOOKING_HOLD_CREATED: 'Booking hold setup has been created.',
  CANCELLED_BOOKING_SUCCESSFULLY: 'Booking cancelled successfully.',
  FOUND_BOOKING_DETAILS: 'Found booking details successfully.',

  ADDRESS_FOUND_SUCCESSFULLY: 'Address found successfully.',
  ADDRESS_ADDED_SUCCESSFULLY: 'Address added successfully.',
  EDIT_ADDRESS_SUCCESSFULLY: 'Address edited successfully.',
  ADDRESS_SET_AS_DEFAULT_ADDRESS_SUCCESSFULLY:
    'Address set as default address successfully.',
  DELETED_SELECTED_ADDRESS_SUCCESSFULLY:
    'The selected address deleted successfully',
}

export const ERROR_MESSAGES = {
  TOKEN_EXPIRED: 'Session expired, please log in again', //----------
  TOKEN_BLACKLISTED: 'Token is blacklisted', //---------
  EMAIL_NOT_FOUND: 'Email not found',
  EMAIL_EXISTS: 'Email already registered',
  INVALID_ROLE: 'Access denied',
  DATABASE_ERROR: 'Database Error',
  VENDOR_PERMISSION_DENIED:
    'Access denied. Your account is not approved to join.',
  NOT_ALLOWED: "You can't do this action",
  LATITUDE_LONGITUDE_REQUIRED: 'Latitude and longitude are required',
  ACCOUNT_UNDER_VERIFICATION:
    'Your account is under verification. Please wait for admin approval.',
  FAILED_TO_FETCH_TURF_DETAILS: 'Failed to fetch turf details',
  PENDING_ADMIN_APPROVAL: 'Your request is not approved by admin',
  SERVER_ERROR: 'Something went wrong try again later',
  VALIDATION_ERROR: 'Check your inputs and try again',
  UNAUTHORIZED_ACCESS: 'Unathorized access', //-----------------
  BLOCKED: 'Your account has been blocked.', //----------------
  INVALID_CREDENTIALS: 'Wrong email or password',
  WRONG_PASSWORD: 'Password is wrong.',
  INVALID_OTP: 'Invalid or expired otp',
  USER_NOT_FOUND: 'User not found',
  INVALID_TOKEN: 'Invalid session please login again',
  SAME_CURR_NEW_PASSWORD:
    'New password must be different from current password',
  UPDATE_FAILED: 'failed to update profile',
  FILE_NOT_FOUND: 'File not found.',
  PASSWORD_REQUIRED: 'Password required',
  USERS_NOT_FOUND: 'Users not found',
  STATUS_ALREADY_EXISTS: 'Status already exists.',
  SUB_SERVICES_NOT_FOUND: 'Sub services not found',
  SERVICES_NOT_FOUND: 'Service not found.',
  NO_BOOKING_FOUND: 'No booking found.',
  CONFLICTING_INPUTS: 'Credentials are conflicting each other.',

  ADDRESS_NOT_FOUND: 'Address not found.',

  CANCELLATION_REASON_NEEDED: 'Cancellation reason is required',

  NOTIFICATION_NOT_FOUND: 'Notification not found',

  //dashboard
  SUMMARY_NOT_FOUND: 'Summary not found',
}

export const S3_BUCKET_IMAGE_FOLDERS = {
  SUB_SERVICE_CATEGORY_IMAGES: 'SubServiceCategoryImages',
  SERVICE_IMAGES: 'ServiceImages',
}
export const VERIFICATION_MAIL_CONTENT = (otp: string) => `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
  <!-- Logo and Brand -->
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="font-size: 46px; font-weight: bold; margin: 0;">
      🛠️ <span style="color: #007BFF;">Fixora</span>
    </h1>
  </div>

  <h2 style="color: #007BFF; text-align: center; margin-bottom: 25px;">
    Welcome to Fixora – Your Trusted Service Partner! ⚡
  </h2>

  <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
    From home repairs to appliance services, we’ve got you covered! Book expert technicians in just a few clicks and enjoy hassle-free service at your doorstep. 🏡🔧
  </p>

  <div style="background-color: #f9f9f9; border-radius: 8px; padding: 25px; margin: 25px 0; text-align: center;">
    <p style="margin-bottom: 10px; font-size: 16px;">Your verification code is:</p>
    <h1 style="background-color: #eef5ff; color: #007BFF; font-size: 36px; margin: 10px 0; padding: 20px; border-radius: 8px; letter-spacing: 5px;">
      ${otp.trim()}
    </h1>
    <p style="color: #666; font-size: 14px;">
      ⏰ This code will expire in 1 minute.
    </p>
  </div>

  <p style="font-size: 14px; color: #666; margin-top: 15px;">
    🔒 Please do not share this code with anyone for your account’s security.
  </p>

  <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
    <p style="font-size: 14px; color: #888;">
      Need assistance? Our support team is ready to help 💬<br>
      Contact us at 
      <a href="mailto:support@fixora.in" style="color: #007BFF; text-decoration: none;">support@fixora.in</a>
    </p>
  </div>

  <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #888;">
    © ${new Date().getFullYear()} Fixora. All rights reserved.
  </div>
</div>
`
export const PASSWORD_RESET_MAIL_CONTENT = (resetLink: string) => `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; background: #fff;">

  <!-- Logo Section -->
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="font-size: 48px; font-weight: bold; margin: 0;">
      🛠️ <span style="color: #1E90FF;">Fixora</span>
    </h1>
  </div>

  <!-- Heading -->
  <div style="text-align: center; margin-bottom: 30px;">
    <h2 style="color: #1E90FF; font-size: 28px; margin: 0;">
      Password Reset Request 🔐
    </h2>
    <p style="color: #666; font-size: 16px; margin: 10px 0 0 0;">
      Don't worry, we'll help you get back to booking services in no time! ✨
    </p>
  </div>

  <!-- Message Box -->
  <div style="border-radius: 15px; padding: 25px; margin-bottom: 25px; background: linear-gradient(to bottom, #fff, #f6f9ff);">
    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px; text-align: center;">
      We received a request to reset your password for your Fixora account. 
      Your security is our top priority! 🛡️
    </p>

    <!-- Action Button -->
    <div style="border-radius: 12px; padding: 25px; margin: 25px 0; text-align: center;">
      <p style="margin-bottom: 20px; font-size: 16px; color: #444;">
        Click the button below to securely reset your password:
      </p>
      <a href="${resetLink}" 
         style="background-color: #1E90FF; color: white; padding: 16px 40px; 
                text-decoration: none; border-radius: 8px; font-weight: 500; 
                display: inline-block; margin: 10px 0; font-size: 16px; 
                box-shadow: 0 2px 4px rgba(30, 144, 255, 0.2); transition: all 0.3s ease;
                max-width: 100%;"
         onmouseover="this.style.backgroundColor='#1C86EE'"
         onmouseout="this.style.backgroundColor='#1E90FF'"
         rel="noopener noreferrer"
      >
        Reset Password 🔐
      </a>
      <p style="color: #666; font-size: 14px; margin-top: 20px;">
        ⏰ For security, this link expires in 10 minutes
      </p>
    </div>
  </div>

  <!-- Security Tips -->
  <div style="border-radius: 8px; padding: 20px; margin: 25px 0; background-color: #E8F0FE; box-shadow: 0 2px 8px rgba(30, 144, 255, 0.15);">
    <div style="text-align: left; margin-bottom: 15px; display: flex; align-items: center;">
      <span style="font-size: 24px; margin-right: 10px;">⚠️</span>
      <h3 style="color: #0B3D91; margin: 0; font-size: 18px;">Security Reminders</h3>
    </div>
    <ul style="list-style: none; padding: 0; margin: 0;">
      <li style="font-size: 14px; color: #0B3D91; margin: 8px 0; display: flex; align-items: center;">
        <span style="color: #1E90FF; margin-right: 8px;">•</span> Never share this link with anyone
      </li>
      <li style="font-size: 14px; color: #0B3D91; margin: 8px 0; display: flex; align-items: center;">
        <span style="color: #1E90FF; margin-right: 8px;">•</span> Fixora will never ask for your password
      </li>
      <li style="font-size: 14px; color: #0B3D91; margin: 8px 0; display: flex; align-items: center;">
        <span style="color: #1E90FF; margin-right: 8px;">•</span> Ensure you're on our official website before logging in
      </li>
    </ul>
  </div>

  <!-- Footer -->
  <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
    <p style="font-size: 14px; color: #888;">
      Need help? We're here for you! 💡<br>
      Contact us at <a href="mailto:support@fixora.com" style="color: #1E90FF; text-decoration: none;">support@fixora.com</a>
    </p>
  </div>

  <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #888;">
    © ${new Date().getFullYear()} Fixora. All rights reserved.<br>
    <span style="color: #1E90FF;">✦</span> Your Services, Our Priority <span style="color: #1E90FF;">✦</span>
  </div>

</div>
`
