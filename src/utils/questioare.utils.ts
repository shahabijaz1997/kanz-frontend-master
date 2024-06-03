export const checkExist = (elem: any, as: any) => {
    let found: any = elem?.questions.some((q: any) => q?.answer_meta?.options[0]?.index === as.index && q?.answer_meta?.options[0]?.statement === as.statement);
    return found;
};

export const checkExisting = (arr: any[], event: string): boolean => {
    for (const item of arr) {
        if (item[event]?.options) {
            for (const option of item[event].options) {
                if (option.selected) {
                    return true;
                }
            }
        } else if (item[event].answer) return true;
    }
    return false;
}