"use client";

import React, { useState, useEffect } from "react";
import TreeView from "@/components/TreeView";

// import CreateButton from "@/components/Button/CreateButton";
// import CreateLayanan from "./ServiceTypeCreate";
// import DeleteLayanan from "./ServiceTypeDelete";
// import EditLayanan from "./ServiceTypeEdit";
// import AddSubLayanan from "./ServiceTypeAddChild";

const DaftarJenisLayanan: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [isCreate, setIsCreate] = useState(false);
    const [isAdd, setIsAdd] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedObject, setSelectedObject] = useState<any | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/master/service-types`);
                const result = await response.json();

                if (result.success) {
                    setData(result.data);
                } else {
                    throw new Error(result.message || "Gagal memuat daftar jenis layanan");
                }
            } catch (err: any) {
                console.log(err.message);
            }
        };

        if (isEdit || isCreate || isDelete || isAdd) return;

        fetchData();
    }, [isEdit, isCreate, isDelete, isAdd]);

    const openCreate = () => setIsCreate(true);
    const closeCreate = () => setIsCreate(false);

    const openAdd = (obj: any) => {
        setSelectedObject(obj);
        setIsAdd(true);
    };

    const closeAdd = () => {
        setIsAdd(false);
        setSelectedObject(null);
    };

    const openEdit = (obj: any) => {
        setSelectedObject(obj);
        setIsEdit(true);
    };

    const closeEdit = () => {
        setIsEdit(false);
        setSelectedObject(null);
    };

    const openDelete = (obj: any) => {
        setSelectedObject(obj);
        setIsDelete(true);
    };

    const closeDelete = () => {
        setIsDelete(false);
        setSelectedObject(null);
    };

    return (
        <div className="grid gap-y-4">
            <div className="py-1 border rounded-lg bg-white">
                {/* Header */}
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-lg font-bold ml-2">Daftar Jenis Layanan</h2>
                    <div className="flex gap-2">
                        {/* <CreateButton onClick={openCreate} /> */}
                    </div>
                </div>

                {/* Konten TreeView */}
                <div className="p-6">
                    <TreeView
                        data={data}
                        onAdd={openAdd}
                        onEdit={openEdit}
                        onDelete={openDelete}
                        disableAdd
                        disableEdit
                        disableDelete
                    />
                </div>
            </div>

            {/* Modal Create/Edit/Delete */}
            {/* 
            {isCreate && (
                <CreateLayanan
                    isOpen={isCreate}
                    onClose={closeCreate}
                    layanan={data}
                />
            )}

            {isAdd && (
                <AddSubLayanan
                    isOpen={isAdd}
                    onClose={closeAdd}
                    data={selectedObject}
                    layanan={data}
                />
            )}

            {isDelete && (
                <DeleteLayanan
                    isOpen={isDelete}
                    onClose={closeDelete}
                    data={selectedObject}
                />
            )}

            {isEdit && (
                <EditLayanan
                    isOpen={isEdit}
                    onClose={closeEdit}
                    data={selectedObject}
                    layanan={data}
                />
            )}
            */}
        </div>
    );
};

export default DaftarJenisLayanan;