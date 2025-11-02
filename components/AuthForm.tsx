"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import FormField from '@/components/FormField';
import { useRouter } from "next/navigation"
import {auth} from "@/firebase/client";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth"
import {signIn, signUp} from "@/lib/actions/auth.action";

const authFormSchema =(type: FormType) => {
    return z.object({
        name: type === 'sign-up'? z.string().min(3) : z.string().optional(),
        email:z.string().email(),
        password:z.string().min(3),
        role: type === 'sign-up' ? z.enum(['admin', 'candidate']) : z.string().optional(),
    })
}


const AuthForm = ({type}:{type:FormType}) => {
    const router = useRouter();
    const formSchema = authFormSchema(type);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email:"",
            password:"",
            role: "candidate" as 'admin' | 'candidate',
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        try{
            if(type === "sign-up"){
                const{name,email,password,role}=values as {name: string, email: string, password: string, role: 'admin' | 'candidate'};
                const userCredentials = await createUserWithEmailAndPassword(auth,email,password);
                const result=await signUp({
                    uid:userCredentials.user.uid,
                    name:name!,
                    email,
                    password,
                    role,

                })
                if(!result?.success){
                    toast.error(result?.message);
                    return;
                }

                toast.success('Account created ' + 'successfully.Please Sign in');
                router.push('/sign-in');

            }else if(type === "sign-in" || type === "admin-sign-in"){
                const{email,password}=values;

                const userCredential = await signInWithEmailAndPassword(auth,email,password);
                const idToken = await userCredential.user.getIdToken();
                if(!idToken){
                    toast.error('sign in failed');
                    return;
                }
                const result = await signIn({
                    email,idToken
                })
                if(!result?.success){
                    toast.error(result?.message);
                    return;
                }
                toast.success('Sign in successfully');

                // Redirect based on role returned from signIn
                if(result.role === "admin"){
                    router.push('/admin/dashboard');
                }else if(result.role === "candidate"){
                    router.push('/candidate/dashboard');
                }else{
                    // Fallback if role not found
                    router.push('/sign-in');
                }
            }

        }catch(error){
            console.log(error);
            toast.error(`There was an error: ${error}`)
        }
    }

    const isSignIn = type=== 'sign-in';
    return (
        <div className="card-border lg:min-w-[566px]">
            <div className="flex flex-col gap-6 card py-14 px-10">
                <div className="flex flex-row gap-2 justify-center">
                    <Image
                        src="/logo.svg"
                        alt="logo"
                        height={32}
                        width={38}
                    />

                    <h2 className="text-primary-100">PrepWise</h2>
                </div>
                <h3>Practice Job interviews with AI</h3>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}
                          className="w-full space-y-6 mt-4 form">

                        {!isSignIn && (
                            <FormField
                                control={form.control}
                                name="name"
                                label="Name"
                                placeholder="Your Name" />
                        )}

                        <FormField
                            control={form.control}
                            name="email"
                            label="Email"
                            placeholder="Your Email"
                            type="email"/>

                        <FormField
                            control={form.control}
                            name="password"
                            label="Password"
                            placeholder=" Enter Your Password"
                            type="password"/>

                        {!isSignIn && (
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium">Role</label>
                                <select
                                    {...form.register("role")}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="candidate">Candidate</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                        )}

                        <Button className="btn" type="submit">{isSignIn ? 'Sign in' : 'Create an Account'}</Button>
                    </form>
                </Form>
                <p className="text-center">
                    {isSignIn ? 'No account yet':'Have an account already ?'}
                    <Link href={!isSignIn ? '/sign-in' : '/sign-up'}
                          className="font-bold text-user-primary ml-1">
                        {!isSignIn ? 'Sign in' : 'Sign up'}
                    </Link>
                </p>

            </div>
        </div>

    )
}
export default AuthForm