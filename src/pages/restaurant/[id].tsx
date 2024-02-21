/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-types */
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { api } from '~/utils/api';

type Props = {}

const RestaurantPage = (props: Props) => {
  const [userData, setUserData] = useState<any>()
  console.log('%cMyProject%cline:13%cuserData', 'color:#fff;background:#ee6f57;padding:3px;border-radius:2px', 'color:#fff;background:#1f3c88;padding:3px;border-radius:2px', 'color:#fff;background:rgb(248, 147, 29);padding:3px;border-radius:2px', userData)
  const userId = 1
  const fetchOneUser = api.user.getOne.useQuery({ id: userId });
  const createRestaurantMutation = api.restaurant.create.useMutation()
  const onGetUser = async () => {
    const res: any = await fetchOneUser.refetch()
    if (res) {
      setUserData(res?.data)
    }
  }

  const onCreateRestaurant = async (name: string, userId: number) => {
    try {
      await createRestaurantMutation.mutateAsync({
        name: name,
        userId: userId
      })
    } catch (error) {
      console.log(error)

    }
    return
  }
  useEffect(() => {
    void onGetUser()
  }, [])

  return (
    <div>
      <div className="p-6 bg-blue-900">
        <div className="flex  justify-end gap-6">
          <Link href={'/'}>Home</Link>
          <div>
            {userData ? (
              <div>{userData.email}</div>
            ) : ''}
          </div>
        </div>
      </div>


      <div>
        <strong>Create Restaurant</strong>
        <div>
          <input type="text" placeholder='name' />
          <button onClick={() => onCreateRestaurant('jr shop', userId)}>Create</button>
        </div>
      </div>

    </div>
  )
}

export default RestaurantPage