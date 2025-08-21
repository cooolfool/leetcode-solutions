class Solution {
    public int romanToInt(String s) {
        int len = s.length();
        int res = 0;

        for (int i = len - 1; i > 0; i--) {
            if (s.charAt(i) == 'I') {
                res += 1;
            } else if (s.charAt(i) == 'V') {
                if (s.charAt(i - 1) == 'I') {
                    res += 4;
                    i--;
                    if(i==0)
                    return res;
                } else
                    res += 5;
            } else if (s.charAt(i) == 'X') {
                if (s.charAt(i - 1) == 'I') {
                    res += 9;
                    i--;
                    if(i==0)
                    return res;
                } else
                    res += 10;
            } else if (s.charAt(i) == 'L') {
                if (s.charAt(i - 1) == 'X') {
                    res += 40;
                    i--;
                    if(i==0)
                    return res;
                } else
                    res += 50;
            } else if (s.charAt(i) == 'C') {
                if (s.charAt(i - 1) == 'X') {
                    res += 90;
                    i--;
                    if(i==0)
                    return res;
                } else
                    res += 100;
            } else if (s.charAt(i) == 'D') {
                if (s.charAt(i - 1) == 'C') {
                    res += 400;
                    i--;
                    if(i==0)
                    return res;
                } else
                    res += 500;
            } else if (s.charAt(i) == 'M') {
                if (s.charAt(i - 1) == 'C') {
                    res += 900;
                    i--;
                    if(i==0)
                    return res;
                } else
                    res += 1000;
            }
        }

        char c = s.charAt(0);
        switch (c) {
            case 'I':
                res += 1;
                break;
            case 'V':
                res += 5;
                break;
            case 'X':
                res += 10;
                break;
            case 'L':
                res += 50;
                break;
            case 'C':
                res += 100;
                break;
            case 'D':
                res += 500;
                break;
            case 'M':
                res += 1000;
                break;
            default:
                res += 0;
        }
        return res;
    }
}