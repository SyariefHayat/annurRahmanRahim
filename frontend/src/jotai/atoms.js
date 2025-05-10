import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const wasLoggedIn = atomWithStorage("was login", false);
export const snapTokenAtomStorage = atomWithStorage("snap", null);

export const userDataAtom = atom([]);
export const isOpenAtom = atom(false);
export const articleAtom = atom(null);

export const allUsersAtom = atom([]);
export const allCampaignsAtom = atom([]);
export const allArticlesAtom = atom([]);
export const allTransactionsAtom = atom([]);

export const commentDataAtom = atom([]);
export const previewAlbumAtom = atom("");
export const previewPictureAtom = atom("");
export const userTransactionAtom = atom([]);