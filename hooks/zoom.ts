/**
 * Zoom API Integration Library
 * 
 * This library provides functions to interact with Zoom APIs including:
 * - Authentication (OAuth)
 * - Creating meetings
 * - Managing meetings
 * - Getting user info
 * - Webhooks handling
 */

import crypto from 'crypto'

// Types for Zoom API responses
export interface ZoomUser {
  id: string
  first_name: string
  last_name: string
  email: string
  type: number
  role_name: string
  pmi: number
  use_pmi: boolean
  timezone: string
  verified: number
  dept: string
  created_at: string
  last_login_time: string
  last_client_version: string
  language: string
  phone_country: string
  phone_number: string
  status: string
}

export interface ZoomMeeting {
  id: number
  uuid: string
  host_id: string
  host_email: string
  topic: string
  type: number
  status: string
  start_time: string
  duration: number
  timezone: string
  agenda: string
  created_at: string
  start_url: string
  join_url: string
  password: string
  h323_password: string
  pstn_password: string
  encrypted_password: string
  settings: ZoomMeetingSettings
  recurrence?: ZoomRecurrence
}

export interface ZoomMeetingSettings {
  host_video: boolean
  participant_video: boolean
  cn_meeting: boolean
  in_meeting: boolean
  join_before_host: boolean
  jbh_time: number
  mute_upon_entry: boolean
  watermark: boolean
  use_pmi: boolean
  approval_type: number
  audio: string
  auto_recording: string
  enforce_login: boolean
  enforce_login_domains: string
  alternative_hosts: string
  alternative_host_update_polls: boolean
  close_registration: boolean
  show_share_button: boolean
  allow_multiple_devices: boolean
  registrants_confirmation_email: boolean
  waiting_room: boolean
  request_permission_to_unmute_participants: boolean
  global_dial_in_countries: string[]
  global_dial_in_numbers: ZoomDialInNumber[]
  contact_name: string
  contact_email: string
  registrants_email_notification: boolean
  meeting_authentication: boolean
  authentication_option: string
  authentication_domains: string
  authentication_name: string
  product_type: number
  internal_meeting: boolean
  continuous_meeting_chat: boolean
  participant_focused_meeting: boolean
  push_change_to_calendar: boolean
  resources: any[]
  alternative_hosts_email_notification: boolean
  show_join_info: boolean
  device_testing: boolean
  focus_mode: boolean
  enable_dedicated_group_chat: boolean
  private_meeting: boolean
  email_notification: boolean
  host_save_video_order: boolean
  sign_language_interpretation?: {
    enable: boolean
    interpreters: any[]
  }
  email_in_attendee_report: boolean
}

export interface ZoomRecurrence {
  type: number
  repeat_interval: number
  weekly_days: string
  monthly_day: number
  monthly_week: number
  monthly_week_day: number
  end_times: number
  end_date_time: string
}

export interface ZoomDialInNumber {
  country: string
  country_name: string
  city: string
  number: string
  type: string
}

export interface CreateMeetingRequest {
  topic: string
  type?: number // 1=instant, 2=scheduled, 3=recurring no fixed time, 8=recurring with fixed time
  start_time?: string // ISO 8601 format
  duration?: number // Duration in minutes
  timezone?: string
  password?: string
  agenda?: string
  settings?: Partial<ZoomMeetingSettings>
  recurrence?: Partial<ZoomRecurrence>
}

class ZoomAPI {
  private accountId: string
  private clientId: string
  private clientSecret: string
  private secretToken: string
  private baseUrl = 'https://api.zoom.us/v2'
  private requestTimeout: number
  
  constructor() {
    this.accountId = process.env.ZOOM_ACCOUNT_ID!
    this.clientId = process.env.ZOOM_CLIENT_ID!
    this.clientSecret = process.env.ZOOM_CLIENT_SECRET!
    this.secretToken = process.env.ZOOM_SECRET_TOKEN!
    
    // Configurable timeout (default 30s, can be overridden via env)
    this.requestTimeout = parseInt(process.env.ZOOM_REQUEST_TIMEOUT || '30000')
    
    if (!this.accountId || !this.clientId || !this.clientSecret) {
      console.error('Zoom API credentials missing. Zoom meetings are disabled; live classes use Daily.co now.', {
        hasAccountId: !!this.accountId,
        hasClientId: !!this.clientId,
        hasClientSecret: !!this.clientSecret,
      });
      // Do NOT throw: Zoom integration is disabled. Methods will fail when called.
    }
    
    console.log('Zoom API (disabled) instance info:', {
      accountId: this.accountId ? this.accountId.substring(0, 8) + '...' : 'not configured',
      clientId: this.clientId ? this.clientId.substring(0, 8) + '...' : 'not configured',
      hasClientSecret: !!this.clientSecret,
      requestTimeout: this.requestTimeout + 'ms'
    });
  }

  /**
   * Generate JWT token for Server-to-Server OAuth
   */
  private async getAccessToken(): Promise<string> {
    const tokenUrl = 'https://zoom.us/oauth/token'
    const credentials = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')
    
    // Retry logic for network issues
    const maxRetries = 3;
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Zoom token request attempt ${attempt}/${maxRetries}`);
        
        const response = await fetch(tokenUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            grant_type: 'account_credentials',
            account_id: this.accountId,
          }),
          // Increased timeout for high-latency networks
          signal: AbortSignal.timeout(this.requestTimeout), // Configurable timeout
        })
        
        if (!response.ok) {
          const error = await response.text()
          throw new Error(`Failed to get access token: ${response.status} ${error}`)
        }
        
        const data = await response.json()
        console.log('Successfully obtained Zoom access token');
        return data.access_token
      } catch (error: any) {
        console.error(`Zoom token request attempt ${attempt} failed:`, error.message);
        lastError = error;
        
        // Don't retry on authentication errors
        if (error.message.includes('401') || error.message.includes('403')) {
          throw error;
        }
        
        // Wait before retrying (exponential backoff)
        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
          console.log(`Waiting ${delay}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw new Error(`Failed to get Zoom access token after ${maxRetries} attempts. Last error: ${lastError?.message || 'Unknown error'}`);
  }

