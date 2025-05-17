'use client';

import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import { FaEnvelope, FaPhone } from 'react-icons/fa';
import { useSession } from "next-auth/react";
import { IdentificationIcon } from '@heroicons/react/24/solid';

interface UserManageProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: Partial<FormData> & { counterId?: string; id?: string; role?: { id: string }; counter?: { id: string }; branch?: { id: string } };
    mode?: 'create' | 'edit';
}

interface FormData {
    type: string;
    username: string;
    name: string;
    email: string;
    officialId: string;
    roleId: string;
    branchId: string;
    counterId?: string; // Added counterId to the interface
}

const UserManage: React.FC<UserManageProps> = ({ isOpen, onClose, initialData, mode }) => {
    const { data: session } = useSession();

    const isBranchUser = session?.user?.branch?.type === "BRANCH";
    const branchData = session?.user?.branch;

    const [counters, setCounters] = useState<any[]>([]);

    const [formData, setFormData] = useState<FormData>({
        type: '',
        username: '',
        name: '',
        email: '',
        officialId: '',
        roleId: '',
        branchId: '',
        counterId: ''
    });

    const [roles, setRoles] = useState<any[]>([]);
    const [errors, setErrors] = useState<any>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const [region, setRegion] = useState('');
    const [area, setArea] = useState('');
    const [branch, setBranch] = useState('');

    const [regionOptions, setRegionOptions] = useState<any[]>([]);
    const [areaOptions, setAreaOptions] = useState<any[]>([]);
    const [branchOptions, setBranchOptions] = useState<any[]>([]);

    useEffect(() => {
        if (initialData) {
            setFormData({
                type: initialData.type || '',
                username: initialData.username || '',
                name: initialData.name || '',
                email: initialData.email || '',
                officialId: initialData.officialId || '',
                roleId: initialData.role?.id || '',
                branchId: initialData.branch?.id || '',
                counterId: initialData.counter?.id || ''
            });
        }
    }, [initialData]);

    useEffect(() => {
        if (isBranchUser && branchData) {
            setRegion(branchData.regionId || '');
            setArea(branchData.areaCode || '');
            setBranch(branchData.id);
            setFormData((prev) => ({ ...prev, branchId: branchData.id }));
            setFormData((prev) => ({ ...prev, type: session?.user?.branch?.type || '' }));

            const fetchCounters = async () => {
                try {
                    const res = await fetch(`/api/branches/${branchData.id}/counters`);
                    const result = await res.json();
                    if (result.success) {
                        setCounters(result.data.map((c: any) => ({
                            value: c.id,
                            label: c.name,
                        })));
                    }
                } catch (err) {
                    console.error("Error fetching counters", err);
                }
            };

            fetchCounters();
        }
    }, [branchData, isBranchUser, session]);

    useEffect(() => {
        const fetchRoles = async () => {
            let url = '/api/access/roles';

            const res = await fetch(url);
            const result = await res.json();

            if (result.success) {
                if (session?.user.branch?.type === 'BRANCH') {
                    setRoles(
                        result.data.content
                            .filter((i: any) => i.guardName === 'operator' || i.guardName === 'branch')
                            .map((r: any) => ({ value: r.id, label: r.name }))
                    );
                } else if (session?.user.branch?.type === 'AREA') {
                    setRoles(
                        result.data.content
                            .filter((i: any) => i.guardName === 'operator' || i.guardName === 'branch' || i.guardName === 'area')
                            .map((r: any) => ({ value: r.id, label: r.name }))
                    );
                } else if (session?.user.branch?.type === 'REGION') {
                    setRoles(
                        result.data.content
                            .filter((i: any) => i.guardName === 'operator' || i.guardName === 'branch' || i.guardName === 'area' || i.guardName === 'region')
                            .map((r: any) => ({ value: r.id, label: r.name }))
                    );
                } else {
                    setRoles(result.data.content
                        .map((r: any) => ({ value: r.id, label: r.name })))
                }
            }
        };

        fetchRoles();
    }, [session]);

    useEffect(() => {
        const loadRegions = async () => {
            setRegion('');
            setArea('');
            setBranch('');

            try {
                const response = await fetch(`/api/branches?type=REGION&size=100`);
                const result = await response.json();

                if (result.success) {
                    setRegionOptions(result.data.content.map((branch: any) => ({ value: branch.id, label: branch.name })));
                }
            } catch (err) {
                console.error('Error fetching regions:', err);
            }
        };

        loadRegions();
    }, []);

    useEffect(() => {
        const loadAreas = async () => {
            setBranch('');
            setArea('');

            try {
                const response = await fetch(`/api/branches?type=AREA&regionId=${region}`);
                const result = await response.json();

                if (result.success) {
                    setAreaOptions(result.data.content.map((branch: any) => ({ value: branch.id, label: branch.name })));
                }
            } catch (err) {
                console.error('Error fetching areas:', err);
            }
        };

        if (session?.user.branch?.type === 'REGION') {
            setRegion(session?.user.branch?.regionId || "");
        }

        if (region) {
            loadAreas();
        }
    }, [region, session]);

    useEffect(() => {
        const loadBranches = async () => {
            setBranch('');

            try {
                const response = await fetch(`/api/branches?type=BRANCH&areaId=${area}&regionId=${region}`);
                const result = await response.json();

                if (result.success) {
                    setBranchOptions(result.data.content.map((branch: any) => ({ value: branch.id, label: branch.name })));
                }
            } catch (err) {
                console.error('Error fetching areas:', err);
            }
        };

        if (session?.user.branch?.type === 'AREA') {
            setRegion(session?.user.branch?.regionId || "");
            setArea(session?.user.branch?.areaId || "");
        }

        if (area) {
            loadBranches();
        }
    }, [session, area, region]);

    const handleSubmit = async () => {
        setIsProcessing(true);
        setErrors(null);

        try {
            const payload = {
                ...formData,
                username: formData.email,
            };


            console.log("FORMDATA", payload);

            const url = mode === 'edit'
                ? `/api/access/users/${initialData?.id}`
                : `/api/access/users`;

            const method = mode === 'edit' ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const result = await res.json();

            if (res.status === 422) {
                setErrors(JSON.parse(result.error).data);
            } else if (result.success) {
                toast.success(mode === 'edit' ? 'Pengguna berhasil diperbarui' : 'Pengguna berhasil ditambahkan');
                onClose();
            } else {
                toast.error(result.message || 'Terjadi kesalahan.');
            }
        } catch (err) {
            console.error(err);
            toast.error('Gagal menyimpan data.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle className="text-base font-bold">
                        {mode === 'edit' ? 'Edit Pengguna' : 'Buat Pengguna Baru'}
                    </DialogTitle>
                </DialogHeader>
                {/* {JSON.stringify(formData)} */}

                {/* Informasi Akun */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Jenis Pengguna */}

                    <div>
                        <Label>Jenis Pengguna</Label>
                        <Select
                            value={formData.type}
                            onValueChange={(val) => setFormData((prev) => ({ ...prev, type: val }))}
                            disabled={isBranchUser}
                            required
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih jenis pengguna" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="REGION">Region</SelectItem>
                                <SelectItem value="AREA">Area</SelectItem>
                                <SelectItem value="BRANCH">Cabang</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Peran */}
                    <div>
                        <Label>Peran</Label>
                        <Select
                            value={formData.roleId}
                            onValueChange={(val) => setFormData((prev) => ({ ...prev, roleId: val }))}
                            required
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih peran" />
                            </SelectTrigger>
                            <SelectContent>
                                {roles.map((r) => (
                                    <SelectItem key={r.value} value={r.value}>
                                        {r.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Nama */}
                    <div>
                        <Label>Nama Lengkap</Label>
                        <Input
                            placeholder="Masukkan nama lengkap"
                            value={formData.name}
                            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                            required
                        />
                        {errors?.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <Label>Email</Label>
                        <div className="relative">
                            <Input
                                className="pl-10"
                                placeholder="contoh: user@email.com"
                                value={formData.email}
                                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                                required
                            />
                            <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                        </div>
                        {errors?.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                    </div>

                    {/* Telepon */}
                    <div>
                        <Label>Employee ID</Label>
                        <Input
                            placeholder="Employee ID"
                            value={formData.officialId}
                            onChange={(e) => setFormData((prev) => ({ ...prev, officialId: e.target.value }))}
                            maxLength={15}
                            required
                        />
                        {errors?.officialId && <p className="text-sm text-red-500 mt-1">{errors.officialId}</p>}
                    </div>

                    {formData.type === 'BRANCH' && (
                        <div>
                            <Label>Counter</Label>
                            <Select value={formData.counterId} onValueChange={(val) => setFormData((prev) => ({ ...prev, counterId: val }))}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Loket" />
                                </SelectTrigger>
                                <SelectContent>
                                    {counters.map((counter) => (
                                        <SelectItem key={counter.value} value={counter.value}>
                                            {counter.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>

                {/* Penempatan */}
                {!isBranchUser && (
                    <div className="p-5 rounded-md border border-gray-200">
                        <h3 className="text-base font-semibold text-gray-700 mb-4">Penempatan</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Region */}
                            <div>
                                <Label>Region</Label>
                                <Select value={region} onValueChange={(val) => setRegion(val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Region" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {regionOptions.map((r) => (
                                            <SelectItem key={r.value} value={r.value}>
                                                {r.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Area */}
                            {region && formData.type !== 'REGION' && (
                                <div>
                                    <Label>Area</Label>
                                    <Select value={area} onValueChange={(val) => setArea(val)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Area" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {areaOptions.map((a) => (
                                                <SelectItem key={a.value} value={a.value}>
                                                    {a.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            {/* Cabang */}
                            {area && formData.type !== 'AREA' && formData.type !== 'REGION' && (
                                <div>
                                    <Label>Cabang</Label>
                                    <Select value={branch} onValueChange={(val) => setBranch(val)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Cabang" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {branchOptions.map((b) => (
                                                <SelectItem key={b.value} value={b.value}>
                                                    {b.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <DialogFooter className="mt-6">
                    <Button variant="outline" onClick={onClose}>
                        Batal
                    </Button>
                    <Button onClick={handleSubmit} disabled={isProcessing}>
                        {isProcessing ? 'Menyimpan...' : mode === 'edit' ? 'Update' : 'Simpan'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default UserManage;