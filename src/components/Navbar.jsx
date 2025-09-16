import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'

function Navbar() {
 
  return (
    <div className='flex flex-row gap-[3rem] text-bold border rounded-md justify-center mb-[1rem] w-full h-[45px] items-center p-4 bg-gray-800'>
      
        <NavLink to='/'
            className={({isActive}) =>
                isActive
                  ? "text-blue-500 font-semibold text-3xl"
                  : "text-white font-medium text-2xl"
            }
        >
            Home
        </NavLink>
        <NavLink to='/pastes'
            className={({isActive}) =>
              isActive
                ? "text-blue-500 font-semibold text-3xl"
                : "text-white font-medium text-2xl"
            }
        >
            Pastes
        </NavLink>
    </div>
  )
}

export default Navbar