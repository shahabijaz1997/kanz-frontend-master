import * as React from "react"
import { SVGProps } from "react"
const Chevrond = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        stroke={props?.stroke}
        strokeWidth={1.5}
        className="w-6 h-6"
        viewBox="0 0 24 24"
        {...props}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m19.5 8.25-7.5 7.5-7.5-7.5"
        />
    </svg>
)
export default Chevrond;
