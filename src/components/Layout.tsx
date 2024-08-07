interface Props {
  children: React.ReactNode;
}

export const Layout: React.FC<Props> = ({ children }) => {
  return (
    <div className="flex flex-col items-start justify-center p-6 overflow-auto lg:items-center w-dvw h-dvh">
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
};
