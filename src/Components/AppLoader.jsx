export default function AppLoader({text="Loading...."}) {
  return (
    <div className="h-screen flex flex-col justify-center items-center gap-3">
      <div className="w-10 h-10 border-4 border-gray-300 border-t-[#6159CB] rounded-full animate-spin"></div>
      <p className="text-gray-500 text-sm">{text}</p>
    </div>
  )
}
