import React, { useState } from 'react'
import { IoArrowBack } from "react-icons/io5";
import Admin from '../../assets/admin.svg';
import { GrGroup } from "react-icons/gr";

const Menu  = [{
    id:1,
    img: <GrGroup />,
    text: "CUSTOMER"    
}]

const SideBar = () => {
    const [open, setOpen] = useState(true)
    const [menu, setMenu] = useState(Menu)

  return (
    <div style={{backgroundColor:'#015249',borderTopRightRadius:'20px'}} className={`bg-dark-purple h-screen p-5 pt-8 ${open ? "w-72" : "w-20" } duration-500`}>
        <div className="relative bg-white">
        <IoArrowBack style={{backgroundColor:'white'}} onClick={() => setOpen(!open)}  className={`bg-white absolute -right-8 text-3xl rounded-full border cursor-pointer text-dark-purple border-dark-purple ${!open && 'rotate-180'}`} />
        </div>
        <div style={{display:'flex', alignItems:'center'}} className="flex gap-2">
        <img className={`h-16 cursor-pointer rounded duration-500 ${open && 'rotate-[360deg]'}`} src={Admin} alt="admin" />
        <p style={{color:'white'}} className={`text-3xl duration-300 text-white origin-left font-semibold ${!open && "scale-0"}`}>Saviyant</p>
        </div>

        <ul className='pt-2 mt-20'>
        {
            menu.map((val)=> (
                <div className="" key={val.id}>
                    <li className='flex gap-x-4 text-sm items-center cursor-pointer p-2 hover:bg-light-white rounded-md mt-2' >
                        <span className='text-2xl block float-left p-1'>
                        <GrGroup size={30} color='white' />
                        </span>
                        <span style={{color:'white'}} className={`text-base font-medium flex-1 duration-200 ${!open && 'scale-0 ,hidden'}`}>{val.text}</span>
                    </li>
                </div>
            ))
        }
        </ul>

    </div>
  )
}

export default SideBar;