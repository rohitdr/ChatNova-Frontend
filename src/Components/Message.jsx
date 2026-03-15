

export default function Message(props) {
    const {message,send}=props



  return (
    <div className={` my-2 sm:my-6 w-full flex ${send?"flex-row-reverse":""}  `}>
 <div className=" flex flex-col justify-end max-w-[15%] ">        <img className='w-[40px] h-[38px]        lg:w-[40px]  lg:h-[41px] rounded-full  border-white border-4' src="https://res.cloudinary.com/do2twyxai/image/upload/v1772522690/users/u7rrlkdxjfr7y7f64oss.jpg" alt="" />
</div>
<div className="flex max-w-[85%] flex-col mb-2 ">
 <div className={`mx-2 2xs:text-sm xs:text-lg md:text-xl lg:text-base ${(message.type==="image" || message.type === "video")?"px-1":"px-4"} py-1 lg:p-4 ${send?"bg-[#6159CB] text-white":"bg-[#d0d3da] text-black"} rounded-lg lg:rounded-2xl ${send?"rounded-br-none":"rounded-bl-none"} `}>
  { message.type==="text" && message.text} 
  { message.type ==="image" && <img src={message.media.url} alt="" />}
 { message.type==="video" &&<video width="300" autoplay muted loop controls>
  <source src={message.media.url} type="video/mp4"/>
</video>}
  </div> <div className={`flex text-xs mx-2 ${send?"justify-end":"justify-start"}`}><div>{new Date(message.createdAt).toLocaleTimeString([],{ hour: "2-digit",
      minute: "2-digit"})}</div></div>
  
    </div></div>
  )
}
