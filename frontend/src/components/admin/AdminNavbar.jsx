import React from 'react'
import {assets} from '../../assets/frontend_assets/assets.js'
import Title from '../Title.jsx';


const Navbar = ({setToken}) => {
  return (
    <div className="flex items-center py-2  px-[4%] justify-center">
      {/* <img className="w-[max(10%, 80px)]" alt="" /> */}
      <div className="text-2xl ">
        <Title text1="ADMIN" text2=" PANEL" />
      </div>
      {/* <button
        onClick={() => {
          setToken("");
        }}
        className="bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-r rounded-full text-xs sm:text-sm  "
      >
        Logout
      </button> */}
    </div>
  );
}

export default Navbar;


