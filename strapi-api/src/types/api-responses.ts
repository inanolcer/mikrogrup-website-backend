// Common response interface
export interface BaseResponse {
  success: boolean;
  message: string;
  timestamp: string;
}

// Success response interface
export interface SuccessResponse extends BaseResponse {
  success: true;
  formType?: string;
  data?: Record<string, any>;
}

// Error response interface
export interface ErrorResponse extends BaseResponse {
  success: false;
  error: {
    status: number;
    name: string;
    message: string;
    details: string[];
  };
}

// Form submission interfaces
export interface ContactFormData {
  fullname: string;
  email: string;
  subject: string;
  message: string;
  acceptKvkk: boolean;
  acceptCampaign: boolean;
}

export interface SubscribeFormData {
  email: string;
  name?: string;
  acceptTerms: boolean;
}

export interface RedirectData {
  source: string;
  target: string;
  type: 'permanent' | 'temporary';
  isActive: boolean;
} 