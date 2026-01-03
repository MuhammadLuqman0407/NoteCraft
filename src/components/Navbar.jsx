import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'

function Navbar() {
 
  
  return (
  <nav className="w-full bg-gradient-to-r from-slate-900 via-gray-900 to-slate-900
  border border-gray-700 rounded-xl mb-4 shadow-lg">

    <div className="flex items-center justify-center gap-10 h-14 px-6">

      <NavLink
        to="/"
        className={({ isActive }) =>
          `relative transition-all duration-300 ${
            isActive
              ? "text-indigo-400 font-semibold text-lg after:absolute after:left-0 after:-bottom-1 after:w-full after:h-[2px] after:bg-indigo-400"
              : "text-gray-200 text-base hover:text-indigo-300"
          }`
        }
      >
        Home
      </NavLink>

      <NavLink
        to="/pastes"
        className={({ isActive }) =>
          `relative transition-all duration-300 ${
            isActive
              ? "text-indigo-400 font-semibold text-lg after:absolute after:left-0 after:-bottom-1 after:w-full after:h-[2px] after:bg-indigo-400"
              : "text-gray-200 text-base hover:text-indigo-300"
          }`
        }
      >
        Pastes
      </NavLink>

    </div>
  </nav>
)

}

export default Navbar

