
// import React from 'react';

// const TodayVisitors = () => {
//   const todayVisitors = [
//     { branch: 'Pasar Senen', total: 76 },
//     { branch: 'Margonda', total: 67 },
//     { branch: 'Cempaka Mas', total: 45 },
//     { branch: 'Kota Wisata', total: 42 },
//     { branch: 'Rawamangun', total: 36 },
//     { branch: 'Pulo Gadung', total: 30 },
//     { branch: 'Pramuka', total: 12 },
//   ];

//   return (
//     <div className="p-6 bg-white rounded-lg shadow-md h-full">
//       <h3 className="text-xl font-semibold mb-4">Pengunjung Hari Ini</h3>
//       <table className="w-full text-sm">
//         <thead>
//           <tr>
//             <th className="text-left pb-2">Cabang</th>
//             <th className="text-right pb-2">Total Pengunjung</th>
//           </tr>
//         </thead>
//         <tbody>
//           {todayVisitors.map((visitor, index) => (
//             <tr key={index}>
//               <td className="py-1">{visitor.branch}</td>
//               <td className="py-1 text-right">{visitor.total}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default TodayVisitors;


// import React from 'react';

// const TodayVisitors = () => {
//   const todayVisitors = [
//     { branch: 'Pasar Senen', total: 76 },
//     { branch: 'Margonda', total: 67 },
//     { branch: 'Cempaka Mas', total: 45 },
//     { branch: 'Kota Wisata', total: 42 },
//     { branch: 'Rawamangun', total: 36 },
//     { branch: 'Pulo Gadung', total: 30 },
//     { branch: 'Pramuka', total: 12 },
//   ];

//   // Sort the visitors by total in descending order (if needed)
//   const sortedVisitors = todayVisitors.sort((a, b) => b.total - a.total);

//   return (
//     <div className="p-6 bg-white rounded-lg shadow-md h-full">
//       <h3 className="text-xl font-semibold mb-4">Pengunjung Hari Ini</h3>
//       <table className="w-full text-sm">
//         <thead>
//           <tr>
//             <th className="text-left pb-2">Sort</th> {/* Mengubah Cabang menjadi Sort */}
//             <th className="text-right pb-2">Total Pengunjung</th>
//           </tr>
//         </thead>
//         <tbody>
//           {sortedVisitors.map((visitor, index) => (
//             <tr key={index}>
//               <td className="py-1">{visitor.branch}</td> {/* Tetap menampilkan nama cabang */}
//               <td className="py-1 text-right">{visitor.total}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default TodayVisitors;


// import React from 'react';

// const TodayVisitors = () => {
//   const todayVisitors = [
//     { branch: 'Pasar Senen', total: 76 },
//     { branch: 'Margonda', total: 67 },
//     { branch: 'Cempaka Mas', total: 45 },
//     { branch: 'Kota Wisata', total: 42 },
//     { branch: 'Rawamangun', total: 36 },
//     { branch: 'Pulo Gadung', total: 30 },
//     { branch: 'Pramuka', total: 12 },
//   ];

//   // Sort the visitors by total in descending order
//   const sortedVisitors = todayVisitors.sort((a, b) => b.total - a.total);

//   return (
//     <div className="p-6 bg-white rounded-lg shadow-md h-full">
//       <h3 className="text-xl font-semibold mb-4">Pengunjung Hari Ini</h3>
//       <table className="w-full text-sm">
//         <thead>
//           <tr>
//             <th className="text-left pb-2">Sort</th> {/* Kolom baru untuk urutan */}
//             <th className="text-left pb-2">Cabang</th> {/* Tetap menampilkan Cabang */}
//             <th className="text-right pb-2">Total Pengunjung</th>
//           </tr>
//         </thead>
//         <tbody>
//           {sortedVisitors.map((visitor, index) => (
//             <tr key={index}>
//               <td className="py-1">{index + 1}</td> {/* Menampilkan urutan (sort) */}
//               <td className="py-1">{visitor.branch}</td> {/* Nama cabang */}
//               <td className="py-1 text-right">{visitor.total}</td> {/* Total pengunjung */}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default TodayVisitors;


