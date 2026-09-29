"use client";

import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { LocationProvider } from "@/lib/location/LocationContext";
import LocationSelectorModal from "@/components/location/LocationSelectorModal";

export default function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LocationProvider>
          {children}
          <LocationSelectorModal />
        </LocationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
