// src/components/users/MobileSortControls.tsx
import { Menu, Button, Group, Text } from "@mantine/core";
import {
  IconChevronDown,
  IconSortAscending,
  IconSortDescending,
} from "@tabler/icons-react";
import { useState } from "react";
import { SortEnum } from "@/services/api/types/sort-type";
import { User } from "@/services/api/types/user";
import { useTranslation } from "@/services/i18n/client";

interface MobileSortControlsProps {
  orderBy: keyof User;
  order: SortEnum;
  onSort: (property: keyof User) => void;
}

/**
 * Mobile-friendly sort controls for the users list
 */
export function MobileSortControls({
  orderBy,
  order,
  onSort,
}: MobileSortControlsProps) {
  const [opened, setOpened] = useState(false);
  const { t: tUsers } = useTranslation("admin-panel-users");

  // Sort options with labels
  const sortOptions: Array<{ key: keyof User; label: string }> = [
    { key: "email", label: tUsers("admin-panel-users:table.column3") },
    { key: "firstName", label: tUsers("admin-panel-users:table.column2") },
  ];

  const handleSortChange = (property: keyof User) => {
    onSort(property);
    setOpened(false);
  };

  const currentSortLabel = sortOptions.find(
    (option) => option.key === orderBy
  )?.label;

  return (
    <Menu
      opened={opened}
      onChange={setOpened}
      position="bottom-start"
      withinPortal
    >
      <Menu.Target>
        <Button variant="light" fullWidth>
          <Group justify="apart" style={{ width: "100%" }}>
            <Text>
              {tUsers("admin-panel-users:sortBy")} {currentSortLabel}
            </Text>
            <Group gap={8}>
              {order === SortEnum.ASC ? (
                <IconSortAscending size={16} />
              ) : (
                <IconSortDescending size={16} />
              )}
              <IconChevronDown size={16} />
            </Group>
          </Group>
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        {sortOptions.map((option) => (
          <Menu.Item
            key={String(option.key)}
            onClick={() => handleSortChange(option.key)}
            leftSection={
              orderBy === option.key ? (
                order === SortEnum.ASC ? (
                  <IconSortAscending size={16} />
                ) : (
                  <IconSortDescending size={16} />
                )
              ) : null
            }
          >
            {option.label}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}