// import React from 'react';

// const TodayVisitors = () => {
//   const todayVisitors = [
//     { branch: 'Pasar Senen', total: 76 },
//     { branch: 'Margonda', total: 67 },
//     { branch: 'Cempaka Mas', total: 45 },
//     { branch: 'Kota Wisata', total: 42 },
//     { branch: 'Rawamangun', total: 36 },
//     { branch: 'Pulo Gadung', total: 30 },
//     { branch: 'Pramuka', total: 12 },
//   ];

//   // Sort the visitors by total in descending order
//   const sortedVisitors = todayVisitors.sort((a, b) => b.total - a.total);

//   return (
//     <div className="p-6 bg-white rounded-lg shadow-md h-full">
//       <h3 className="text-xl font-semibold mb-4 p-4">Pengunjung Hari Ini</h3>
//       <table className="w-full text-sm">
//         <thead>
//           <tr>
//             {/* <th className="text-left pb-2">No</th> Urutan berdasarkan sort */}
//             <th className="text-left pb-2">Cabang</th> {/* Cabang */}
//             <th className="text-right pb-2">Total Pengunjung</th> {/* Total Pengunjung */}
//           </tr>
//         </thead>
//         <tbody>
//           {sortedVisitors.map((visitor, index) => (
//             <tr key={index}>
//               {/* <td className="py-1">{index + 1}  </td> Menampilkan nomor urut */}
//               <td className="py-1">{visitor.branch}</td> {/* Menampilkan nama cabang */}
//               <td className="py-1 text-right">{visitor.total}</td> {/* Total pengunjung */}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default TodayVisitors;

// import React, { useState } from 'react';

// const TodayVisitors = () => {
//   const [sortConfig, setSortConfig] = useState({ key: 'branch', direction: 'asc' });
  
//   const todayVisitors = [
//     { branch: 'Pasar Senen', total: 76 },
//     { branch: 'Margonda', total: 67 },
//     { branch: 'Cempaka Mas', total: 45 },
//     { branch: 'Kota Wisata', total: 42 },
//     { branch: 'Rawamangun', total: 36 },
//     { branch: 'Pulo Gadung', total: 30 },
//     { branch: 'Pramuka', total: 12 },
//   ];

//   // Function to handle sorting
//   const handleSort = (key) => {
//     let direction = 'asc';
//     if (sortConfig.key === key && sortConfig.direction === 'asc') {
//       direction = 'desc';
//     }
//     setSortConfig({ key, direction });
//   };

//   // Sort visitors based on the current sort configuration
//   const sortedVisitors = [...todayVisitors].sort((a, b) => {
//     if (a[sortConfig.key] < b[sortConfig.key]) {
//       return sortConfig.direction === 'asc' ? -1 : 1;
//     }
//     if (a[sortConfig.key] > b[sortConfig.key]) {
//       return sortConfig.direction === 'asc' ? 1 : -1;
//     }
//     return 0;
//   });

//   const getSortIcon = (key) => {
//     if (sortConfig.key === key) {
//       return sortConfig.direction === 'asc' ? '▲' : '▼';
//     }
//     return '↕'; // Default icon before sorting
//   };

//   return (
//     <div className="p-6 bg-white rounded-lg shadow-md h-full">
//       <h3 className="text-xl font-semibold mb-4">Pengunjung Hari Ini</h3>
//       <table className="w-full text-sm">
//         <thead>
//           <tr>
//             <th className="text-left pb-2 cursor-pointer" onClick={() => handleSort('branch')}>
//               Cabang {getSortIcon('branch')}
//             </th>
//             <th className="text-right pb-2 cursor-pointer" onClick={() => handleSort('total')}>
//               Total Pengunjung {getSortIcon('total')}
//             </th>
//           </tr>
//         </thead>
//         <tbody>
//           {sortedVisitors.map((visitor, index) => (
//             <tr key={index}>
//               <td className="py-1">{visitor.branch}</td>
//               <td className="py-1 text-right">{visitor.total}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default TodayVisitors;



