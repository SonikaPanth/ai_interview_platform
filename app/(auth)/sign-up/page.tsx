import React from 'react'
import AuthForm from '@/app/component/authform'

export const dynamic = "force-dynamic";
const SignupPage = ({children}:{children: React.ReactNode}) => {
   return <AuthForm type="sign-up"/>
}

export default SignupPage
