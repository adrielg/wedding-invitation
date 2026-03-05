import Link from "next/link";

interface LogoProps {
  className?: string;
}

export default function Logo({ className = "" }: LogoProps) {
  return (
    <Link 
      href="/" 
      className={`inline-flex items-center gap-2 group ${className}`}
    >
      {/* Icon */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-500 to-violet-500 rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
        <div className="relative w-10 h-10 bg-gradient-to-br from-rose-500 to-violet-500 rounded-xl flex items-center justify-center shadow-lg">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
          </svg>
        </div>
      </div>
      
      {/* Text */}
      <div className="flex flex-col">
        <span className="text-base font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent leading-none">
          Reservá la Fecha
        </span>
        <span className="text-[10px] text-gray-500 leading-none mt-0.5">
          Invitaciones digitales
        </span>
      </div>
    </Link>
  );
}
