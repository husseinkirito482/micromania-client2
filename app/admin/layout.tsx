import { ADMIN_SESSION_COOKIE, readAdminSession } from "@/lib/admin-auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type AdminLayoutProps = {
  children: React.ReactNode;
};

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const cookieStore = await cookies();
  const session = readAdminSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);

  if (!session) {
    redirect("/login?admin=1");
  }

  return children;
}