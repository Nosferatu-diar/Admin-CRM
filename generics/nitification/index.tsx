import { toast } from "sonner";

type NotificationApiType =
  | "login"
  | "wrong_login"
  | 500
  | "logout"
  | "edit_admin"
  | "delete_admin"
  | "created_admin"
  | "edit_profile"
  | "upload_image";

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
      case "edit_admin":
        return toast.success("Ma'lumotlar muvaffaqiyatli o'zgartirildi!");
      case "delete_admin":
        return toast.success("Ma'lumotlar muvaffaqiyatli o'chirildi!");
      case "created_admin":
        return toast.success("Ma'lumotlar muvaffaqiyatli yaratildi!");
      case "edit_profile":
        return toast.success("Profil muvaffaqiyatli o'zgartirildi!");
      case "upload_image":
        return toast.success("Rasm muvaffaqiyatli yuklandi!");
      default:
        break;
    }
  };
  return notify;
};
