import { MantineProvider, createTheme, ColorSchemeScript } from "@mantine/core";
import { oxanium } from "@/config/fonts";
import "@mantine/core/styles.css";

const theme = createTheme({
  primaryColor: "blue",
  colors: {
    blue: [
      "#E6F7FF",
      "#BAE7FF",
      "#91D5FF",
      "#69C0FF",
      "#40A9FF",
      "#1890FF",
      "#096DD9",
      "#0050B3",
      "#003A8C",
      "#002766",
    ],
  },
  fontFamily: `${oxanium.style.fontFamily}, system-ui, sans-serif`,
  components: {
    Button: {
      defaultProps: {
        size: "md",
      },
    },
  },
});

export function MantineProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ColorSchemeScript defaultColorScheme="light" />
      <MantineProvider theme={theme} defaultColorScheme="light">
        {children}
      </MantineProvider>
    </>
  );
}

// Replace InitColorSchemeScript with this component
export function InitColorSchemeScript() {
  return <ColorSchemeScript defaultColorScheme="light" />;
}
