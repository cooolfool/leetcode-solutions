class Solution {
    public int lengthOfLongestSubstring(String s) {
        int len = s.length();
        String str = "";
        String res = "";
        for (int i = 0; i < len; i++) {
            char c = s.charAt(i);
            if (str.isEmpty()) {
                str += c;
            } else if (str.indexOf(c) != -1) {
                str += s.charAt(i);
                int index = str.indexOf(c);
                str = str.substring(index + 1);
            } else {
                str += s.charAt(i);
            }
            if (str.length() > res.length())
                res = str;
        }
          return res.length();
    }
}