"use client";
import { useState } from "react";
import Sidebar from "./components/Sidebar";
import HeaderBar from "./components/HeaderBar";
import { MantineProvider, Box, Flex, Stack } from "@mantine/core";
import "@mantine/core/styles.layer.css";
import "@fontsource/poppins";
import "./globals.css";

export default function RootLayout({ children }) {
  const [appName, setAppName] = useState("Desibhabhi Nights");

  return (
    <html lang="en">
      <body style={{ fontFamily: "Poppins, sans-serif" }}>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            fontFamily: "Poppins, sans-serif",
          }}
        >
          <div className="flex">
            {/* Sidebar - Now Takes 30% Width */}
            <Sidebar appName={appName} setAppName={setAppName} />

            {/* Main Content Area - Takes Remaining 70% */}
            <div className="ml-[30%] flex-1 flex flex-col">
              <HeaderBar appName={appName} />
              <main className="p-6">{children}</main>
            </div>
          </div>
        </MantineProvider>
      </body>
    </html>
  );
}
