import '../Present.css';
import { PresentType } from '../types';

const Present = (args: { presents: PresentType[] }) => {
  const { presents } = args;
  return (
    <>
      {presents.map((present) => (
        <img
          key={present.id}
          src={present.img}
          alt="Present"
          className="present animate-present"
          style={{
            left: present.left,
            transform: `rotate(${present.rotation})`,
            width: present.size,
            height: present.size
          }}
        />
      ))}
    </>
  );
};

export default Present;
