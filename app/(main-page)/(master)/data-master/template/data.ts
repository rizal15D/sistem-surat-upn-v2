import {
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons";

export default {
  status: [
    {
      value: "processing",
      label: "Processing",
      icon: CircleIcon,
    },
    {
      value: "pending",
      label: "Pending",
      icon: StopwatchIcon,
    },
    {
      value: "success",
      label: "Success",
      icon: CheckCircledIcon,
    },
    {
      value: "failed",
      label: "Failed",
      icon: CrossCircledIcon,
    },
  ],
};
