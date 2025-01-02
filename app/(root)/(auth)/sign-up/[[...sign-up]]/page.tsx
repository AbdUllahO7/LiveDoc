import { SignUp } from '@clerk/nextjs'
import React from 'react'

const signUpPage = () => {
    return (
        <main className='auth-page'>
            <SignUp />
        </main>
    )
}

export default signUpPage
