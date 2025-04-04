"use client";
import { useState } from "react";
import Sidebar from "./components/Sidebar";
import HeaderBar from "./components/HeaderBar";


import { MantineProvider, Box, Flex, Stack } from "@mantine/core";
import '@mantine/notifications/styles.css';
import "@mantine/core/styles.layer.css";
import "@fontsource/poppins";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Notifications } from "@mantine/notifications";

export default function RootLayout({ children }) {
  const [appName, setAppName] = useState("Desibhabhi Nights");
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="en">
      <body style={{ fontFamily: "Poppins, sans-serif" }}>
      <QueryClientProvider client={queryClient}>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            fontFamily: "Poppins, sans-serif",
          }}
        >
          <div className="flex">
            <Notifications position="top-right" zIndex={9999} />
            {/* Sidebar - Now Takes 30% Width */}

            <Sidebar appName={appName} setAppName={setAppName} />

            {/* Main Content Area - Takes Remaining 70% */}
            <div className="ml-[30%] flex-1 flex flex-col">
              <HeaderBar appName={appName} />
              <main className="p-6">{children}</main>
            </div>
          </div>
        </MantineProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
