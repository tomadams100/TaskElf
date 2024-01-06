import { PresentType } from '../types';

export function addPresent(args: {
  setPresents: React.Dispatch<React.SetStateAction<PresentType[]>>;
}) {
  const { setPresents } = args;
  const randomPhotoIndex = Math.floor(Math.random() * 3);
  const randomSize = Math.floor(Math.random() * 45 + 45);
  const newPresent: PresentType = {
    id: Date.now(),
    left: `${Math.random() * 90}vw`,
    rotation: `${Math.random() * 150 - 75}deg`,
    img: ['./present.png', './presentBlue.png', './presentRed.png'][
      randomPhotoIndex
    ],
    size: `${randomSize}px`
  };

  setPresents((prevPresents) => [...prevPresents, newPresent]);
}
