import React from 'react'

function cards({className, image, title, heading, description}) {
  return (
    <div className='flex flex-col gap-3 group hover:cursor-pointer transition-all ease-in-out rounded-xl overflow-hidden'>
        <div className='w-full rounded-3xl overflow-hidden'>
            <img src={image} className='w-full scale-100 group-hover:scale-110 transition-transform duration-300 h-70' />
        </div>
        <div className='flex flex-col gap-1'>
            <h1 className='text-[#93662f]'>{title}</h1>
            <h2 className='text-3xl text-[#f05406] group-hover:underline'>{heading}</h2>
            <p className='leading-tight text-[#3f1801]'>{description}</p>
        </div>
    </div>
  )
}

export default cards