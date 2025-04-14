// src/components/users/TableSortCell.tsx
import { PropsWithChildren } from "react";
import {
  UnstyledButton,
  Group,
  Center,
  Text,
  useMantineTheme,
} from "@mantine/core";
import {
  IconChevronUp,
  IconChevronDown,
  IconSelector,
} from "@tabler/icons-react";
import { SortEnum } from "@/services/api/types/sort-type";

type TableSortCellProps<T> = PropsWithChildren<{
  width?: number;
  orderBy: keyof T;
  order: SortEnum;
  column: keyof T;
  handleRequestSort: (
    event: React.MouseEvent<HTMLElement>,
    property: keyof T
  ) => void;
}>;

function TableSortCell<T>({
  width,
  orderBy,
  order,
  column,
  handleRequestSort,
  children,
}: TableSortCellProps<T>) {
  const isActive = orderBy === column;
  const theme = useMantineTheme();

  return (
    <th style={{ width, textAlign: "left" }}>
      <UnstyledButton
        onClick={(event) => handleRequestSort(event, column)}
        style={{ width: "100%", padding: `${theme.spacing.xs} 0` }}
      >
        <Group justify="space-between">
          <Text fw={500} size="sm">
            {children}
          </Text>
          <Center>
            {isActive ? (
              order === SortEnum.ASC ? (
                <IconChevronUp size={16} />
              ) : (
                <IconChevronDown size={16} />
              )
            ) : (
              <IconSelector size={16} opacity={0.3} />
            )}
          </Center>
        </Group>
      </UnstyledButton>
    </th>
  );
}

export default TableSortCell;
