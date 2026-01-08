import Hashids from 'hashids';

export const postHashids = new Hashids('Post', 10);
export const userHashids = new Hashids('User', 10);