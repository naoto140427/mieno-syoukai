#!/bin/bash
awk '
BEGIN { in_func = 0; }
/function RevealText/ {
    in_func = 1;
    print $0;
    next;
}
/^[ \t]*};/ {
    if (in_func) {
        sub(/};/, "}");
        in_func = 0;
    }
}
{ print $0; }
' app/careers/page.tsx > temp.tsx && mv temp.tsx app/careers/page.tsx
