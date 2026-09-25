import { User } from "@/types";

export const MOCK_USERS: Record<string, User> = {
  customer: {
    id: "user-sardor",
    name: "Sardor Alimov",
    phone: "+998 90 987-65-43",
    email: "sardor@example.uz",
    role: "CUSTOMER",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDwt7wcD4GidLfO-hNh2hBrsqAu4Gu14tmj7l4dLiyWlcIF14xbRB1gKM7bSwydwrLyB7hjNpT4WWbM96kJh1wDnJ0suh4-6JGE_1e37z5JWGgtWl8cfRXQFHDY9gQjew9txmgbKLNS4K2mRmKTmcQQGqK3KXuGU1FKpiGstG_-OWh87dHul4ixOhFUhdnUQh6c40H06-m9iWLXKJPyHIrKsWri0PRYNUmeFqtHUOh2TNZc0D0hQ3v21g",
    location: "Toshkent, Chilonzor 9-mavze",
    createdAt: "2024-03-15",
  },
  provider: {
    id: "ali-karimov",
    name: "Ali Karimov (Ali Usta)",
    phone: "+998 90 123-45-67",
    email: "ali.usta@example.uz",
    role: "PROVIDER",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDEO8_6X8DRH3xqwrD2kgZ85JlrP3AQ8150pmUGfRFpA85-WD6tL7Gk0lDa4E_I3MJOpBNkh5vdZhKrd41_XgH_xB2TIPgdWySzbjVWEJQxWFtrXChbM8JE7CuH2j3SOX_8KQchAZkJvLrLxYVSfxXzFFpiCg7wUWjZUxV-eCeCAlZOctBffFZmGIJAQZ2gHa_LdeRbRAMfBqettSQFbvjgLwhRCdw64S0XH6oanNdKJbUODaRXrTjv6w",
    location: "Toshkent, Chilonzor",
    createdAt: "2023-01-10",
  },
  admin: {
    id: "admin-jamshid",
    name: "Jamshid Nazorat (Admin)",
    phone: "+998 71 200-00-00",
    email: "admin@ustatop.uz",
    role: "ADMIN",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAxqK9Q4oJ99lTd1fIgwrsM-zNV27iuvEpwMt5OXK3dQV0DqJ-ON2aEiCDxIK72Qiz8Zt81xHO1ak1XJJcQXT14yULKhuTR6BsXmgdThDDyHqGDtgDpjmVhvR6-zZGw9Qcj8TcmXdj6c4kKD3H4eikIseUGh_MjxFhL3hu54av5aLhfNtgzx7ijl76uAOflwlMdlFgNTBA4oFeYBmUr6F5Rn4l-R1Op_pWt6gKMv8DBlm2xGd3xlIv11g",
    location: "Toshkent, Usta Top Bosh Ofisi",
    createdAt: "2022-09-01",
  },
};
