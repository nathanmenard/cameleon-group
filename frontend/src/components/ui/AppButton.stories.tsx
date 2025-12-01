import type { Meta, StoryObj } from "@storybook/react";
import AppButton from "./AppButton";

const meta = {
  title: "Ui/AppButton",
  component: AppButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "outline", "accent", "ghost"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    fullWidth: {
      control: "boolean",
    },
    disabled: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof AppButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: "Bouton principal",
    variant: "primary",
  },
};

export const Secondary: Story = {
  args: {
    children: "Bouton secondaire",
    variant: "secondary",
  },
};

export const Outline: Story = {
  args: {
    children: "Bouton outline",
    variant: "outline",
  },
};

export const Accent: Story = {
  args: {
    children: "Bouton accent",
    variant: "accent",
  },
};

export const Ghost: Story = {
  args: {
    children: "Bouton ghost",
    variant: "ghost",
  },
};

export const Small: Story = {
  args: {
    children: "Petit bouton",
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    children: "Grand bouton",
    size: "lg",
  },
};

export const Disabled: Story = {
  args: {
    children: "Bouton désactivé",
    disabled: true,
  },
};

export const FullWidth: Story = {
  args: {
    children: "Pleine largeur",
    fullWidth: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: "300px" }}>
        <Story />
      </div>
    ),
  ],
};

export const AllVariants: Story = {
  args: {
    children: "Boutons",
  },
  render: () => (
    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
      <AppButton variant="primary">Primary</AppButton>
      <AppButton variant="secondary">Secondary</AppButton>
      <AppButton variant="outline">Outline</AppButton>
      <AppButton variant="accent">Accent</AppButton>
      <AppButton variant="ghost">Ghost</AppButton>
    </div>
  ),
};