// import React, { useState } from 'react';

// const TodayVisitors = () => {
//   const [sortConfig, setSortConfig] = useState({ key: 'branch', direction: 'asc' });
  
//   const todayVisitors = [
//     { branch: 'Pasar Senen', total: 76 },
//     { branch: 'Margonda', total: 67 },
//     { branch: 'Cempaka Mas', total: 45 },
//     { branch: 'Kota Wisata', total: 42 },
//     { branch: 'Rawamangun', total: 36 },
//     { branch: 'Pulo Gadung', total: 30 },
//     { branch: 'Pramuka', total: 12 },
//   ];

//   // Function to handle sorting
//   const handleSort = (key) => {
//     let direction = 'asc';
//     if (sortConfig.key === key && sortConfig.direction === 'asc') {
//       direction = 'desc';
//     }
//     setSortConfig({ key, direction });
//   };

//   // Sort visitors based on the current sort configuration
//   const sortedVisitors = [...todayVisitors].sort((a, b) => {
//     if (a[sortConfig.key] < b[sortConfig.key]) {
//       return sortConfig.direction === 'asc' ? -1 : 1;
//     }
//     if (a[sortConfig.key] > b[sortConfig.key]) {
//       return sortConfig.direction === 'asc' ? 1 : -1;
//     }
//     return 0;
//   });

//   // Update icon logic to show both arrows by default and change according to sort order
//   const getSortIcon = (key) => {
//     if (sortConfig.key === key) {
//       return sortConfig.direction === 'asc' ? '▲▼' : '▼▲';
//     }
//     return '▲▼'; // Default icon before sorting
//   };

//   return (
//     <div className="p-6 bg-white rounded-lg shadow-md h-full">
//       <h3 className="text-xl font-semibold mb-4">Pengunjung Hari Ini</h3>
//       <table className="w-full text-sm">
//         <thead>
//           <tr>
//             <th className="text-left pb-2 cursor-pointer" onClick={() => handleSort('branch')}>
//               Cabang {getSortIcon('branch')}
//             </th>
//             <th className="text-right pb-2 cursor-pointer" onClick={() => handleSort('total')}>
//               Total Pengunjung {getSortIcon('total')}
//             </th>
//           </tr>
//         </thead>
//         <tbody>
//           {sortedVisitors.map((visitor, index) => (
//             <tr key={index}>
//               <td className="py-1">{visitor.branch}</td>
//               <td className="py-1 text-right">{visitor.total}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default TodayVisitors;


// import React, { useState } from 'react';

// const TodayVisitors = () => {
//   const [sortConfig, setSortConfig] = useState({ key: 'branch', direction: 'asc' });
  
//   const todayVisitors = [
//     { branch: 'Pasar Senen', total: 76 },
//     { branch: 'Margonda', total: 67 },
//     { branch: 'Cempaka Mas', total: 45 },
//     { branch: 'Kota Wisata', total: 42 },
//     { branch: 'Rawamangun', total: 36 },
//     { branch: 'Pulo Gadung', total: 30 },
//     { branch: 'Pramuka', total: 12 },
//   ];

//   // Function to handle sorting
//   const handleSort = (key) => {
//     let direction = 'asc';
//     if (sortConfig.key === key && sortConfig.direction === 'asc') {
//       direction = 'desc';
//     }
//     setSortConfig({ key, direction });
//   };

//   // Sort visitors based on the current sort configuration
//   const sortedVisitors = [...todayVisitors].sort((a, b) => {
//     if (a[sortConfig.key] < b[sortConfig.key]) {
//       return sortConfig.direction === 'asc' ? -1 : 1;
//     }
//     if (a[sortConfig.key] > b[sortConfig.key]) {
//       return sortConfig.direction === 'asc' ? 1 : -1;
//     }
//     return 0;
//   });

