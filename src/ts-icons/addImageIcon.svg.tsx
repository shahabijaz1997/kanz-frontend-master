import * as React from "react"
import { SVGProps } from "react"
const AddImage = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={38}
        height={38}
        fill="none"
        {...props}
    >
        <path
            stroke={props.stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 5H5a4 4 0 0 0-4 4v20m0 0v4a4 4 0 0 0 4 4h24a4 4 0 0 0 4-4v-8M1 29l9.172-9.172a4 4 0 0 1 5.656 0L21 25m12-8v8m0 0-3.172-3.172a4 4 0 0 0-5.656 0L21 25m0 0 4 4m4-24h8m-4-4v8m-12 4h.02"
        />
    </svg>
)
export default AddImage;
