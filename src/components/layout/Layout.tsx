interface Props {
  children: React.ReactNode;
}

export const Layout: React.FC<Props> = ({ children }) => {
  return (
    <div className="overflow-auto w-dvw h-dvh bg-gradient-to-br from-base-100 via-base-100 to-base-200">
      <div className="flex flex-col items-center justify-center min-w-full min-h-full gap-3 p-6 w-fit">
        {children}
      </div>
    </div>
  );
};
