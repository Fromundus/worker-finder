import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { MoreVertical, Plus, PlusCircle, Save, Shield, Trash, User as UserIcon, UserCheck, Search, CarFront } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import User from "@/types/User";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import InputWithLabel from "./InputWithLabel";
import { Label } from "../ui/label";
import ButtonWithLoading from "./ButtonWithLoading";
// import AddAdmin from "./add-modals/AddAdmin";
// import AddUser from "./add-modals/AddUser";
import IconButton from "./IconButton";
import Modal from "./Modal";
import api from "@/api/axios";
import AddUser from "./add-modals/AddUser";

export default function AccountsTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [selected, setSelected] = useState<number[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search); // new
  const [loading, setLoading] = useState(false);

  const [deleteModal, setDeleteModal] = useState(false);

  const [fetchTotal, setFetchTotal] = useState();

  const [counts, setCounts] = useState({
    total: 0,
    superadmin: 0,
    admin: 0,
    driver: 0,
  });
  
  // console.log(counts);

  const fetchUsers = async (searchQuery = debouncedSearch) => {
    setLoading(true);

    try {
      const res = await api.get(`/users`, {
        params: { 
          page, 
          per_page: perPage, 
          search: searchQuery,
        },
      });
      console.log(res);
      setUsers(res.data.users.data);
      setTotalPages(res.data.users.last_page);
      setFetchTotal(res.data.users.total);
      setCounts(res.data.counts);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  // Fetch when page or search changes
  useEffect(() => {
    fetchUsers();
  }, [page, debouncedSearch]);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 1000); // 1 second debounce

    return () => clearTimeout(handler);
  }, [search]);

  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selected.length === users.length) {
      setSelected([]);
    } else {
      setSelected(users.map((u) => u.id));
    }
  };

  const bulkDelete = async () => {
    if (!selected.length) return;
    setLoading(true);
    
    try {
      await api.delete("/users", { data: { ids: selected } });

      toast({
        title: "Deleted Successfully",
      });

      setSelected([]);
      setDeleteModal(false);
      fetchUsers();

    } catch (err) {
      console.log(err);
      toast({
        title: err.response.status,
        description: err.response.data.message,
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Search + Bulk Actions */}
      <div className="flex gap-6 flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Nutrition Scholar Management</h2>
          <p className="text-muted-foreground">Manage nutrition scholar information and records</p>
        </div>
        <div className="space-x-4">
          {/* <Button>
            <Link className="flex items-center gap-2" to={'add'}>
              <Plus /> Add Account
            </Link>
          </Button> */}

          <AddUser refetch={fetchUsers} />

          {/* <AddAdmin refetch={fetchUsers} /> */}
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col w-full lg:justify-between lg:flex-row gap-2">
            <div className="relative w-full">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="w-full flex flex-col gap-6 lg:flex-row lg:justify-between lg:items-center">
            <CardTitle>
              Nutrition Scholar Records
            </CardTitle>
              <div className="flex items-center gap-2">
                  <>
                    <Modal disabled={selected.length === 0 || loading} title="Delete Accounts" buttonLabel={<Trash />} buttonClassName="w-10 h-10 bg-destructive text-white hover:bg-destructive/50" open={deleteModal} setOpen={setDeleteModal}>
                      <p>Are you sure you want to delete?</p>
                      <div className="w-full grid grid-cols-2 gap-2">
                        <ButtonWithLoading className="w-full" loading={loading} disabled={loading || selected.length === 0} onClick={bulkDelete}>
                          Yes
                        </ButtonWithLoading>
                        <Button variant="outline" onClick={() => setDeleteModal(false)}>
                          Cancel
                        </Button>
                      </div>
                    </Modal>

                    {/* <IconButton variant="destructive" onClick={bulkDelete} disabled={selected.length === 0 || loading}>
                      <Trash />
                    </IconButton> */}
                  </>
              </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={selected.length === users.length && users.length > 0}
                    onCheckedChange={selectAll}
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Contact Number</TableHead>
                <TableHead>Area of Assignment</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : users.length > 0 ? (
                users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>
                      <Checkbox
                        checked={selected.includes(u.id)}
                        onCheckedChange={() => toggleSelect(u.id)}
                      />
                    </TableCell>
                    <TableCell>{u.name}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.contact_number}</TableCell>
                    <TableCell>{u.area}</TableCell>
                    <TableCell>{u.notes}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No nutrition scholars found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {/* Pagination */}
          <div className="flex items-center justify-between gap-4 w-full mt-4">
            <span className="text-sm text-muted-foreground">{selected.length} of {fetchTotal} row(s) selected.</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Prev
              </Button>
              <span className="px-4 text-sm flex items-center bg-background border p-2 rounded">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>


    </div>
  );
}

