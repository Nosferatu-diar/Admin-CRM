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
  | "upload_image"
  | "change_password"
  | "edit_manager"
  | "create_teacher"
  | "create_teacher_error"
  | "delete_teacher"
  | "return_teacher"
  | "create_group"
  | "create_student";

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
      case "change_password":
        return toast.success("Parol muvaffaqiyatli o'zgartirildi!");
      case "upload_image":
        return toast.success("Rasm muvaffaqiyatli yuklandi!");
      case "edit_manager":
        return toast.success("Ma'lumotlar muvaffaqiyatli o'zgartirildi!");
      case "create_teacher":
        return toast.success("O'qituvchi muvaffaqiyatli yaratildi!");
      case "create_teacher_error":
        return toast.error("O'qituvchi yaratishda xatolik!");
      case "delete_teacher":
        return toast.success("O'qituvchi muvaffaqiyatli o'chirildi!");
      case "return_teacher":
        return toast.success("O'qituvchi muvaffaqiyatli tiklandi!");
      case "create_group":
        return toast.success("Guruh muvaffaqiyatli yaratildi!");
      case "create_student":
        return toast.success("Talaba muvaffaqiyatli yaratildi!");
      default:
        break;
    }
  };
  return notify;
};
