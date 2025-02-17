"use client";

import { useSession } from "@/hooks/useSession";

export default function Home() {
  const { isLoading, session, error } = useSession();
  console.log(session);
  return <div className='text-red-500'>hi</div>;
}
