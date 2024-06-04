import Image from "next/image";
import { verifySession } from "~/utils/auth/serverSession";

export async function ProfileImage() {
  const user = await verifySession();

  return (
    <Image
      width={200}
      height={200}
      alt="profile picture"
      className="rounded-full"
      src={user?.image || ""}
    />
  );
}
