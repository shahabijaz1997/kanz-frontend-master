import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux-toolkit/store/store";

const SearchedItems = ({ items, searchString, passItemSelected }: any) => {
    const event: any = useSelector((state: RootState) => state.event.value);

    const renderSegregatedItems = () => {
        let filtered = items.map((it: any) => {
            if (searchString !== "" && it[event].name.toLowerCase().includes(searchString?.toLowerCase())) it.blue = true;
            else it.blue = false;
            return it;
        });

        return (
            React.Children.toArray(
                filtered.map((it: any) => <div onClick={() => passItemSelected(it[event]?.name)} className={`cursor-pointer rounded-md py-1 px-2 bg-cbc-check text-neutral-700 font-normal text-sm hover:bg-cbc-check-hover transition-all ${it.blue && "border-2 border-blue-500"}`}>{it[event].name}</div>)
            ))
    };


    return (
        <aside className="flex flex-wrap gap-4 mt-4 max-h-[350px] overflow-y-auto">
            {renderSegregatedItems()}
        </aside>
    )
};
export default SearchedItems;