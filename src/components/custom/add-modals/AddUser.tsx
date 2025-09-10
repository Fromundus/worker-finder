import { toast } from '@/hooks/use-toast';
import React, { ChangeEvent, FormEvent, useEffect } from 'react'
import Modal from '../Modal';
import InputWithLabel from '../InputWithLabel';
import { Plus } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ButtonWithLoading from '../ButtonWithLoading';
import api from '@/api/axios';

type FormData = {
    name?: string;
    email?: string;
    role?: string;
    contact_number?: string;
    area?: string;
    notes?: string;
};

const AddUser = ({ refetch }: { refetch: () => void }) => {
    const [loading, setLoading] = React.useState<boolean>(false);
    const [addModal, setAddModal] = React.useState(false);
    const [formData, setFormData] = React.useState<FormData>({
        name: "",
        email: "",
        role: "",
        contact_number: "",
        area: "",
        notes: "",
    });

    const [errors, setErrors] = React.useState<FormData>({
        name: "",
        email: "",
        role: "",
        contact_number: "",
        area: "",
        notes: "",
    });

    // console.log(formData);

    const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
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
    
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors(null);

        const data = {
            ...formData,
            role: "bns"
        }

        try {
            const res = await api.post('/users', data);
            console.log(res);

            setFormData({
                name: "",
                email: "",
                role: "",
                contact_number: "",
                area: "",
                notes: "",
            });

            toast({
                title: "Created Successfully"
            });

            refetch();

            setLoading(false);
            setAddModal(false);
        } catch (err) {
            console.log(err);
            setErrors(err.response.data.errors);
            setLoading(false);
        }
    }

    useEffect(() => {
        setFormData({
            name: "",
            email: "",
            role: "",
            contact_number: "",
            area: "",
            notes: "",
        });
    }, [addModal]);

    return (
        <Modal title={"Add Nutrition Scholar"} buttonLabel={<><Plus/> Add Nutrition Scholar</>} open={addModal} setOpen={setAddModal} >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className='grid grid-cols-2 gap-6'>
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
                        id="contact_number"
                        name='contact_number'
                        type="string"
                        label='Contact Number'
                        placeholder="Enter Contact Number"
                        value={formData.contact_number}
                        error={errors?.contact_number}
                        onChange={handleChange}
                        disabled={loading}
                        minLength={11}
                        maxLength={11}
                    />
                    <InputWithLabel
                        id="area"
                        name='area'
                        type="text"
                        label='Area of Assignment'
                        placeholder="e.g. Purok 1"
                        value={formData.area}
                        error={errors?.area}
                        onChange={handleChange}
                        disabled={loading}
                    />
                    <InputWithLabel
                        id="notes"
                        name='notes'
                        type="text"
                        label='Notes'
                        placeholder="Any relevant note about the Nutrition Scholar"
                        value={formData.notes}
                        error={errors?.notes}
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
                </div>
                <ButtonWithLoading
                    type='submit'
                    disabled={loading}
                    className='w-full'
                    loading={loading}
                >
                    Create
                </ButtonWithLoading>
            </form>
        </Modal>
    )
}

export default AddUser