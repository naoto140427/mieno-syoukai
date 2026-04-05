#!/bin/bash
awk '
BEGIN { in_func = 0; }
/function RevealText/ {
    in_func = 1;
    print "  const RevealText = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => {";
    next;
}
{ print $0; }
' app/careers/page.tsx > temp.tsx && mv temp.tsx app/careers/page.tsx
