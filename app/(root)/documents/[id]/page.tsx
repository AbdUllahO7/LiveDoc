


import CollaborativeRoom from '@/components/CollaborativeRoom'
import { getDocument } from '@/lib/actions/room.actions';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react'

const Document = async ({ params }: SearchParamProps) => {
    // Await params before destructuring
    const id = (await params).id;

    const clerkUser = await currentUser();

    if(!clerkUser) redirect('/sign-in');

    const room = await getDocument({roomId : id , userId : clerkUser.emailAddresses[0].emailAddress});

    if(!room) redirect('/');

    // TODO: Assess the permissions of the user to access the document 

    return (
        <main className='flex flex-col w-full items-center'>
            <CollaborativeRoom  
                roomId={id} 
                roomMetadata={room.metadata}
            />
        </main>
    )
}

export default Document
