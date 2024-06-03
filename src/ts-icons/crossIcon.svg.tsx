import * as React from "react"
import { SVGProps } from "react"
const CrossIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        stroke={props.stroke}
        strokeWidth={1.5}
        className="w-full h-full"
        viewBox="0 0 24 24"
        {...props}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18 18 6M6 6l12 12"
        />
    </svg>
)
export default CrossIcon;
