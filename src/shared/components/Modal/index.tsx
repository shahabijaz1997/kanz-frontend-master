import React from "react";

const Modal = ({ show, children }: any) => {

    return (
        <React.Fragment>
            {show && (
                <React.Fragment>
                    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-[200] outline-none focus:outline-none">
                        <div className="relative w-auto my-6 mx-auto max-w-3xl inline-grid place-items-center h-full">
                            {/*content*/}
                            {children}
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-[199] bg-black"></div>
                </React.Fragment>
            )}
        </React.Fragment>
    );
}
export default Modal;