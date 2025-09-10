import api from '@/api/axios';
import ButtonWithLoading from '@/components/custom/ButtonWithLoading';
import InputWithLabel from '@/components/custom/InputWithLabel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/store/auth';
import { Value } from '@radix-ui/react-select';
import axios from 'axios';
import React, { ChangeEvent, FormEvent } from 'react'
import { Link } from 'react-router-dom';
import logo from "../assets/logo.png";

type FormData = {
    email: string;
    password: string;
}

const Login = () => {
    const { login } = useAuth();
    const [loading, setLoading] = React.useState<boolean>(false);
    const [formData, setFormData] = React.useState<FormData>({
        email: "",
        password: "",
    });

    const [errors, setErrors] = React.useState("");

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            return {
                ...prev,
                [name]: value,
            }
        });

        setErrors(null);
    }
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors(null);

        try {
            const res = await api.post('/login', formData);
            console.log(res);
            login(res.data.user, res.data.access_token);
            setLoading(false);
        } catch (err: any) {
            setErrors(err.response.data.message);
            console.log(err);
            setLoading(false);
        }

    };


    return (
        <div className="min-h-screen py-12 flex items-center justify-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <Card className='max-w-md mx-auto w-full'>
                    <CardHeader className='flex items-center'>
                        <CardTitle>
                            <div className='flex flex-col gap-4 w-full text-center'>
                                <span>Login</span>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                            {errors && 
                            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-2 w-full text-center">
                                <span className='text-destructive text-sm'>{errors}</span>
                            </div>
                            }
                            <div className='space-y-6'>
                                <InputWithLabel
                                    id="email"
                                    name='email'
                                    type="email"
                                    label='Email'
                                    placeholder="Enter your Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                                <InputWithLabel
                                    id="password"
                                    name='password'
                                    type="password"
                                    label='Password'
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </div>
                            <div className='w-full flex justify-end text-sm'>
                                
                            </div>
                            <ButtonWithLoading
                                type='submit'
                                disabled={loading || formData.email === "" || formData.password === ""}
                                className='w-full'
                                loading={loading}
                            >
                                Login
                            </ButtonWithLoading>
                        </form>
                    </CardContent>
                    <CardFooter className='w-full text-center flex justify-center'>
                        <p>Don't have an account? <Link className='text-primary font-semibold' to={'/register'}>Signup</Link></p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}

export default Login
