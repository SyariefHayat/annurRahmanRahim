import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const wasLoggedIn = atomWithStorage("was login", false);
export const snapTokenAtomStorage = atomWithStorage("snap", null);
export const anonymousIdAtomStorage = atomWithStorage("anonymousId", null);

export const userDataAtom = atom([]);
export const isOpenAtom = atom(false);
export const articleAtom = atom(null);

export const allUsersAtom = atom([]);
export const allDonorsAtom = atom([]);
export const allArticlesAtom = atom([]);
export const allProgramsAtom = atom([]);
export const allCampaignsAtom = atom([]);
export const allNotificationsAtom = atom([]);

export const activeTabAtom = atom("donors");
export const commentDataAtom = atom([]);
export const previewAlbumAtom = atom("");
export const previewPictureAtom = atom("");
export const userTransactionAtom = atom([]);
export const isNewCommentAtom = atom(false);

export const messagesAtom = atom([]);
export const donorDataAtom = atom([]);
export const programDataAtom = atom([]);
export const campaignDataAtom = atom([]);

export const donorPageAtom = atom(1);
export const donorPaginationAtom = atom({
    total: 0,
    page: 1,
    limit: 6,
    totalPages: 0
});

export const messagePageAtom = atom(1);
export const messagePaginationAtom = atom({
    total: 0,
    page: 1,
    limit: 4,
    totalPages: 0
});