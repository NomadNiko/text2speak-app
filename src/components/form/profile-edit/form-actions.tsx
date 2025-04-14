import { Button } from "@mantine/core";
import { useFormState } from "react-hook-form";
import useLeavePage from "@/services/leave-page/use-leave-page";
import { Group } from "@mantine/core";
import Link from "@/components/link";
interface FormActionsProps {
  submitLabel: string;
  cancelLabel: string;
  testId: string;
  cancelTestId: string;
  cancelHref: string;
}
export function FormActions({
  submitLabel,
  cancelLabel,
  testId,
  cancelTestId,
  cancelHref,
}: FormActionsProps) {
  const { isSubmitting, isDirty } = useFormState();
  useLeavePage(isDirty);
  return (
    <Group gap="md">
      <Button
        type="submit"
        disabled={isSubmitting}
        data-testid={testId}
        size="compact-sm"
      >
        {submitLabel}
      </Button>
      <Button
        variant="light"
        color="red"
        component={Link}
        href={cancelHref}
        data-testid={cancelTestId}
        size="compact-sm"
      >
        {cancelLabel}
      </Button>
    </Group>
  );
}
