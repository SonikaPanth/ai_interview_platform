"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import Image from "next/image"

import {
  Form,
  FormControl,
  FormDescription,
  
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import FormField from '@/app/component/formfield'

import { z } from "zod"
import Link from "next/link"
import { toast } from "sonner"
import  { useRouter } from "next/navigation"
import { auth } from "@/firebase/client"
import { signIn, signUp } from "@/lib/actions/auth.action"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
// import { Auth } from "firebase-admin/auth"

const authFormSchema=(type:FormType)=>{
  return z.object({
    name:type==="sign-up"?z.string().min(3):z.string(),
    email: z.email(),
    password:z.string().min(3),

  })
}

interface AuthFormProps {
  type: "sign-in" | "sign-up";
}

const AuthForm = ({type}:{type:FormType}) => {
    const formSchema=authFormSchema(type);
    const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email:"",
      password:"",
    },
  })

  const router=useRouter()
 
  // 2. Define a submit handler.
 async function onSubmit(values: z.infer<typeof formSchema>) {
    try {

      if(type==='sign-up'){

        const{name,email,password}=values;
        const userCredentials=await createUserWithEmailAndPassword(auth,email,password)
        
        const result=await signUp({
          uid:userCredentials.user.uid,
          name:name!,
          email,
          password,
        })

        if(!result?.success){
          toast.error(result?.message)
          return;
        }
        toast.success("Account created successfully ! Please login")
        router.push('/sign-in')
      }

      else{
        const {email,password}=values;
        const userCredentials= await signInWithEmailAndPassword(auth,email,password)
        const idToken= await userCredentials.user.getIdToken()

        if(!idToken){
          toast.error('Sign In Failed')
        }

        await signIn(
          {
            email,idToken
          }
        )
        toast.success("login successfull")
        router.push('/')
      }
      
    } catch (error) {
      console.log(error);
      toast.error(`there was an error ${error}`)
    }
  }

  const isSignIn =type === "sign-in";
    return(
        <div className="card-border lg:min-w[566px]  "> 
        <div className="flex flex-col gap-6 card py-14 px-10">
          <div className="flex flex-row gap-2 justify-center">
             <Image src="/globe.svg" alt="Logo" width={38} height={32}/>
             <h2 className="text-primary-100">Prepwise</h2>
          </div>
          <h3>Practice job interview with AI</h3>
        
            <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} 
      
      className="space-y-6  mt-4 w-full form">
       
        {!isSignIn && (
        <FormField control={form.control} name="name" label="Name" placeholder="Enter your name" type="text" />
       ) }
        <FormField control={form.control} name="email" label="Email" placeholder="Enter your email" type="email" />
        <FormField control={form.control} name="password" label="Password" placeholder="Enter your password" type="password" />
        <Button type="submit" className="btn">{isSignIn?"Sign In" : "Create an account"}</Button>
      </form>
    </Form>
    <p className="text-center">{isSignIn ? "No account yet? " : "Already have and account"} 
      <Link href={isSignIn ? "/sign-up" : "/sign-in"} className="font-bold text-primary-100 ml-1">{isSignIn ? "Sign up" : "Sign in"}</Link>
      </p>
        </div>
        </div>
    )
}

export default AuthForm
// function createUserWithEmailAndPassword(auth: any, email: string, password: string) {
//   // Mock implementation for demonstration; replace with actual Firebase logic as needed
//   return Promise.resolve({
//     user: {
//       uid: "mock-uid-12345"
//     }
//   });
// }

