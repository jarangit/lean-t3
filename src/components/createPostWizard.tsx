/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useCallback, useState } from "react";
import { api } from "~/utils/api";

const CreatePostWizard = () => {
  const { user } = useUser()
  const [content, setContent] = useState('')
  // const ctx = api.useContext();


  const { mutate, isLoading: isPosting } = api.post.create.useMutation({
    onSuccess: () => {
      console.log('success')
      setContent("");
      // void ctx.post.getAll.invalidate();
    },
  })


  if (!user) return null;
  return (
    <div className="my-3 flex justify-between">
      <div className="flex items-center gap-3">
        <div className="relative w-10 h-10 rounded-full overflow-hidden">
          <Image
            src={user.imageUrl}
            layout="fill"
            style={{ objectFit: 'cover' }}
            alt=""
          />
        </div>
        <input type="text" placeholder="type something" value={content} onChange={(e) => setContent(e.target.value)} />
      </div>
      <div>
        <button className="bg-blue-600 py-1 px-3" onClick={() => mutate({ content: content })}>post</button>
      </div>
    </div>
  )
}

export default CreatePostWizard
