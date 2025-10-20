// import React, { useEffect, useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Separator } from "../ui/separator";
// import { Trash2 } from "lucide-react";
// import api from "@/api/axios";
// import ipconfig from "@/ipconfig";
// import { useParams } from "react-router-dom";

// interface Project {
//   id: number;
//   title: string;
//   employer: string;
//   description: string;
//   picture?: string;
//   date_started: string;
//   date_ended: string;
// }

// export default function ProjectList({ userId }: { userId: number }) {
//     const { id } = useParams();
//   const [projects, setProjects] = useState<Project[]>([]);
//   const [loading, setLoading] = useState<number | null>(null); // store the id of the project being deleted

//   const fetchProjects = async () => {
//     try {
//       const res = await api.get(`/projects/${userId}`);
//       setProjects(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleDelete = async (projectId: number) => {
//     try {
//       setLoading(projectId);
//       await api.delete(`/projects/${projectId}`);
//       setProjects((prev) => prev.filter((p) => p.id !== projectId));
//     } catch (err) {
//       console.error(err);
//       alert("Failed to delete project.");
//     } finally {
//       setLoading(null);
//     }
//   };

//   useEffect(() => {
//     fetchProjects();
//   }, []);

//   return (
//     <div className="mt-4">
//       <Separator />
//       <p className="text-lg font-semibold mb-2 flex items-center gap-2 mt-4">
//         Projects
//       </p>

//       {projects.length === 0 && (
//         <p className="text-muted-foreground text-sm">No projects found.</p>
//       )}

//       <div className="grid md:grid-cols-1 gap-4 mt-6">
//         {projects.map((project) => (
//           <Card key={project.id} className="relative">
//             <CardContent className="p-4 space-y-2">
//               {project.picture && (
//                 <img
//                   src={`${ipconfig}/api/files/${project.picture}`}
//                   alt={project.title}
//                   className="rounded-xl w-full object-cover"
//                 />
//               )}

//               <div className="flex justify-between items-start">
//                 <h3 className="font-semibold text-lg">{project.title}</h3>
//                 {!id && <Button
//                   variant="destructive"
//                   size="sm"
//                   onClick={() => handleDelete(project.id)}
//                   disabled={loading === project.id}
//                   className="flex items-center gap-1"
//                 >
//                   <Trash2 size={16} />
//                   {loading === project.id ? "Deleting..." : "Delete"}
//                 </Button>}
//               </div>

//               <p className="text-sm text-muted-foreground">
//                 {project.description}
//               </p>
//               <p className="text-sm">
//                 <span className="font-medium">Employer:</span> {project.employer}
//               </p>

//               <div className="text-muted-foreground text-sm space-y-1">
//                 <p>Date Started: {project.date_started}</p>
//                 <p>Date Ended: {project.date_ended}</p>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "../ui/separator";
import { Trash2, Pencil } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import api from "@/api/axios";
import ipconfig from "@/ipconfig";
import { useParams } from "react-router-dom";
import EditProject from "./EditProject";

interface Project {
  id: number;
  title: string;
  employer: string;
  description: string;
  picture?: string;
  date_started: string;
  date_ended: string;
}

export default function ProjectList({ userId }: { userId: number }) {
  const { id } = useParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<number | null>(null);
  const [editModal, setEditModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const fetchProjects = async () => {
    try {
      const res = await api.get(`/projects/${userId}`);
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (projectId: number) => {
    try {
      setLoading(projectId);
      await api.delete(`/projects/${projectId}`);
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete project.");
    } finally {
      setLoading(null);
    }
  };

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setEditModal(true);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="mt-4">
      <Separator />
      <p className="text-lg font-semibold mb-2 flex items-center gap-2 mt-4">
        Projects
      </p>

      {projects.length === 0 && (
        <p className="text-muted-foreground text-sm">No projects found.</p>
      )}

      <div className="grid md:grid-cols-1 gap-4 mt-6">
        {projects.map((project) => (
          <Card key={project.id} className="relative">
            <CardContent className="p-4 space-y-2">
              {project.picture && (
                <img
                  src={`${ipconfig}/api/files/${project.picture}`}
                  alt={project.title}
                  className="rounded-xl w-full object-cover"
                />
              )}

              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-lg">{project.title}</h3>
                {!id && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(project)}
                      className="flex items-center gap-1"
                    >
                      <Pencil size={16} />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(project.id)}
                      disabled={loading === project.id}
                      className="flex items-center gap-1"
                    >
                      <Trash2 size={16} />
                      {loading === project.id ? "Deleting..." : "Delete"}
                    </Button>
                  </div>
                )}
              </div>

              <p className="text-sm text-muted-foreground">
                {project.description}
              </p>
              <p className="text-sm">
                <span className="font-medium">Employer:</span> {project.employer}
              </p>

              <div className="text-muted-foreground text-sm space-y-1">
                <p>Date Started: {project.date_started}</p>
                <p>Date Ended: {project.date_ended}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Project Modal */}
      <Dialog open={editModal} onOpenChange={setEditModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          {selectedProject && (
            <EditProject
              project={selectedProject}
              setEditModal={setEditModal}
              onUpdated={fetchProjects}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
