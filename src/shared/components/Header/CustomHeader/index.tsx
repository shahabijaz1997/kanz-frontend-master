const CustomHeader = ({ leftMenu, button }: any) => {
    return (
        <div className="container mx-auto px-12 py-4 flex items-center justify-between screen800:px-2">
            <h2 className="text-2xl font-bold text-cc-black screen500:text-sm">{leftMenu}</h2>
            {button}
        </div>
    )
};
export default CustomHeader;