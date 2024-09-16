import {InquiryChoice} from '@/lib/types';
import {atom} from 'jotai';

export const choices = atom<InquiryChoice[]>([]);
export const addChoice = atom(null, (get, set, choice: InquiryChoice) => {
    set(choices, [...get(choices), choice]);
});
