import logo from "../assets/logo.png";

const Loading = () => {
  return (
    <div className='min-h-[100vh] flex items-center justify-center'>
        <img className="animate-pulse w-32" src={logo} alt="" />
        {/* Loading... */}
    </div>
  )
}

export default Loading
