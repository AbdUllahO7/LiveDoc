import { SignIn } from '@clerk/nextjs'
import React from 'react'

const signInPage = () => {
    return (
        <main className='auth-page'>
            <SignIn />
        </main>
    )
}

export default signInPage
