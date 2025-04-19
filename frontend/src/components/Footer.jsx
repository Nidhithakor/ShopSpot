import React from 'react'
import { assets } from '../assets/frontend_assets/assets'
import Title from './Title';

const Footer = () => {
  return (
    <div>
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-4- text-sm">
        <div className='text-2xl'>
          {/* <img src={assets.logo} className="mb-5 w-32" alt="" /> */}
          <Title text1="ShopSpot "/>
          <p className="w-full text-sm md:w-1/2 text-gray-600">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti ad
            magnam, iure dignissimos similique vel consectetur dolores, a
            asperiores esse exercitationem, sed perspiciatis.
          </p>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>Home</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Privacy policy</li>
          </ul>
        </div>

        <div>
          <p className="text-xl font-medium  mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>+1-212-456-7890 </li>
            <li>contact@foreveryou.com</li>
          </ul>
        </div>
      </div>

      <div>
        <hr />
        <p className='py-5 text-sm text-center '>Copyright 2025@ forever.com - All Right Reserved</p>
      </div>
    </div>
  );
}

export default Footer