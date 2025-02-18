"use client";

import { useSession } from "@/hooks/useSession";

export default function Home() {
  const { session } = useSession();
  console.log(session);
  return <div className='text-red-500'>hi</div>;
}