//   // Function to render the appropriate sort icons as SVGs
//   const getSortIcon = (key) => {
//     return (
//       <span className="ml-2 inline-block">
//         <svg
//           width="9"
//           height="9"
//           viewBox="0 0 9 9"
//           fill="none"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           {/* Sort up arrow */}
//           <path
//             d="M4.2474 0L7.92575 3H0.569043L4.2474 0Z"
//             fill={sortConfig.key === key && sortConfig.direction === 'asc' ? '#000' : '#C0C0C0'}
//           />
//           {/* Sort down arrow */}
//           <path
//             d="M4.24748 9L0.569124 6L7.92583 6L4.24748 9Z"
//             fill={sortConfig.key === key && sortConfig.direction === 'desc' ? '#000' : '#C0C0C0'}
//           />
//         </svg>
//       </span>
//     );
//   };

//   return (
//     <div className="p-6 bg-white rounded-lg shadow-md h-full">
//       <h3 className="text-xl font-semibold mb-4">Pengunjung Hari Ini</h3>
//       <table className="w-full text-sm">
//         <thead>
//           <tr>
//             <th className="text-left pb-2 cursor-pointer" onClick={() => handleSort('branch')}>
//               Cabang {getSortIcon('branch')}
//             </th>
//             <th className="text-right pb-2 cursor-pointer" onClick={() => handleSort('total')}>
//               Total Pengunjung {getSortIcon('total')}
//             </th>
//           </tr>
//         </thead>
//         <tbody>
//           {sortedVisitors.map((visitor, index) => (
//             <tr key={index}>
//               <td className="py-1">{visitor.branch}</td>
//               <td className="py-1 text-right">{visitor.total}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default TodayVisitors;


import React, { useState, useEffect } from 'react';

const TodayVisitors = () => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  const todayVisitors = [
    { branch: 'Pasar Senen', total: 76 },
    { branch: 'Margonda', total: 67 },
    { branch: 'Cempaka Mas', total: 45 },
    { branch: 'Kota Wisata', total: 42 },
    { branch: 'Rawamangun', total: 36 },
    { branch: 'Pulo Gadung', total: 30 },
    { branch: 'Pramuka', total: 12 },
  ];

  // Function to handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Sort visitors based on the current sort configuration
  const sortedVisitors = [...todayVisitors].sort((a, b) => {
    if (sortConfig.key === null) return 0; // Do not sort initially
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Function to render the appropriate sort icons as SVGs
  const getSortIcon = (key) => {
    const isActive = sortConfig.key === key;
    const isDefaultState = sortConfig.key === null; // Default state when the component is first rendered

    return (
      <span className="ml-2 inline-block">
        <svg
          width="9"
          height="9"
          viewBox="0 0 9 9"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Sort up arrow */}
          <path
            d="M4.2474 0L7.92575 3H0.569043L4.2474 0Z"
            fill={isDefaultState || (isActive && sortConfig.direction === 'asc') ? '#000' : '#C0C0C0'}
          />
          {/* Sort down arrow */}
          <path
            d="M4.24748 9L0.569124 6L7.92583 6L4.24748 9Z"
            fill={isDefaultState || (isActive && sortConfig.direction === 'desc') ? '#000' : '#C0C0C0'}
          />
        </svg>
      </span>
    );
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md h-full">
      <h3 className="text-xl font-semibold mb-4">Pengunjung Hari Ini</h3>
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="text-left pb-2 cursor-pointer" onClick={() => handleSort('branch')}>
              Cabang {getSortIcon('branch')}
            </th>
            <th className="text-right pb-2 cursor-pointer" onClick={() => handleSort('total')}>
              Total Pengunjung {getSortIcon('total')}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedVisitors.map((visitor, index) => (
            <tr key={index}>
              <td className="py-1">{visitor.branch}</td>
              <td className="py-1 text-right">{visitor.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TodayVisitors;

