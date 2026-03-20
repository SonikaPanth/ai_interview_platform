import Agent from "@/app/component/agent";
import { getCurrentUser } from "@/lib/actions/auth.action";
import React from "react";

const page = async () => {
  const user = await getCurrentUser();
  return (
    <div>
      <h1 className="mb-9 text-2xl ">Interview Generation</h1>
      <Agent userName={user?.name} userId={user?.id} type="generate" />
    </div>
  );
};

export default page;
