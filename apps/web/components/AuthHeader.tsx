import React from "react";
import Link from "next/link";
import { Button } from "@repo/ui";

const AuthHeader = () => {
  return (
    <div>
      <Button variant='secondary' asChild>
        <Link href='/'>Main Logo</Link>
      </Button>
    </div>
  );
};

export default AuthHeader;
