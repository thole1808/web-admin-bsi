import Link from "next/link";
interface BreadcrumbProps {
  pageName: string;
}
const Breadcrumb = ({ pageName }: BreadcrumbProps) => {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-title-md2 font-semibold text-black dark:text-white">
        {pageName}
      </h2>

      <nav>
        <ol className="flex items-center gap-2">
          <li>
            <Link className="font-medium" href="/">
              Dashboard /
            </Link>
          </li>
          <li className="font-medium text-primary">{pageName}</li>
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
  

// COSTUMIZE
// 'use client';

// import Link from "next/link";
// import { usePathname } from "next/navigation";

// const Breadcrumb = () => {
//   const pathname = usePathname(); // Mendapatkan path URL saat ini
//   const pathnames = pathname.split("/").filter((x) => x); // Membagi path URL menjadi array

//   return (
//     <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//       <h2 className="text-title-md2 font-semibold text-black dark:text-white">
//         {pathnames[pathnames.length - 1]?.replace(/-/g, " ").toUpperCase() || "Home"}
//       </h2>

//       <nav>
//         <ol className="flex items-center gap-2">
//           {pathnames.map((value, index) => {
//             const href = `/${pathnames.slice(0, index + 1).join("/")}`; // Membentuk URL breadcrumb
//             const isLast = index === pathnames.length - 1; // Periksa apakah ini breadcrumb terakhir

//             return isLast ? (
//               <li key={index} className="font-medium text-primary">
//                 {value.replace(/-/g, " ").toUpperCase()}
//               </li>
//             ) : (
//               <li key={index}>
//                 <Link className="font-medium" href={href}>
//                   {value.replace(/-/g, " ").toUpperCase()} /
//                 </Link>
//               </li>
//             );
//           })}
//         </ol>
//       </nav>
//     </div>
//   );
// };

// export default Breadcrumb;
