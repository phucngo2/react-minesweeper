interface Props {
  children: React.ReactNode;
}

export const Layout: React.FC<Props> = ({ children }) => {
  return (
    <div className="flex items-center justify-center w-dvw h-dvh">
      {children}
    </div>
  );
};
