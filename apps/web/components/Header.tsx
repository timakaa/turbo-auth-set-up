"use client";

import { Button } from "@repo/ui";
import Link from "next/link";

const Header = () => {
  return (
    <header>
      <Button variant='outline' asChild>
        <Link href='/signin'>Sign in</Link>
      </Button>
      <Button variant='outline' asChild>
        <Link href='/signup'>Sign up</Link>
      </Button>
    </header>
  );
};

export default Header;
