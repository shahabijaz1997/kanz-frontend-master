import { useEffect, useRef, useState } from "react";
import Selector from "../Selector";

export default function CountrySelector({
  disabled = false,
  onChange,
  allCountries,
  defaultValue
}: any) {
  const ref = useRef<HTMLDivElement>(null);
  const [countries, setCountries] = useState(allCountries);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setCountries(allCountries);
  }, [allCountries])

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current.contains(event.target) && open) {
        setOpen(false);
        setQuery("");
      }
    };

    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [query, setQuery] = useState("");

  const dropDownOptions = countries?.map((item: any) => {
    return {
      label: item,
      value: item
    };
  });

  return (
    <div ref={ref}>
      <div className="relative w-full" style={{ zIndex: 99 }}>
        <Selector disabled={disabled} options={dropDownOptions && dropDownOptions} onChange={onChange} defaultValue={defaultValue} />
      </div>
    </div>
  );
}
