import { useDispatch } from "react-redux";
import { languageDropdownItems } from "../../../utils/dropdown-items.utils";
import Dropdown from "../../components/Dropdown";
import { saveEvent } from "../../../redux-toolkit/slicer/event.slicer";

const LanguageDrodownWrapper = ({ }: any) => {
    const dispatch = useDispatch();

    return (
        <Dropdown dropdownItems={languageDropdownItems} onSetSelected={(item: any) => {
            dispatch(saveEvent(item?.name));
        }} />
    )
};
export default LanguageDrodownWrapper;