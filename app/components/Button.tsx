"use client";

import { useFormStatus } from "react-dom";

const SubmitBtn = ({ formtitle }: { formtitle: string }) => {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-green-500 rounded-[10px] text-white my-2 font-bold py-2 px-3"
    >
      {pending ? "Loading " + formtitle + "....." : formtitle}
    </button>
  );
};

export default SubmitBtn;
