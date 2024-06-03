import en from "../assets/resources/languages/en.json";
import ar from "../assets/resources/languages/ar.json";

const loadLanguage = (language: String = "en") => {
    const languages = [{ name: 'en', val: en }, { name: 'ar', val: ar }];
    let preferred = languages.find(lg => lg.name === language)?.val;
    return preferred || en;

}
export default loadLanguage;