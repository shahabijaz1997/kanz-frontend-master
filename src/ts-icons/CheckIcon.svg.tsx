import * as React from "react"
import { SVGProps } from "react"
const CheckIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={9}
    height={6}
    fill="none"
    {...props}
  >
    <path
      fill={props.fill}
      d="M8.27.507a.535.535 0 0 1 0 .781L3.827 5.733a.535.535 0 0 1-.78 0L.822 3.51a.535.535 0 0 1 0-.78.535.535 0 0 1 .781 0l1.823 1.822L7.49.507a.535.535 0 0 1 .78 0Z"
    />
  </svg>
)
export default CheckIcon;
