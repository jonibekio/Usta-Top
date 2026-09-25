import { AdminStats } from "@/types";

export const MOCK_ADMIN_STATS: AdminStats = {
  totalUsers: 14280,
  totalProviders: 1840,
  totalOrders: 6520,
  completedOrders: 6190,
  grossRevenue: 1485000000, // 1.485 млрд сум
  activeDisputes: 3,
  pendingVerifications: 14,
};

export interface VerificationRequestItem {
  id: string;
  providerName: string;
  phone: string;
  category: string;
  passportSerial: string;
  appliedDate: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  documents: {
    passportPhoto: string;
    facePhoto: string;
    certificates: string[];
  };
}

export const MOCK_VERIFICATION_REQUESTS: VerificationRequestItem[] = [
  {
    id: "ver-1",
    providerName: "Ali Karimov",
    phone: "+998 90 123-45-67",
    category: "Konditsioner",
    passportSerial: "AA 1234567",
    appliedDate: "Bugun, 10:20",
    status: "APPROVED",
    documents: {
      passportPhoto: "https://lh3.googleusercontent.com/aida-public/AB6AXuDEO8_6X8DRH3xqwrD2kgZ85JlrP3AQ8150pmUGfRFpA85-WD6tL7Gk0lDa4E_I3MJOpBNkh5vdZhKrd41_XgH_xB2TIPgdWySzbjVWEJQxWFtrXChbM8JE7CuH2j3SOX_8KQchAZkJvLrLxYVSfxXzFFpiCg7wUWjZUxV-eCeCAlZOctBffFZmGIJAQZ2gHa_LdeRbRAMfBqettSQFbvjgLwhRCdw64S0XH6oanNdKJbUODaRXrTjv6w",
      facePhoto: "https://lh3.googleusercontent.com/aida-public/AB6AXuDEO8_6X8DRH3xqwrD2kgZ85JlrP3AQ8150pmUGfRFpA85-WD6tL7Gk0lDa4E_I3MJOpBNkh5vdZhKrd41_XgH_xB2TIPgdWySzbjVWEJQxWFtrXChbM8JE7CuH2j3SOX_8KQchAZkJvLrLxYVSfxXzFFpiCg7wUWjZUxV-eCeCAlZOctBffFZmGIJAQZ2gHa_LdeRbRAMfBqettSQFbvjgLwhRCdw64S0XH6oanNdKJbUODaRXrTjv6w",
      certificates: ["HVAC Carrier Sertifikati 2021", "Artel Malaka oshirish"],
    },
  },
  {
    id: "ver-2",
    providerName: "Sirojiddin Boboyev",
    phone: "+998 93 111-22-33",
    category: "Elektrik",
    passportSerial: "AB 7654321",
    appliedDate: "Bugun, 14:10",
    status: "PENDING",
    documents: {
      passportPhoto: "https://lh3.googleusercontent.com/aida-public/AB6AXuAxqK9Q4oJ99lTd1fIgwrsM-zNV27iuvEpwMt5OXK3dQV0DqJ-ON2aEiCDxIK72Qiz8Zt81xHO1ak1XJJcQXT14yULKhuTR6BsXmgdThDDyHqGDtgDpjmVhvR6-zZGw9Qcj8TcmXdj6c4kKD3H4eikIseUGh_MjxFhL3hu54av5aLhfNtgzx7ijl76uAOflwlMdlFgNTBA4oFeYBmUr6F5Rn4l-R1Op_pWt6gKMv8DBlm2xGd3xlIv11g",
      facePhoto: "https://lh3.googleusercontent.com/aida-public/AB6AXuAxqK9Q4oJ99lTd1fIgwrsM-zNV27iuvEpwMt5OXK3dQV0DqJ-ON2aEiCDxIK72Qiz8Zt81xHO1ak1XJJcQXT14yULKhuTR6BsXmgdThDDyHqGDtgDpjmVhvR6-zZGw9Qcj8TcmXdj6c4kKD3H4eikIseUGh_MjxFhL3hu54av5aLhfNtgzx7ijl76uAOflwlMdlFgNTBA4oFeYBmUr6F5Rn4l-R1Op_pWt6gKMv8DBlm2xGd3xlIv11g",
      certificates: ["4-darajali elektr xavfsizligi guvohnomasi"],
    },
  },
];
