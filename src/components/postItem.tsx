/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from 'next/image';
import React from 'react'

type Props = {
  data: any;
}

const PostItem = ({ data }: Props) => {
  return (
    <div>
      {data ? (
        <div key={data.post.id} className="p-3 rounded-lg bg-gray-900">
          {data.author && (
            <div className="flex items-center gap-2">
              <div className="relative w-10 h-10 rounded-full overflow-hidden">
                <Image
                  src={data.author?.profileImage ?? ""}
                  layout="fill"
                  style={{ objectFit: 'cover' }}
                  alt=""
                />
              </div>
              <div>
                <strong>{data.author.firstName} {data.author.lastName}</strong>
                <div className="text-xs text-gray-400">{data.post.createdAt.toLocaleDateString()}</div>
              </div>
            </div>
          )}
          <div className="mt-3">{data.post.content}</div>
        </div>
      ) : ''}
    </div>
  )
}

export default PostItem