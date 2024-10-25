
"use client";
import dynamic from "next/dynamic";
import React from "react";
import ChartTwo from "../Charts/ChartTwo";
import TodayVisitors from '../TodayVisitor/TodayVisitors';
import CardDataStats from "../CardDataStats";
import { FaUsers } from "react-icons/fa";
import StatsCard from '../StatsCard/StatsCard';

const MapOne = dynamic(() => import("@/components/Maps/MapOne"), { ssr: false });
const ChartThree = dynamic(() => import("@/components/Charts/ChartThree"), { ssr: false });
const ChartFour = dynamic(() => import("@/components/Charts/ChartFour"), { ssr: false });

const Dashboard: React.FC = () => {
  return (
    <>
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="col-span-1 md:col-span-3 space-y-6">
            <div className="grid grid-cols-3 md:grid-cols-3 gap-6">
              {/* <CardDataStats title="Total Semua Pengunjung" total="287" rate="8.5%">
                <svg width="114" height="114" viewBox="0 0 114 114" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path opacity="0.21" fillRule="evenodd" clipRule="evenodd" d="M57 114C88.4802 114 114 88.4802 114 57C114 25.5198 88.4802 0 57 0C25.5197 0 0 25.5198 0 57C0 88.4802 25.5197 114 57 114Z" fill="#0047BB" />
                  <path opacity="0.587821" fillRule="evenodd" clipRule="evenodd" d="M36.5834 40.8491C36.5834 47.985 41.8067 53.7697 48.25 53.7697C54.6933 53.7697 59.9167 47.985 59.9167 40.8491C59.9167 33.7132 54.6933 27.9285 48.25 27.9285C41.8067 27.9285 36.5834 33.7132 36.5834 40.8491ZM65.7499 53.7697C65.7499 59.1216 69.6674 63.4602 74.4999 63.4602C79.3324 63.4602 83.2499 59.1216 83.2499 53.7697C83.2499 48.4178 79.3324 44.0793 74.4999 44.0793C69.6674 44.0793 65.7499 48.4178 65.7499 53.7697Z" fill="#8280FF" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M48.2013 60.23C34.4304 60.23 23.1323 68.068 22.0018 83.4846C21.9402 84.3243 23.3903 86.0712 24.1217 86.0712H72.3027C74.4938 86.0712 74.5278 84.1185 74.4938 83.4871C73.6391 67.6374 62.1659 60.23 48.2013 60.23ZM73.3367 66.6923C76.9974 72.0906 79.1666 78.8004 79.1666 86.0713H90.4133C91.9957 86.0713 92.0203 84.6067 91.9957 84.1332C91.3852 72.3758 83.2724 66.8125 73.3367 66.6923Z" fill="#8280FF" />
                </svg>
              </CardDataStats> */}
              <StatsCard
                icon={<FaUsers />}
                title="Total Semua Pengunjung"
                value="287"
                change="8.5"
                positive={true}
              />
              <StatsCard
                icon={<FaUsers />}
                title="Total Semua Pengunjung"
                value="287"
                change="8.5"
                positive={true}
              />
              <StatsCard
                icon={<FaUsers />}
                title="Total Semua Pengunjung"
                value="287"
                change="8.5"
                positive={true}
              />
            </div>
            <ChartTwo />
          </div>
          <div className="col-span-1 sm:col-span-1">
            <TodayVisitors />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
