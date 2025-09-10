import api from '@/api/axios';
import ButtonWithLoading from '@/components/custom/ButtonWithLoading';
import InputWithLabel from '@/components/custom/InputWithLabel';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/store/auth';
import React, { ChangeEvent, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';


type FormData = {
  name: string;
  contact_number: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: 'worker' | 'employer';
  skills?: string;
  experience?: string;
  business_name?: string;
};

const Register = () => {
  const { login } = useAuth();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [formData, setFormData] = React.useState<FormData>({
    name: '',
    contact_number: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'worker',
    skills: '',
    experience: '',
    business_name: '',
  });
  const [errors, setErrors] = React.useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors(null);

    try {
      const res = await api.post('/register', formData);
      login(res.data.user, res.data.token); // assuming API returns { user, token }
      setLoading(false);
    } catch (err: any) {
      setErrors(err.response?.data?.message || 'Registration failed');
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 flex items-center justify-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <Card className="max-w-md mx-auto w-full">
          <CardHeader className="flex items-center">
            <CardTitle>
              <div className="flex flex-col gap-4 w-full text-center">
                <span>Register</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              {errors && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-2 w-full text-center">
                  <span className="text-destructive text-sm">{errors}</span>
                </div>
              )}
              <div className="space-y-6">
                <InputWithLabel
                  id="name"
                  name="name"
                  type="text"
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={loading}
                />

                <InputWithLabel
                  id="contact_number"
                  name="contact_number"
                  type="text"
                  label="Contact Number"
                  placeholder="09XXXXXXXXX"
                  value={formData.contact_number}
                  onChange={handleChange}
                  disabled={loading}
                />

                <InputWithLabel
                  id="email"
                  name="email"
                  type="email"
                  label="Email"
                  placeholder="Enter your Email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                />

                <InputWithLabel
                  id="password"
                  name="password"
                  type="password"
                  label="Password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                />

                <InputWithLabel
                  id="password_confirmation"
                  name="password_confirmation"
                  type="password"
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  disabled={loading}
                />

                <div className="flex flex-col gap-2">
                    <Label htmlFor="role">Register As</Label>
                    <Select
                        value={formData.role}
                        onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, role: value as "worker" | "employer" }))
                        }
                    >
                        <SelectTrigger id="role">
                        <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="worker">Worker</SelectItem>
                        <SelectItem value="employer">Employer</SelectItem>
                        </SelectContent>
                    </Select>
                </div>


                {formData.role === 'worker' && (
                  <>
                    <InputWithLabel
                      id="skills"
                      name="skills"
                      type="text"
                      label="Skills"
                      placeholder="e.g. Carpentry, Plumbing"
                      value={formData.skills || ''}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    <InputWithLabel
                      id="experience"
                      name="experience"
                      type="text"
                      label="Experience"
                      placeholder="e.g. 5 years in construction"
                      value={formData.experience || ''}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </>
                )}

                {formData.role === 'employer' && (
                  <InputWithLabel
                    id="business_name"
                    name="business_name"
                    type="text"
                    label="Business Name"
                    placeholder="Enter your business name"
                    value={formData.business_name || ''}
                    onChange={handleChange}
                    disabled={loading}
                  />
                )}
              </div>

              <ButtonWithLoading
                type="submit"
                disabled={loading || !formData.name || !formData.email || !formData.password || !formData.password_confirmation}
                className="w-full"
                loading={loading}
              >
                Register
              </ButtonWithLoading>
            </form>
          </CardContent>
          <CardFooter className="w-full text-center flex justify-center">
            <p>
              Already have an account?{' '}
              <Link className="text-primary font-semibold" to="/login">
                Login
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;