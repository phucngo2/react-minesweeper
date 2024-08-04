interface Props {
  children: React.ReactNode;
}

export const Layout: React.FC<Props> = ({ children }) => {
  return (
    <div className="flex items-center p-6 overflow-auto lg:justify-center w-dvw h-dvh">
      {children}
    </div>
  );
};
