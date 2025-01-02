// Import required dependencies
import { liveblocks } from "@/lib/liveblocks"; // Liveblocks client for authentication
import { getUserColor } from "@/lib/utils"; // Utility to generate user colors
import { currentUser } from "@clerk/nextjs/server"; // Clerk authentication
import { redirect } from "next/navigation"; // Next.js redirect utility

/**
s * This API route handles authentication for Liveblocks real-time collaboration.
 * It verifies the user's authentication status and creates a Liveblocks session.
 * 
 * The route performs the following:
 * 1. Verifies user authentication via Clerk
 * 2. Extracts user information
 * 3. Creates a standardized user object with required fields
 * 4. Authenticates the user with Liveblocks
 */
export async function POST(request: Request) {
    // Get the current authenticated user from Clerk
    const clerkUser = await currentUser();      

    // If no authenticated user, redirect to sign-in
    if(!clerkUser) redirect('/sing-in');

    // Extract relevant user information from Clerk user object
    const { id, firstName, lastName, emailAddresses, imageUrl } = clerkUser;

    // Create a standardized user object with required information
    // This will be used by Liveblocks for user identification and presence
    const user = {
        id,
        info: {
            id,  
            name: `${firstName} ${lastName}`, // Full name for display
            email: emailAddresses[0].emailAddress, // Primary email
            avatar: imageUrl, // User's profile picture
            color: getUserColor(id), // Unique color for user identification in collaboration
        }
    }

    // Authenticate user with Liveblocks
    // This creates a session that allows the user to connect to Liveblocks rooms
    const { status, body } = await liveblocks.identifyUser(
        {
            userId: user.info.email, // Use email as unique identifier
            groupIds: [], // No group assignments in this case
        },
        { userInfo: user.info }, // Additional user information for collaboration
    );

    // Return the Liveblocks authentication response
    // This will be used by the client to establish a connection
    return new Response(body, { status });
}
