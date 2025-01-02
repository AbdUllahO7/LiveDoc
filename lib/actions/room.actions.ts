'use server'

// Import required dependencies
import {nanoid} from 'nanoid' // For generating unique room IDs
import { liveblocks } from '../liveblocks'; // Liveblocks client
import { revalidatePath } from 'next/cache'; // For revalidating Next.js cache
import { parseStringify } from '../utils'; // Utility for parsing/stringifying data

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