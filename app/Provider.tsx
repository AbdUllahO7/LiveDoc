'use client'
import React from 'react'

import { LiveblocksProvider, ClientSideSuspense } from '@liveblocks/react/suspense';
import Loader from '@/components/Loader';
import { getClerkUsers, getMentionSuggestions } from '@/lib/actions/users.actions';
import { useUser } from '@clerk/nextjs';



const Provider = ({children} : {children : React.ReactNode}) => {

    const {user : clerkUser} = useUser();

    return (
        <LiveblocksProvider authEndpoint={"/api/liveblocks-auth"} 
        resolveUsers={async({userIds})=> {
            const users = await getClerkUsers({userIds})
            return users;
        }} 
            resolveMentionSuggestions={async ({text , roomId}) => {
                const userEmail = clerkUser?.emailAddresses[0].emailAddress;
                if (!userEmail) return [];

                const roomUsers = await getMentionSuggestions({
                    roomId: roomId,
                    currentUser: userEmail,
                    text: text
                });

                return roomUsers;
            }}
        >
            <ClientSideSuspense fallback={<Loader/>}>
                {children}
            </ClientSideSuspense>
    </LiveblocksProvider>
    )
}

export default Provider
