'use server'

// Import required dependencies
import {nanoid} from 'nanoid' // For generating unique room IDs
import { liveblocks } from '../liveblocks'; // Liveblocks client
import { revalidatePath } from 'next/cache'; // For revalidating Next.js cache
import { getAccessType, parseStringify } from '../utils'; // Utility for parsing/stringifying data

/*
A room in this context is a collaborative workspace created using Liveblocks.
It represents a shared document/canvas where multiple users can collaborate in real-time.

Key aspects of a room:
1. Each room has a unique ID generated using nanoid
2. Contains metadata like:
    - Creator's ID and email
    - Room title
3. Has access control:
    - Creator gets write access by default
    - Other users' access can be configured
4. Enables real-time collaboration features through Liveblocks
*/

// Function to create a new document/room
export const createDocument = async ({userId , email} : CreateDocumentParams) => {
    // Generate unique room ID
    const roomId = nanoid();
    
    try {
        // Set up metadata for the room
        const metadata = {
            creatorId : userId, // ID of user creating the room
            email , // Email of creator
            title : 'untitled', // Default room title
        }

        // Define access permissions for users
        // Initially only creator has write access
        const usersAccesses : RoomAccesses = {
            [email]: ['room:write'],
        }

        // Create new Liveblocks room with configured settings
        const room = await liveblocks.createRoom(roomId, {
            metadata,
            usersAccesses,
            defaultAccesses : [] // No default access for other users
        });

        // Revalidate the homepage to show new room
        revalidatePath('/');

        // Return parsed room data
        return parseStringify(room);

    } catch (error) {
        // Log any errors during room creation
        console.log("Error happened while creating a room ", error);
    }
}


export const getDocument = async ({roomId , userId} : {roomId : string , userId : string}) => {
    try {
        const room = await liveblocks.getRoom(roomId);

        const hasAccess = Object.keys(room.usersAccesses).includes(userId);
        if(!hasAccess) {
            throw new Error("You don't have access to this room");
        }
        return parseStringify(room);

    } catch (error) {
        console.log("Error happened while fetching a room ", error);
    }
}


export const updateDocument = async (roomId : string , title : string) => {
    try {
            const updatedRoom =  await liveblocks.updateRoom(roomId , {
                metadata : {title}
            });

            revalidatePath(`/documents/${roomId}`);
            return parseStringify(updatedRoom);
    } catch (error) {
        console.log("Error happened while updating a room ", error);
    }
}


export const getDocuments = async (email : string) => {
    try {
        const rooms = await liveblocks.getRooms({userId : email });
        return parseStringify(rooms);

    } catch (error) {
        console.log("Error happened while fetching a rooms", error);
    }
}

export const updateDocumentAccess = async ({roomId , email , userType , updatedBy } : ShareDocumentParams) => {
    try {

        const usersAccesses : RoomAccesses = {
            [email]:getAccessType(userType) as AccessType,
        }

        const room = await liveblocks.updateRoom(roomId , {
            usersAccesses
        })

        if(room){
                // TODO : 
        }

        revalidatePath(`/documents/${roomId}`);
        return parseStringify(room);
    } catch (error) {
        console.log("Error happened while updating a room access ", error);
    }

}


export const removeCollaborator = async ({roomId , email } : {roomId : string , email : string}) => {
    try {
        const room =  await  liveblocks.getRoom(roomId);

        if(room.metadata.email === email) {
            throw new Error("You can't remove the owner of the room");
        }

        const updatedRoom = await liveblocks.updateRoom(roomId , {
            usersAccesses : {
                [email] : null
            }
        })

        revalidatePath(`/documents/${roomId}`);
        return parseStringify(updatedRoom);

    } catch (error) {
        console.log("Error happened while removing a collaborator ", error);
    }
}