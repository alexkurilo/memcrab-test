import { WalkerModel } from "./models/Walker"
import { gsap, TimelineLite } from "gsap";

export const randomRange = (min: number, max: number): number => min + Math.random() * (max - min)
export const randomIndex = <Type>(array: Type[]): number => randomRange(0, array.length) | 0
export const removeFromArray = <Type>(array: Type[], i: number): Type => array.splice(i, 1)[0]
export const removeItemFromArray = <Type>(array: Type[], item: Type): Type => removeFromArray(array, array.indexOf(item))
export const removeRandomFromArray = <Type>(array: Type[]): Type => removeFromArray(array, randomIndex(array))
export const getRandomFromArray = <Type>(array: Type[]): Type => (
  array[randomIndex(array) | 0]
)