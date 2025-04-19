// import React from 'react'
// import { NavLink } from 'react-router-dom'
// import { assets } from '../../assets/frontend_assets/assets.js'

// const Sidebar = () => {
//   return (
//     <div className="w-[18%] min-h-screen border-r-2">
//       <div className="flex flex-col gap-4 pt-6 pl-[20%] text-[15px] ">
//         <NavLink
//           className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l "
//           to="/homeadmin/dashboard"
//         >
//           <img className="w-5 h-5" src={assets.add_icon} alt="" />
//           {/* <i class="fa-solid fa-table-columns"></i> */}
//           <p className=" md:block">Dashboard</p>
//         </NavLink>

      

//         <NavLink
//           to="/homeadmin/add"
//           className={({ isActive }) =>
//             `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l ${
//               isActive ? "bg-pink-200" : "hover:bg-gray-100"
//             }`
//           }
//         >
//           <img className="w-5 h-5" src={assets.add_icon} alt="" />
//           <p className="md:block">Add Items</p>
//         </NavLink>

//         <NavLink
//           className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l "
//           to="/homeadmin/list"
//         >
//           <img className="w-5 h-5" src={assets.order_icon} alt="" />
//           <p className=" md:block">List Items</p>
//         </NavLink>

//         <NavLink
//           className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l "
//           to="/homeadmin/orders"
//         >
//           <img className="w-5 h-5" src={assets.order_icon} alt="" />
//           <p className="  md:block ">Orders</p>
//         </NavLink>

//         <NavLink
//           className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l "
//           to="/homeadmin/users"
//         >
//           <img className="w-5 h-5" src={assets.order_icon} alt="" />
//           <p className="  md:block ">Users</p>
//         </NavLink>

//         <NavLink
//           className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l "
//           to="/homeadmin/reviews"
//         >
//           <img className="w-5 h-5" src={assets.order_icon} alt="" />
//           <p className=" md:block ">Reviews</p>
//         </NavLink>
//       </div>
//     </div>
//   );
// }

// export default Sidebar;


import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../../assets/frontend_assets/assets.js";

const Sidebar = () => {
  return (
    <div className="w-[18%] min-h-screen border-r-2">
      <div className="flex flex-col gap-4 pt-6 pl-[20%] text-[15px]">
        <NavLink
          to="/homeadmin/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l ${
              isActive ? "bg-pink-200" : "hover:bg-pink-100"
            }`
          }
        >
          <img className="w-5 h-5" src={assets.add_icon} alt="" />
          <p className="md:block">Dashboard</p>
        </NavLink>

        <NavLink
          to="/homeadmin/add"
          className={({ isActive }) =>
            `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l ${
              isActive ? "bg-pink-200" : "hover:bg-pink-100"
            }`
          }
        >
          <img className="w-5 h-5" src={assets.add_icon} alt="" />
          <p className="md:block">Add Items</p>
        </NavLink>

        <NavLink
          to="/homeadmin/list"
          className={({ isActive }) =>
            `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l ${
              isActive ? "bg-pink-200" : "hover:bg-pink-100"
            }`
          }
        >
          <img className="w-5 h-5" src={assets.order_icon} alt="" />
          <p className="md:block">List Items</p>
        </NavLink>

        <NavLink
          to="/homeadmin/orders"
          className={({ isActive }) =>
            `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l ${
              isActive ? "bg-pink-200" : "hover:bg-pink-100"
            }`
          }
        >
          <img className="w-5 h-5" src={assets.order_icon} alt="" />
          <p className="md:block">Orders</p>
        </NavLink>

        <NavLink
          to="/homeadmin/users"
          className={({ isActive }) =>
            `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l ${
              isActive ? "bg-pink-200" : "hover:bg-pink-100"
            }`
          }
        >
          <img className="w-5 h-5" src={assets.order_icon} alt="" />
          <p className="md:block">Users</p>
        </NavLink>

        <NavLink
          to="/homeadmin/reviews"
          className={({ isActive }) =>
            `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l ${
              isActive ? "bg-pink-200" : "hover:bg-pink-100"
            }`
          }
        >
          <img className="w-5 h-5" src={assets.order_icon} alt="" />
          <p className="md:block">Reviews</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
