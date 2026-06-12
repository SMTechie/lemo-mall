"use client";

import { useEffect, useRef, useState } from "react";
import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";

export function SalesChart({ data }: { data: { date: string; total: number }[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const updateWidth = () => setWidth(Math.max(0, Math.floor(element.getBoundingClientRect().width)));
    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="h-80 min-h-80 w-full min-w-0 overflow-hidden">
      {width > 0 ? (
        <AreaChart data={data} width={width} height={320}>
          <defs>
            <linearGradient id="sales" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} />
          <Tooltip formatter={(value) => [`R ${Number(value).toFixed(2)}`, "Sales"]} />
          <Area type="monotone" dataKey="total" stroke="hsl(var(--primary))" fill="url(#sales)" />
        </AreaChart>
      ) : null}
    </div>
  );
}
