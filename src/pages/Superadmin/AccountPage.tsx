import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate, useParams } from "react-router-dom";
import User from "@/types/User";
import api from "@/api/axios";
import AdminPage from "@/components/custom/AdminPage";
import { ArrowLeft, Mail, MapPin, PenBox, Phone, SquarePen } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import IconButton from "@/components/custom/IconButton";
import Loading from "@/components/Loading";
import Modal from "@/components/custom/Modal";
import InputWithLabel from "@/components/custom/InputWithLabel";
import ButtonWithLoading from "@/components/custom/ButtonWithLoading";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import QueryLoadingPage from "../StatusPages/QueryLoadingPage";
import QueryNotFound from "../StatusPages/QueryNotFound";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type FormData = {
    username?: string;
    name?: string;
    email?: string;
    role?: string;
};

type Errors = {
    username?: string;
    name?: string;
    email?: string;
    role?: string;
};

const AccountPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [user, setUser] = useState<User | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const { toast } = useToast();

    const [formData, setFormData] = React.useState<FormData>({
        username: "",
        name: "",
        email: "",
        role: "",
    });

    const [errors, setErrors] = React.useState<Errors>({
        username: "",
        name: "",
        email: "",
        role: "",
    });

    const fetchUser = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/users/${id}`);
            setUser(res.data);
            setLoading(false);
        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    }
    
    useEffect(() => {
        fetchUser();
    }, [id]);

    React.useEffect(() => {
        if(user){
            setFormData(() => {
                return {
                    username: user.username,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                }
            });
        }
    }, [user]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            return {
                ...prev,
                [name]: value,
            }
        });

        setErrors((prev) => {
            return {
                ...prev,
                [name]: "",
            }
        });
    }


    // console.log(user);

    // console.log(formData);

    const userName = user?.name?.split("").slice(0, 2).join("").toUpperCase();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
        setImagePreview(URL.createObjectURL(e.target.files[0]));
        setUser((prev) =>
            prev ? { ...prev, profile_picture: e.target.files![0] as any } : prev
        );
        }
    };

    const handleSave = async (e: FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setButtonLoading(true);

        try {
            const res = await api.put(`/users/${id}`, formData);

            console.log(res);
            toast({ title: "Profile updated successfully" });
            setEditModal(false);
            fetchUser();
        } catch (err) {
            console.log(err);
            setErrors(err.response.data.message);
            toast({ title: "Error updating profile", variant: "destructive" });
        } finally {
            setLoading(false);
            setButtonLoading(false);
        }
    };

    if (loading) return <QueryLoadingPage />;

    if (!loading && !user) {
    return (
        <QueryNotFound message="Account Not Found" />
    );
    }

    return (
        <AdminPage withBackButton={true} title={'Account Page'} description={`@${user.username}`} titleAction={
            <Modal title={"Update"} open={editModal} setOpen={setEditModal} buttonLabel={
                <>
                    <PenBox /> Update Account
                </>
            }>
                <form onSubmit={handleSave} className="space-y-6">
                    <div className='grid grid-cols-2 gap-6'>
                        <InputWithLabel
                            id="username"
                            name='username'
                            type="text"
                            label='Username'
                            placeholder="Enter username"
                            value={formData.username}
                            error={errors?.username}
                            onChange={handleChange}
                            disabled={loading}
                        />
                        <InputWithLabel
                            id="name"
                            name='name'
                            type="text"
                            label='Name'
                            placeholder="Enter name"
                            value={formData.name}
                            error={errors?.name}
                            onChange={handleChange}
                            disabled={loading}
                        />
                        <InputWithLabel
                            id="email"
                            name='email'
                            type="email"
                            label='Email'
                            placeholder="Enter email address"
                            value={formData.email}
                            error={errors?.email}
                            onChange={handleChange}
                            disabled={loading}
                        />
                        <div className='flex flex-col gap-2'>
                            <div className='flex flex-col gap-3 w-full'>
                                <Label>
                                    Role
                                </Label>
                                <Select onValueChange={(value) => setFormData((prev) => {
                                    return {
                                        ...prev,
                                        role: value
                                    }
                                })} value={formData.role}>
                                    <SelectTrigger className="w-full" disabled={loading}>
                                        <SelectValue placeholder="Set role..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="superadmin">Super Admin</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="driver">Driver</SelectItem>
                                        {/* <SelectItem value="user">User</SelectItem> */}
                                    </SelectContent>
                                </Select>
                            </div>
                            {errors?.role && <span className='text-destructive text-sm'>{errors?.role}</span>}
                        </div>
                    </div>
                    <div className="w-full grid grid-cols-2 gap-2">
                        <ButtonWithLoading
                            type='submit'
                            disabled={loading}
                            className='w-full'
                            loading={buttonLoading}
                        >
                            Update
                        </ButtonWithLoading>
                        <Button type="button" variant="outline" onClick={() => setEditModal(false)}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </Modal>
        }>
            <div className="w-full space-y-6">
                {/* <Card className="">
                    <CardHeader className="flex items-center justify-center text-center">
                        <Avatar className="w-20 h-20">
                            <AvatarImage src={imagePreview || `/storage/${user.profile_picture}`} />
                            <AvatarFallback className="text-3xl">{userName}</AvatarFallback>
                        </Avatar>
                        <span className="text-lg font-semibold">{user.name}</span>
                        <span className="text-muted-foreground uppercase text-sm">{user.role}</span>
                    </CardHeader>
                    <CardContent className="p-6 flex flex-col gap-4">
                        {user.email && <div className="flex items-center gap-4">
                            <Mail className="w-4" />
                            <span>{user.email}</span>
                        </div>}
                        {user.phone_number && <div className="flex items-center gap-4">
                            <Phone className="w-4" />
                            <span>{user.phone_number}</span>
                        </div>}
                        {user.address && <div className="flex items-center gap-4">
                            <MapPin className="w-4" />
                            <span>{user.address}</span>
                        </div>}
                    </CardContent>
                </Card> */}

                <div className="flex flex-col lg:flex-row gap-4 w-full">
                    <div className="flex flex-col gap-4 flex-1">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Personal Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    {user.name && <div className="flex flex-col">
                                        <span className="text-muted-foreground">Name</span>
                                        <span>{user.name}</span>
                                    </div>}
                                    {user.username && <div className="flex flex-col">
                                        <span className="text-muted-foreground">Username</span>
                                        <span>{user.username}</span>
                                    </div>}
                                    {user.email && <div className="flex flex-col">
                                        <span className="text-muted-foreground">Email</span>
                                        <span>{user.email}</span>
                                    </div>}
                                    {user.role && <div className="flex flex-col">
                                        <span className="text-muted-foreground">Role</span>
                                        <span className="capitalize">{user.role}</span>
                                    </div>}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Registratrion Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <div className="flex flex-col">
                                        <span className="text-muted-foreground">Date Created</span>
                                        <span>{format(new Date(user.created_at), "PPpp")}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-muted-foreground">Status</span>
                                        {user.status === "active" ? 
                                            <Badge className="bg-green-500 text-white hover:bg-green-600 w-fit">Active</Badge>
                                            :
                                            <Badge className="text-nowrap w-fit" variant="destructive">Inactive</Badge>
                                        }
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    
                    <div className="flex-1">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Activities
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
                                    {user.name && <div className="flex flex-col">
                                        <span className="text-muted-foreground">Name</span>
                                        <span>{user.name}</span>
                                    </div>}
                                    {user.username && <div className="flex flex-col">
                                        <span className="text-muted-foreground">Username</span>
                                        <span>{user.username}</span>
                                    </div>}
                                    {user.email && <div className="flex flex-col">
                                        <span className="text-muted-foreground">Email</span>
                                        <span>{user.email}</span>
                                    </div>}
                                    {user.name && <div className="flex flex-col">
                                        <span className="text-muted-foreground">Name</span>
                                        <span>{user.name}</span>
                                    </div>}
                                    {user.username && <div className="flex flex-col">
                                        <span className="text-muted-foreground">Username</span>
                                        <span>{user.username}</span>
                                    </div>}
                                    {user.email && <div className="flex flex-col">
                                        <span className="text-muted-foreground">Email</span>
                                        <span>{user.email}</span>
                                    </div>}
                                    {user.name && <div className="flex flex-col">
                                        <span className="text-muted-foreground">Name</span>
                                        <span>{user.name}</span>
                                    </div>}
                                    {user.username && <div className="flex flex-col">
                                        <span className="text-muted-foreground">Username</span>
                                        <span>{user.username}</span>
                                    </div>}
                                    {user.email && <div className="flex flex-col">
                                        <span className="text-muted-foreground">Email</span>
                                        <span>{user.email}</span>
                                    </div>}
                                    {user.name && <div className="flex flex-col">
                                        <span className="text-muted-foreground">Name</span>
                                        <span>{user.name}</span>
                                    </div>}
                                    {user.username && <div className="flex flex-col">
                                        <span className="text-muted-foreground">Username</span>
                                        <span>{user.username}</span>
                                    </div>}
                                    {user.email && <div className="flex flex-col">
                                        <span className="text-muted-foreground">Email</span>
                                        <span>{user.email}</span>
                                    </div>}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

            </div>
        </AdminPage>
    );
};

export default AccountPage;
