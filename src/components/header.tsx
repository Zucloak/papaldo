"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";

const Header = () => {
  const [currentDate, setCurrentDate] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentDate(new Date());
  }, []);

  return (
    <header className="px-4 py-6 md:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl font-headline">
            Engi<span className="text-primary">Track</span>
          </h1>
          <div className="text-right">
            {currentDate ? (
              <>
                <p className="text-sm font-medium text-muted-foreground">
                  {format(currentDate, "eeee")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {format(currentDate, "MMMM d, yyyy")}
                </p>
              </>
            ) : (
              <>
                <div className="h-5 w-24 mb-1 rounded-md animate-pulse bg-muted" />
                <div className="h-5 w-32 rounded-md animate-pulse bg-muted" />
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
