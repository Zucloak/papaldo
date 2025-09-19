"use client";

import { format } from "date-fns";

const Header = () => {
  return (
    <header className="px-4 py-6 md:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl font-headline">
            Engi<span className="text-primary">Track</span>
          </h1>
          <div className="text-right">
            <p className="text-sm font-medium text-muted-foreground">
              {format(new Date(), "eeee")}
            </p>
            <p className="text-sm text-muted-foreground">
              {format(new Date(), "MMMM d, yyyy")}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
