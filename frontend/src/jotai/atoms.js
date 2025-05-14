import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const wasLoggedIn = atomWithStorage("was login", false);
export const snapTokenAtomStorage = atomWithStorage("snap", null);
export const anonymousIdAtomStorage = atomWithStorage("anonymousId", null);

export const userDataAtom = atom([]);
export const isOpenAtom = atom(false);
export const articleAtom = atom(null);

export const allUsersAtom = atom([]);
export const allArticlesAtom = atom([]);
export const allCampaignsAtom = atom([]);
export const allTransactionsAtom = atom([]);

export const commentDataAtom = atom([]);
export const isNewCommentAtom = atom(false);
export const previewAlbumAtom = atom("");
export const previewPictureAtom = atom("");
export const userTransactionAtom = atom([]);