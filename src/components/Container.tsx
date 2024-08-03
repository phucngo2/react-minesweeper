interface Props {
  children: React.ReactNode;
}

export const Container: React.FC<Props> = ({ children }) => {
  return (
    <div className="artboard phone-1 bg-neutral card p-6 flex flex-col gap-8 min-w-[320px]">
      {children}
    </div>
  );
};
