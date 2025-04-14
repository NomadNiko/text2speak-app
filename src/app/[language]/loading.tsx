import { Box, LoadingOverlay } from "@mantine/core";

function Loading() {
  return (
    <Box style={{ width: "100%", height: "100vh", position: "relative" }}>
      <LoadingOverlay visible={true} />
    </Box>
  );
}

export default Loading;
