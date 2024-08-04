interface Props {
  children: React.ReactNode;
}

export const Container: React.FC<Props> = ({ children }) => {
  return <div className="p-3 bg-neutral card">{children}</div>;
};
