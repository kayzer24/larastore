import { CartItem } from '@/types';
import { show } from '@/routes/product';

export const arraysAreEqual = (arr1: never[], arr2: never[]) => {
    if (arr1.length !== arr2.length) return false;

    return arr1.every((value, index) => value === arr2[index]);
}


export const productRoute = (item: CartItem) => {
    const params = new URLSearchParams();
    Object.entries(item.option_ids)
        .forEach(([typeId, optionId]) => {
            params.append(`options[${typeId}]`, optionId + '')
    })

    return show(item.slug).url + '?' + params.toString();
}
