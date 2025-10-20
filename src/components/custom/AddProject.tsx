import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/api/axios";
import { toast } from "@/hooks/use-toast";
import InputWithLabel from "./InputWithLabel";
import { Label } from "../ui/label";

export default function AddProject({ setAddProjectModal }: { setAddProjectModal: React.Dispatch<React.SetStateAction<boolean>> }) {
  const [form, setForm] = useState({
    title: "",
    employer: "",
    description: "",
    date_started: "",
    date_ended: "",
    picture: null as File | null,
  });

  const [errors, setErrors] = React.useState<Record<string, string>>(null);

  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm({ ...form, picture: file });
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) formData.append(key, value as any);
    });

    try {
      const res = await api.post('/projects', formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      console.log(res);
        toast({ title: "Added Successfully" });
      setForm({ title: "", employer: "", description: "", date_started: "", date_ended: "", picture: null });
      setPreview(null);
      setAddProjectModal(false);
    } catch (error) {
      console.error(error);
      setErrors(error.response?.data?.errors || {});
    //   alert("Error saving project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
        <InputWithLabel
            name="title"
            label="Project Title"
            placeholder="Project Title"
            value={form.title}
            onChange={handleChange}
            error={errors?.title}
            required
        />
        <InputWithLabel
            name="employer"
            label="Employer"
            placeholder="Employer"
            value={form.employer}
            onChange={handleChange}
            error={errors?.employer}
            required
        />
        <div className="flex flex-col gap-3">
            <Label>
                Project Description
            </Label>
            <Textarea name="description" placeholder="Project Description" value={form.description} onChange={handleChange} />
            {errors?.description && <span className="text-destructive text-sm">{errors?.description}</span> }
        </div>
        
        <div className="grid grid-cols-2 gap-4">
            <InputWithLabel
                name="date_started"
                type="date"
                label="Date Started"
                placeholder="Date Started"
                value={form.date_started}
                onChange={handleChange}
                error={errors?.date_started}
                required
                className="w-full"
            />
            <InputWithLabel
                name="date_ended"
                type="date"
                label="Date Ended"
                placeholder="Date Ended"
                value={form.date_ended}
                onChange={handleChange}
                error={errors?.date_ended}
                required
                className="w-full"
            />
        </div>

        <div className="space-y-2">
        <Input type="file" accept="image/*" onChange={handleFileChange} />
        {preview && <img src={preview} alt="Preview" className="rounded-xl w-full max-h-64 object-cover" />}
        </div>

        <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Saving..." : "Save Project"}
        </Button>
    </form>
  );
}