import * as React from "react"
import { SVGProps } from "react"
const PreviewIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={12}
        height={12}
        fill="none"
        {...props}
    >
        <path
            stroke={props.stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={0.875}
            d="M3.375 1.188H2.5A1.313 1.313 0 0 0 1.187 2.5v.875m7.438-2.188H9.5A1.313 1.313 0 0 1 10.813 2.5v.875m0 5.25V9.5A1.313 1.313 0 0 1 9.5 10.813h-.875m-5.25 0H2.5A1.313 1.313 0 0 1 1.187 9.5v-.875M7.75 6a1.75 1.75 0 1 1-3.5 0 1.75 1.75 0 0 1 3.5 0Z"
        />
    </svg>
)
export default PreviewIcon;
