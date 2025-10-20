import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import InputWithLabel from "./InputWithLabel";
import api from "@/api/axios";
import { toast } from "@/hooks/use-toast";

interface EditProjectProps {
  project: any;
  setEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  onUpdated: () => void;
}

export default function EditProject({
  project,
  setEditModal,
  onUpdated,
}: EditProjectProps) {
  const [form, setForm] = useState({
    title: "",
    employer: "",
    description: "",
    date_started: "",
    date_ended: "",
    picture: null as File | null,
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (project) {
      setForm({
        title: project.title || "",
        employer: project.employer || "",
        description: project.description || "",
        date_started: project.date_started || "",
        date_ended: project.date_ended || "",
        picture: null,
      });

      setPreview(
        project.picture
          ? `${import.meta.env.VITE_API_URL}/api/files/${project.picture}`
          : null
      );
    }
  }, [project]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm({ ...form, picture: file });
    setPreview(file ? URL.createObjectURL(file) : preview);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) formData.append(key, value as any);
    });
    formData.append("_method", "PUT");

    try {
      await api.post(`/projects/${project.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast({ title: "Project updated successfully!" });
      onUpdated();
      setEditModal(false);
    } catch (error: any) {
      console.error(error);
      setErrors(error.response?.data?.errors || {});
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
        <Label>Project Description</Label>
        <Textarea
          name="description"
          placeholder="Project Description"
          value={form.description}
          onChange={handleChange}
        />
        {errors?.description && (
          <span className="text-destructive text-sm">{errors.description}</span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <InputWithLabel
          name="date_started"
          type="date"
          label="Date Started"
          value={form.date_started}
          onChange={handleChange}
          error={errors?.date_started}
          required
        />
        <InputWithLabel
          name="date_ended"
          type="date"
          label="Date Ended"
          value={form.date_ended}
          onChange={handleChange}
          error={errors?.date_ended}
          required
        />
      </div>

      <div className="space-y-2">
        <Input type="file" accept="image/*" onChange={handleFileChange} />
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="rounded-xl w-full max-h-64 object-cover"
          />
        )}
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Updating..." : "Update Project"}
      </Button>
    </form>
  );
}
