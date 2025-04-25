import { toast } from "sonner";

type NotificationApiType = "login" | "wrong_login" | 500 | "logout";

export const notificationApi = () => {
  const notify = (type: NotificationApiType) => {
    switch (type) {
      case "login":
        return toast.success("Xush kelibsiz!");
      case "wrong_login":
        return toast.error("Login yoki parol xato!");
      case 500:
        return toast.error("Server bilan bog'lanishda xatolik!");
      case "logout":
        return toast.success("Siz muvaffaqiyatli chiqdingiz!");
      default:
        break;
    }
  };
  return notify;
};
