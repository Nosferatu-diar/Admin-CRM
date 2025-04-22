import { toast } from "sonner";

type NotificationApiType = "login";

export const notificationApi = () => {
  const notify = (type: NotificationApiType) => {
    switch (type) {
      case "login":
        return toast.success("Xush kelibsiz!");
      default:
        break;
    }
  };
  return notify;
};
