interface Props {
  children: React.ReactNode;
}

export const Layout: React.FC<Props> = ({ children }) => {
  return (
    <div className="flex flex-col items-start justify-center gap-4 p-6 overflow-auto lg:items-center w-dvw h-dvh">
      {children}
    </div>
  );
};
