import { createTheme, type MantineColorsTuple } from "@mantine/core";

const canarinhosBlue: MantineColorsTuple = [
  "#edf4fb",
  "#d8e7f6",
  "#accdef",
  "#7cb2e8",
  "#549ae1",
  "#398add",
  "#287ddb",
  "#1e3a5f", // brand
  "#162c4a",
  "#0e1e34",
];

const canarinhosGold: MantineColorsTuple = [
  "#fef9e8",
  "#fdf1cb",
  "#fbe298",
  "#f8d160",
  "#f6c332",
  "#c9a227", // brand
  "#a98418",
  "#856412",
  "#62470e",
  "#442f08",
];

export const theme = createTheme({
  colors: {
    canarinhosBlue,
    canarinhosGold,
  },
  primaryColor: "canarinhosBlue",
  defaultRadius: "md",
  fontFamily:
    "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
});