  /**
   * Make authenticated API request to Zoom
   */
  private async apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = await this.getAccessToken()
    
    // Retry logic for network issues
    const maxRetries = 3;
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Zoom API request attempt ${attempt}/${maxRetries} for ${endpoint}`);
        
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
          ...options,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            ...options.headers,
          },
          // Add timeout
          signal: AbortSignal.timeout(this.requestTimeout), // Configurable timeout for API calls
        })
        
        if (!response.ok) {
          const error = await response.text()
          const errorMsg = `Zoom API error: ${response.status} ${error}`;
          
          // Don't retry on client errors (4xx), only server errors (5xx) and network issues
          if (response.status >= 400 && response.status < 500) {
            throw new Error(errorMsg);
          }
          
          throw new Error(errorMsg);
        }
        
        console.log(`Zoom API request successful for ${endpoint}`);
        return response.json()
      } catch (error: any) {
        console.error(`Zoom API request attempt ${attempt} failed for ${endpoint}:`, error.message);
        lastError = error;
        
        // Don't retry on authentication errors or client errors
        if (error.message.includes('401') || error.message.includes('403') || error.message.includes('400')) {
          throw error;
        }
        
        // Wait before retrying (exponential backoff)
        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
          console.log(`Waiting ${delay}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw new Error(`Failed Zoom API request to ${endpoint} after ${maxRetries} attempts. Last error: ${lastError?.message || 'Unknown error'}`);
  }

  /**
   * Get current user information
   */
  async getUser(userId: string = 'me'): Promise<ZoomUser> {
    return this.apiRequest<ZoomUser>(`/users/${userId}`)
  }

  /**
   * Create a new meeting
   */
  async createMeeting(userId: string = 'me', meetingData: CreateMeetingRequest): Promise<ZoomMeeting> {
    return this.apiRequest<ZoomMeeting>(`/users/${userId}/meetings`, {
      method: 'POST',
      body: JSON.stringify(meetingData),
    })
  }

  /**
   * Get meeting details
   */
  async getMeeting(meetingId: string): Promise<ZoomMeeting> {
    return this.apiRequest<ZoomMeeting>(`/meetings/${meetingId}`)
  }

  /**
   * Update a meeting
   */
  async updateMeeting(meetingId: string, meetingData: Partial<CreateMeetingRequest>): Promise<void> {
    return this.apiRequest<void>(`/meetings/${meetingId}`, {
      method: 'PATCH',
      body: JSON.stringify(meetingData),
    })
  }

  /**
   * Delete a meeting
   */
  async deleteMeeting(meetingId: string): Promise<void> {
    return this.apiRequest<void>(`/meetings/${meetingId}`, {
      method: 'DELETE',
    })
  }

  /**
   * List user's meetings
   */
  async listMeetings(userId: string = 'me', type: 'scheduled' | 'live' | 'upcoming' = 'scheduled'): Promise<{
    page_count: number
    page_number: number
    page_size: number
    total_records: number
    meetings: ZoomMeeting[]
  }> {
    return this.apiRequest(`/users/${userId}/meetings?type=${type}`)
  }

  /**
   * Verify webhook signature
   */
  verifyWebhook(payload: string, timestamp: string, signature: string): boolean {
    const message = `v0:${timestamp}:${payload}`
    const hashForVerify = crypto.createHmac('sha256', this.secretToken).update(message).digest('hex')
    const computedSignature = `v0=${hashForVerify}`
    
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'utf8'),
      Buffer.from(computedSignature, 'utf8')
    )
  }

  /**
   * Create an instant meeting
   */
  async createInstantMeeting(topic: string, settings?: Partial<ZoomMeetingSettings>): Promise<ZoomMeeting> {
    return this.createMeeting('me', {
      topic,
      type: 1, // Instant meeting
      settings: {
        host_video: true,
        participant_video: true,
        join_before_host: false,
        mute_upon_entry: true,
        waiting_room: true,
        ...settings,
      },
    })
  }

  /**
   * Schedule a meeting
   */
  async scheduleMeeting(
    topic: string,
    startTime: Date,
    duration: number = 60,
    settings?: Partial<ZoomMeetingSettings>
  ): Promise<ZoomMeeting> {
    return this.createMeeting('me', {
      topic,
      type: 2, // Scheduled meeting
      start_time: startTime.toISOString(),
      duration,
      timezone: 'UTC',
      settings: {
        host_video: true,
        participant_video: true,
        join_before_host: false,
        mute_upon_entry: true,
        waiting_room: true,
        auto_recording: 'none',
        ...settings,
      },
    })
  }
}

// Zoom integration is DISABLED. Live classes now use Daily.co (free tier).
// Keep a guarded singleton so importing this module can never crash builds.
let zoomAPISingleton: ZoomAPI | null = null

export function getZoomAPI(): ZoomAPI {
  if (!zoomAPISingleton) {
    zoomAPISingleton = new ZoomAPI()
  }
  return zoomAPISingleton
}

export const zoomAPI = getZoomAPI()
export default ZoomAPI
