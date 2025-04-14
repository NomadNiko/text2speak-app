import { Modal, Center, Loader } from "@mantine/core";
type FullPageLoaderType = {
  isLoading: boolean;
};
export function FullPageLoader({ isLoading }: FullPageLoaderType) {
  return (
    <Modal
      opened={isLoading}
      onClose={() => {}}
      withCloseButton={false}
      centered
    >
      <Center>
        <Loader size="xl" />
      </Center>
    </Modal>
  );
}
