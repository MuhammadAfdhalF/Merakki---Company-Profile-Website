import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function getAdminToken() {
  const session: any = await getServerSession(authOptions as any);
  return session?.accessToken as string | undefined;
}
