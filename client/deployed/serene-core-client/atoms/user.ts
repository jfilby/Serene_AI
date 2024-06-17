import { atom } from 'recoil'

export const userProfileAtom = atom({
  key: 'userProfile',
  default: {
    id: null
  }
})
