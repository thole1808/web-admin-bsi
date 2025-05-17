"use client";

import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import DateTimePicker from "@/components/Forms/DateTimePicker";
import { apiFetch } from "@/apiClient";

interface Props {
  session: any;
  filters: Record<string, string>;
  setFilters: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

const QueueTableFilters: React.FC<Props> = ({ session, filters, setFilters }) => {
  const [regionOptions, setRegionOptions] = useState<any[]>([]);
  const [areaOptions, setAreaOptions] = useState<any[]>([]);
  const [branchOptions, setBranchOptions] = useState<any[]>([]);
  const branchType = session?.user?.branch?.type || null;

  useEffect(() => {
    const regionId = session?.user?.branch?.regionId || "";
    const areaId = session?.user?.branch?.areaId || "";
    const branchId = session?.user?.branch?.id || "";
  
    if (!session) return;
  
    if (branchType === "BRANCH") {
      setFilters(prev => ({
        ...prev,
        region: regionId,
        area: areaId,
        branch: branchId
      }));
    } else if (branchType === "AREA") {
      setFilters(prev => ({
        ...prev,
        region: regionId,
        area: areaId,
        branch: ""
      }));
    } else if (branchType === "REGION") {
      setFilters(prev => ({
        ...prev,
        region: regionId,
        area: "",
        branch: ""
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        region: "",
        area: "",
        branch: ""
      }));
    }
  }, [session]);

  useEffect(() => {
    const loadRegions = async () => {
      const res = await apiFetch(`/api/branches?type=REGION&size=100`);
      if (res.success) {
        setRegionOptions(res.data.content.map((b: any) => ({ value: b.id, label: b.name })));
      }
    };
    loadRegions();
  }, []);

  useEffect(() => {
    setFilters(prev => ({ ...prev, area: "", branch: "" }));
    setAreaOptions([]);
    setBranchOptions([]);

    const loadAreas = async () => {
      if (!filters.region) return;
      const res = await apiFetch(`/api/branches?type=AREA&regionId=${filters.region}`);
      if (res.success) {
        setAreaOptions(res.data.content.map((b: any) => ({ value: b.id, label: b.name })));
      }
    };
    loadAreas();
  }, [filters.region]);

  useEffect(() => {
    setFilters(prev => ({ ...prev, branch: "" }));
    setBranchOptions([]);

    const loadBranches = async () => {
      if (!filters.area) return;
      const res = await apiFetch(`/api/branches?type=BRANCH&areaId=${filters.area}`);
      if (res.success) {
        setBranchOptions(res.data.content.map((b: any) => ({ value: b.id, label: b.name })));
      }
    };
    loadBranches();
  }, [filters.area]);

  const updateFilter = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="space-y-1.5">
        <Label>Start Date</Label>
        <DateTimePicker value={filters.startDate} onChange={(val) => updateFilter("startDate", val)} disableTime />
      </div>
      <div className="space-y-1.5">
        <Label>End Date</Label>
        <DateTimePicker value={filters.endDate} onChange={(val) => updateFilter("endDate", val)} disableTime />
      </div>
      <div className="space-y-1.5">
        <Label>Status</Label>
        <Select value={filters.status} onValueChange={(val) => updateFilter("status", val)}>
          <SelectTrigger><SelectValue placeholder="Select Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="WAITING">Waiting</SelectItem>
            <SelectItem value="STARTED,PAUSED,CONTINUED">In Progress</SelectItem>
            <SelectItem value="STOPPED,CANCELED,TRANSFERRED">Finished</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label>Role</Label>
        <Select value={filters.frontliner} onValueChange={(val) => updateFilter("frontliner", val)}>
          <SelectTrigger><SelectValue placeholder="Select Role" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="CS">Customer Service</SelectItem>
            <SelectItem value="TELLER">Teller</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {branchType === null && (
        <div className="space-y-1.5">
          <Label>Region</Label>
          <Select value={filters.region} onValueChange={(val) => updateFilter("region", val)}>
            <SelectTrigger><SelectValue placeholder="Select Region" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {regionOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      {(branchType === null || branchType === "REGION") && (
        <div className="space-y-1.5">
          <Label>Area</Label>
          <Select value={filters.area} onValueChange={(val) => updateFilter("area", val)} disabled={!filters.region}>
            <SelectTrigger><SelectValue placeholder="Select Area" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {areaOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      {(branchType === null || branchType === "REGION" || branchType === "AREA") && (
        <div className="space-y-1.5">
          <Label>Branch</Label>
          <Select value={filters.branch} onValueChange={(val) => updateFilter("branch", val)} disabled={!filters.area}>
            <SelectTrigger><SelectValue placeholder="Select Branch" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {branchOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      <div className="col-span-full flex justify-end pt-3 border-t">
        <Input
          id="search"
          placeholder="Search by customer name, service type, queue number, or staff name..."
          className="max-w-lg"
          value={filters.search}
          onChange={(e) => updateFilter("search", e.target.value)}
        />
      </div>
    </div>
  );
};

export default QueueTableFilters;