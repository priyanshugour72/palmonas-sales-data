"use client";

import { ConfigProvider, theme as antdTheme } from "antd";
import { useTheme } from "@/context/ThemeContext";

export function AntdThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: {
          colorBgContainer: isDark ? "#0f172a" : "#ffffff",
          colorBorder: isDark ? "#334155" : "#e2e8f0",
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
