export type UserRole = "CUSTOMER" | "PROVIDER" | "ADMIN";

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: UserRole;
  avatar: string;
  location?: string;
  createdAt: string;
}

export interface ServiceCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
  iconName: string;
  mastersCount: number;
  featured?: boolean;
}

export interface ProviderServiceItem {
  id: string;
  name: string;
  description: string;
  price: number;
  priceFormatted: string;
  badge?: string;
  iconName?: string;
}

export interface ProviderPortfolioItem {
  id: string;
  title: string;
  location: string;
  imageUrl: string;
}

export interface ProviderReview {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  serviceTitle: string;
  location: string;
}

export interface Provider {
  id: string;
  slug: string;
  name: string;
  title: string;
  shortTitle: string;
  avatar: string;
  coverImage: string;
  rating: number;
  reviewsCount: number;
  completedJobsCount: number;
  experienceYears: number;
  responseMinutes: number;
  verified: boolean;
  phone: string;
  city: string;
  district: string;
  addressFull: string;
  priceRange: {
    min: number;
    max: number;
    formatted: string;
  };
  distanceKm: number;
  availableTime: string;
  isOnline: boolean;
  matchReason?: string;
  categoryIds: string[];
  tags: string[];
  services: ProviderServiceItem[];
  portfolio: ProviderPortfolioItem[];
  reviews: ProviderReview[];
  ratingMetrics: {
    quality: number;
    punctuality: number;
    priceFairness: number;
  };
  warrantyMonths: number;
  aboutText: string;
  vehicleInfo?: {
    model: string;
    plateNumber: string;
  };
}

export type RequestUrgency = "URGENT" | "TODAY" | "TOMORROW";

export interface ServiceRequest {
  id: string;
  code: string; // e.g. UT-8942
  categoryId: string;
  categoryName: string;
  problemDescription: string;
  detectedIssues: string[];
  answers: {
    timeframe: string;
    condition: string;
    additionalSymptoms: string[];
    brand: string;
  };
  location: {
    city: string;
    district: string;
    address: string;
    coordinates?: [number, number];
  };
  urgency: RequestUrgency;
  urgencyText: string;
  status: "OPEN" | "MATCHED" | "ASSIGNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  createdAt: string;
  matchedMasterIds: string[];
  hasAudio: boolean;
  audioDuration?: string;
  photos: string[];
}

export interface Quote {
  id: string;
  requestId: string;
  providerId: string;
  provider: Provider;
  serviceFee: number;
  partsFee: number;
  totalPrice: number;
  arrivalTime: string;
  warranty: string;
  notes?: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: string;
}

export type BookingStatus =
  | "CREATED"
  | "CONFIRMED"
  | "IN_TRANSIT"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export interface BookingTimelineStep {
  title: string;
  subtitle: string;
  timestamp: string;
  completed: boolean;
  current: boolean;
}

export interface Booking {
  id: string;
  orderNumber: string; // #UT-8942
  requestId: string;
  quoteId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  provider: Provider;
  serviceName: string;
  totalPrice: number;
  status: BookingStatus;
  statusText: string;
  scheduledTime: string;
  estimatedArrival: string;
  estimatedMinutesLeft: number;
  vehicle: {
    model: string;
    color: string;
    plateNumber: string;
  };
  destinationAddress: string;
  distanceKm: number;
  timeline: BookingTimelineStep[];
  paymentMethod: "CASH" | "CARD" | "ESCROW";
  isPaid: boolean;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  timestamp: string;
  isMe: boolean;
}

export interface Conversation {
  id: string;
  peerId: string;
  peerName: string;
  peerAvatar: string;
  peerRole: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: ChatMessage[];
}

export interface AdminStats {
  totalUsers: number;
  totalProviders: number;
  totalOrders: number;
  completedOrders: number;
  grossRevenue: number;
  activeDisputes: number;
  pendingVerifications: number;
}
