import React from 'react'

const ContactUsPhoto = () => {
    return (
        <div className='bg-white py-5'>
          <div className=" min-h-full xl:px-[80px] lg:px-[40px] md:px-[50px]  relative flex items-center justify-center">
            <img
              src={"/images/venues_contactus.png"}
              width={1000}
              height={1000}
              className="h-[400px] w-full"
            />
            <i className="absolute lg:w-[914px] w-[80%] text-center lg:text-2xl md:text-xl text-md text-white ">
              “Ready to Turn your dream wedding into reality ? Contact us today and
              lets start planning your perfect days!”
            </i>
            <button
              type="submit"
              className="absolute bg-transparent text-white border-white border-2 font-bold py-2 px-4  w-[160px] h-[50px] md:w-[234px] md:h-[55px] rounded-full shadow-xl bottom-10"
            >
              Contact Us
            </button>
          </div>
        </div>
      )
}

export default ContactUsPhoto